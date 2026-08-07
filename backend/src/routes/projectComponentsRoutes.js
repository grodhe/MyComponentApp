const express = require("express");

const controller = require("../controllers/projectComponentsControllers");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllForProject);
router.post("/", controller.createProjectComponent);
router.put("/:id", controller.updateProjectComponent);
router.delete("/:id", controller.deleteProjectComponent);

module.exports = router;
