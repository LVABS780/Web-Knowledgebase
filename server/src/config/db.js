const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = async () => {
  const mongoUri = process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error("Mongo Uri is not defined in environment variable");
  } else {
    await mongoose.connect(mongoUri);
  }
};
