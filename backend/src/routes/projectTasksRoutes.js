const express = require("express");

const controller = require("../controllers/projectTasksControllers");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllForProject);
router.post("/", controller.createProjectTask);
router.put("/:id", controller.updateProjectTask);
router.delete("/:id", controller.deleteProjectTask);

module.exports = router;
