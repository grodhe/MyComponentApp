const express = require("express");

const controller = require("../controllers/projectStatusControllers");

const router = express.Router();

router.get("/", controller.getAllProjectStatuses);

module.exports = router;
