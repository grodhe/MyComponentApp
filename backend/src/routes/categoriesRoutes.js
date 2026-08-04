const express = require("express");

const controller = require("../controllers/categoriesControllers");

const router = express.Router();

router.get("/", controller.getAllCategories);

module.exports = router;module.exports = router;