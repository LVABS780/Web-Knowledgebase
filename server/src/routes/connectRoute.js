const express = require("express");
const router = express.Router();
const {
  createLetsConnect,
  getLetsConnect,
} = require("../controllers/connectController");

router.get("/", getLetsConnect);

router.get("/:companyId", getLetsConnect);

router.post("/:companyId", createLetsConnect);

module.exports = router;
