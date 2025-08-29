const mongoose = require("mongoose");
const { Resource } = require("../models/resource");

exports.createResource = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (req.user.role !== "COMPANY_ADMIN") {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "you are unauthorized to create resource",
      });
    }
    const { title, description } = req.body;
    if (!title || !description) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const resource = await Resource.create({
      title,
      description,
    });
    await resource.save();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during resource creation", error.message);
    console.error("Create resource error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create resource" });
  }
};
