const express = require("express");

const controller = require("../controllers/genericItemsControllers");

const router = express.Router();

router.get("/", controller.getAllGenericItems);

router.get("/export/csv", controller.exportGenericItemsCsv);
router.post("/import/csv", controller.importGenericItemsCsv);

router.get("/:id", controller.getGenericItemById);
router.post("/", controller.createGenericItem);
router.put("/:id", controller.updateGenericItem);
router.delete("/:id", controller.deleteGenericItem);

module.exports = router;
