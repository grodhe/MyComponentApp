const express = require("express");

const controller = require("../controllers/suppliersControllers");

const router = express.Router();

router.get("/", controller.getAllSuppliers);
router.get("/:id", controller.getSupplierById);
router.post("/", controller.createSupplier);
router.put("/:id", controller.updateSupplier);
router.delete("/:id", controller.deleteSupplier);

module.exports = router;
