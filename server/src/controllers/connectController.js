const mongoose = require("mongoose");
const { LetsConnect } = require("../models/let-connect");

exports.createLetsConnect = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phone, services } = req.body;

    if (!name || !email || !services || services.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const orClauses = [{ email }];
    if (phone) {
      orClauses.push({ phone });
    }

    const existingEntry = await LetsConnect.findOne({ $or: orClauses }).lean();
    if (existingEntry) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Email or phone already exists" });
    }

    const newEntryArr = await LetsConnect.create(
      [
        {
          name,
          email,
          ...(phone ? { phone } : {}),
          services,
        },
      ],
      { session }
    );

    const newEntry = newEntryArr[0];

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully",
      data: newEntry,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Create LetsConnect error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit registration" });
  }
};

exports.getLetsConnect = async (req, res) => {
  try {
    const entries = await LetsConnect.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (err) {
    console.error("Get LetsConnect error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch registrations" });
  }
};
