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

router.use(userAuth);

router.post("/", createResource);
router.get("/company/:companyId", getResourcesByCompany);
router.get("/categories", getCategoriesByCompany);
router.get("/", getResources);
router.get("/:resourceId", getResourceById);
router.put("/:resourceId", updateResource);
router.delete("/:resourceId", deleteResource);

module.exports = router;
