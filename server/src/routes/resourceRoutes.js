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
} = require("../controllers/resourceController");

router.use(userAuth);

router.post("/", createResource);
router.get("/", getResources);
router.get("/:resourceId", getResourceById);
router.put("/:resourceId", updateResource);
router.delete("/:resourceId", deleteResource);

router.get("/company/:companyId", getResourcesByCompany);

module.exports = router;
