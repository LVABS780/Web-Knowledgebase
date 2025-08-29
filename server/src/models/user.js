const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    phone: {
      type: String,
      unique: true,
      match: [/^\d{10}$/, "Please provide a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: function () {
        return this.role === "COMPANY_ADMIN" || this.role === "EMPLOYEE";
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const companySchema = new mongoose.Schema(
  {
    address: {
      type: String,
    },

    superAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
exports.User = mongoose.models.User || mongoose.model("User", userSchema);
exports.Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
