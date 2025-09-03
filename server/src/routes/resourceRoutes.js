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
router.put("/:resourceId", userAuth, updateResource);
router.delete("/:resourceId", userAuth, deleteResource);
router.get("/company/:companyId", userAuth, getResourcesByCompany);
router.get("/categories", userAuth, getCategoriesByCompany);

router.get("/:resourceId", getResourceById);

module.exports = router;
