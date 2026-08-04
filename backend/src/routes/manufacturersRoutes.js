const express = require("express");

const controller = require("../controllers/manufacturersControllers");

const router = express.Router();

router.get("/", controller.getAllManufacturers);

module.exports = router;