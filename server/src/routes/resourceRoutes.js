const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByCompany,
  getCategoriesByCompany,
} = require("../controllers/resourceController");

router.get("/", getResources);
router.post("/", userAuth, createResource);

router.get("/categories", userAuth, getCategoriesByCompany);

router.get("/company/:companyId", getResourcesByCompany);

router.get("/:resourceId", getResourceById);
router.put("/:resourceId", userAuth, updateResource);
router.delete("/:resourceId", userAuth, deleteResource);

module.exports = router;

module.exports = router;
