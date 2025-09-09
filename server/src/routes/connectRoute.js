const express = require("express");
const router = express.Router();
const {
  createLetsConnect,
  getLetsConnect,
} = require("../controllers/connectController");

router.get("/connect", getLetsConnect);

router.get("/connect/:companyId", getLetsConnect);

router.post("/connect/:companyId", createLetsConnect);

module.exports = router;
