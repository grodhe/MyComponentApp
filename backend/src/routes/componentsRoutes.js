const express = require("express");
const router = express.Router();

const controller = require("../controllers/componentsControllers");

router.get("/", controller.getAllComponents);
module.exports = router;