const express = require("express");
const router = express.Router();

const controller = require("../controllers/componentsControllers");

router.get("/", controller.getAllComponents);
router.get("/:id", controller.getComponentById);
router.post("/", controller.createComponent);
router.put("/:id", controller.updateComponent);
router.delete("/:id", controller.deleteComponent);

module.exports = router;
