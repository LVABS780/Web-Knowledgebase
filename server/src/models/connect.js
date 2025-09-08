const mongoose = require("mongoose");

const letsConnectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    services: {
      type: [String],
      required: [true, "At least one service is required"],
    },
  },
  { timestamps: true }
);

const LetsConnect = mongoose.model("LetsConnect", letsConnectSchema);
module.exports = { LetsConnect };
