const express = require("express");
const {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
} = require("../controllers/companyController");
const userAuth = require("../middlewares/userAuth");
const router = express.Router();
router.use(userAuth);

router.post("/", createCompany);
router.patch("/:companyId", updateCompany);
router.delete("/:companyId", deleteCompany);
router.get("/", getCompanies);
router.get("/:companyId", getCompanyById);

module.exports = router;
