const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    sections: {
      type: [
        {
          subtitle: {
            type: String,
            trim: true,
          },
          description: {
            type: String,
            trim: true,
          },
        },
      ],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceCategory",
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

const resourceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

const ResourceCategory =
  mongoose.models.ResourceCategory ||
  mongoose.model("ResourceCategory", resourceCategorySchema);

const Resource =
  mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

module.exports = { Resource, ResourceCategory };
