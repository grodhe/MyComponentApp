const express = require("express");

const controller = require("../controllers/manufacturersControllers");

const router = express.Router();

router.get("/", controller.getAllManufacturers);
router.get("/:id", controller.getManufacturerById);
router.post("/", controller.createManufacturer);
router.put("/:id", controller.updateManufacturer);
router.delete("/:id", controller.deleteManufacturer);

module.exports = router;
