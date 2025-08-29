const express = require("express");
const {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanies,
} = require("../controllers/company Controller");
const userAuth = require("../middlewares/userAuth");
const router = express.Router();
router.use(userAuth);

router.post("/", createCompany);
router.patch("/:companyId", updateCompany);
router.delete("/", deleteCompany);
router.get("/", getCompanies);

module.exports = router;
