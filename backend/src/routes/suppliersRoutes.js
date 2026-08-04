const express = require("express");

const controller = require("../controllers/suppliersControllers");

const router = express.Router();

router.get("/", controller.getAllSuppliers);

module.exports = router;