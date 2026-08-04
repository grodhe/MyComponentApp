const express = require("express");

const controller = require("../controllers/locationsControllers");

const router = express.Router();

router.get("/", controller.getAllLocations);

module.exports = router;