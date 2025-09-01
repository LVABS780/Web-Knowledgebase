const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
require("dotenv").config({ quiet: true });
const authRouter = require("./routes/authRoutes");
const companyRouter = require("./routes/companyRoutes");
const resourceRouter = require("./routes/resourceRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api/company", companyRouter);
app.use("/api/resource", resourceRouter);

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database can not be connected", err.message);
  });
