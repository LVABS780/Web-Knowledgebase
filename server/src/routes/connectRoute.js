const express = require("express");
const {
  createLetsConnect,
  getLetsConnect,
} = require("../controllers/connectController");

const router = express.Router();

router.post("/", createLetsConnect);
router.get("/", getLetsConnect);

module.exports = router;
