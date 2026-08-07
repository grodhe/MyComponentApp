const express = require("express");

const controller = require("../controllers/projectsControllers");

const router = express.Router();

router.get("/", controller.getAllProjects);
router.get("/:id", controller.getProjectById);
router.post("/", controller.createProject);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

module.exports = router;
