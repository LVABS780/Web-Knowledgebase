const mongoose = require("mongoose");
const Resource = require("../models/resource");

exports.createResource = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (req.user.role !== "COMPANY_ADMIN") {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "You are unauthorized to create resource",
      });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const resource = await Resource.create(
      [
        {
          title,
          description,
          createdBy: req.user.id,
          companyId: req.user.id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during resource creation:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create resource" });
  }
};

exports.getResources = async (req, res) => {
  try {
    const { search, isActive } = req.query;

    let query = {};

    if (req.user.role === "COMPANY_ADMIN") {
      query.companyId = req.user.companyId;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(query)
      .populate("createdBy", "name email")
      .populate("companyId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error("Get resources error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch resources" });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: "Resource ID is required",
      });
    }

    let query = { _id: resourceId };

    if (req.user.role === "COMPANY_ADMIN") {
      query.companyId = req.user.companyId;
    }

    const resource = await Resource.findOne(query)
      .populate("createdBy", "name email")
      .populate("companyId", "name")
      .lean();

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error("Get resource by ID error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch resource" });
  }
};

exports.updateResource = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { resourceId } = req.params;
    const { title, description, isActive } = req.body;

    if (req.user.role !== "COMPANY_ADMIN") {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "You are unauthorized to update resource",
      });
    }

    const resource = await Resource.findOne({
      _id: resourceId,
      companyId: req.user.companyId,
    }).session(session);

    if (!resource) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    if (title !== undefined) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (isActive !== undefined) resource.isActive = isActive;

    await resource.save({ session });

    const updatedResource = await Resource.findById(resourceId)
      .populate("createdBy", "name email")
      .populate("companyId", "name")
      .lean()
      .session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: updatedResource,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Update resource error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update resource" });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (req.user.role !== "COMPANY_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are unauthorized to delete resource",
      });
    }

    const resource = await Resource.findOne({
      _id: resourceId,
      companyId: req.user.companyId,
    });

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    resource.isActive = false;
    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Delete resource error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete resource" });
  }
};

exports.getResourcesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { search, isActive } = req.query;

    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only SUPER_ADMIN can view resources by company",
      });
    }

    let query = { companyId };

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(query)
      .populate("createdBy", "name email")
      .populate("companyId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error("Get resources by company error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch resources" });
  }
};
