const express = require("express");

const controller = require("../controllers/projectDocumentsControllers");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllForProject);
router.post("/", controller.createProjectDocument);
router.put("/:id", controller.updateProjectDocument);
router.delete("/:id", controller.deleteProjectDocument);

module.exports = router;
