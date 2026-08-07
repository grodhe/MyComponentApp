const express = require("express");

const controller = require("../controllers/projectRepositoriesControllers");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllForProject);
router.post("/", controller.createProjectRepository);
router.put("/:id", controller.updateProjectRepository);
router.delete("/:id", controller.deleteProjectRepository);

module.exports = router;
