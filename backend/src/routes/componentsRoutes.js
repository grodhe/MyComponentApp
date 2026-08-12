const express = require("express");
const router = express.Router();

const controller = require("../controllers/componentsControllers");

router.get("/", controller.getAllComponents);

// These have to be registered before "/:id" -- otherwise Express would
// treat "export" and "import" as an :id value and route them to
// getComponentById instead.
router.get("/export/csv", controller.exportComponentsCsv);
router.post("/import/csv", controller.importComponentsCsv);

router.get("/:id", controller.getComponentById);
router.post("/", controller.createComponent);
router.put("/:id", controller.updateComponent);
router.delete("/:id", controller.deleteComponent);

module.exports = router;
