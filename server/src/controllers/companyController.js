const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { User, Company } = require("../models/user");

async function createOneCompanyTransactional(session, reqUser, payload) {
  const { name, email, phone, password, address } = payload;
  if (!name || !email || !password) {
    throw new Error("Missing required fields");
  }

  const orClauses = [{ email }];
  if (phone) orClauses.push({ phone });

  const existingUser = await User.findOne({ $or: orClauses }).lean();
  if (existingUser) {
    throw new Error("Email or phone number already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newCompanyArr = await Company.create(
    [
      {
        name,
        address: address || "",
        superAdminId: reqUser.id,
      },
    ],
    { session }
  );
  const newCompany = newCompanyArr[0];

  const createdUsers = await User.create(
    [
      {
        name,
        email,
        ...(phone ? { phone } : {}),
        password: hashedPassword,
        role: "COMPANY_ADMIN",
        companyId: newCompany._id,
      },
    ],
    { session }
  );
  const companyAdmin = createdUsers[0];
  const safeAdmin = companyAdmin.toObject();
  delete safeAdmin.password;

  return { company: newCompany, companyAdmin: safeAdmin };
}

exports.createCompany = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const body = req.body;

  if (Array.isArray(body)) {
    if (body.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array",
      });
    }

    const created = [];
    const failed = [];

    for (const [index, item] of body.entries()) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const result = await createOneCompanyTransactional(
          session,
          req.user,
          item || {}
        );
        await session.commitTransaction();
        session.endSession();
        created.push(result);
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        failed.push({
          index,
          error: err.message || "Failed to create company",
        });
      }
    }

    return res.status(207).json({
      success: true,
      message: "Bulk create processed",
      data: { created, failed },
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await createOneCompanyTransactional(
      session,
      req.user,
      body || {}
    );
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: result,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create company error:", err);
    const msg =
      err.message === "Missing required fields" ||
      err.message?.includes("already exists")
        ? err.message
        : "Failed to create company";
    return res.status(400).json({ success: false, message: msg });
  }
};

exports.updateCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (req.user.role !== "SUPER_ADMIN") {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { companyId } = req.params;
    const { address, isActive, name, email, phone, password } = req.body;

    const company = await Company.findById(companyId).session(session);
    if (!company) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    if (typeof address !== "undefined") company.address = address;
    if (typeof isActive !== "undefined") company.isActive = isActive;
    if (typeof name !== "undefined") company.name = name;

    await company.save({ session });

    const updatedCompany = await Company.findById(companyId)
      .lean()
      .session(session);

    const adminUser = await User.findOne({
      companyId: companyId,
      role: "COMPANY_ADMIN",
    }).session(session);

    if (adminUser) {
      if (email || phone) {
        const conflict = await User.findOne({
          $or:
            email && phone
              ? [{ email }, { phone }]
              : email
              ? [{ email }]
              : [{ phone }],
          _id: { $ne: adminUser._id },
        }).lean();

        if (conflict) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: "Email or phone already in use by another user",
          });
        }
      }

      if (typeof name !== "undefined") adminUser.name = name;
      if (typeof email !== "undefined") adminUser.email = email;
      if (typeof phone !== "undefined") adminUser.phone = phone;
      if (typeof password !== "undefined" && password !== "") {
        adminUser.password = await bcrypt.hash(password, 10);
      }

      await adminUser.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    const safeAdmin = adminUser ? adminUser.toObject() : null;
    if (safeAdmin) delete safeAdmin.password;

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: {
        updatedCompany,
        companyAdmin: safeAdmin,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} must be unique. "${err.keyValue[field]}" already exists.`,
      });
    }

    console.error("Update company error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update company" });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { companyId } = req.params;

    const softDeletedCompany = await Company.findByIdAndUpdate(
      companyId,
      { isActive: false },
      { new: true }
    );

    if (!softDeletedCompany) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Company deleted (deactivated) successfully",
      data: softDeletedCompany,
    });
  } catch (err) {
    console.error("Delete company error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete company" });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const company = await Company.findById(companyId).lean();
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    const companyAdmin = await User.findOne({
      companyId: company._id,
      role: "COMPANY_ADMIN",
    })
      .select("-password")
      .lean();

    const superAdmin = await User.findById(company.superAdminId)
      .select("-password")
      .lean();

    const result = {
      company,
      companyAdmin,
      superAdmin,
    };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Get company by ID error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch company" });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().lean();

    if (!companies || companies.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No companies found" });
    }

    const result = await Promise.all(
      companies.map(async (company) => {
        const companyAdmin = await User.findOne({
          companyId: company._id,
          role: "COMPANY_ADMIN",
        })
          .select("-password")
          .lean();

        const superAdmin = await User.findById(company.superAdminId)
          .select("-password")
          .lean();

        return {
          company,
          companyAdmin,
          superAdmin,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Get companies error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch companies" });
  }
};
