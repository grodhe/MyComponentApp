const express = require("express");

const controller = require("../controllers/projectGenericItemsControllers");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllForProject);
router.post("/", controller.createProjectGenericItem);
router.put("/:id", controller.updateProjectGenericItem);
router.delete("/:id", controller.deleteProjectGenericItem);

module.exports = router;
