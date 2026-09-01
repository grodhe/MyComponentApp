const express = require("express");

const controller = require("../controllers/settingsControllers");

const router = express.Router();

router.get("/", controller.getSettings);
router.put("/", controller.updateSettings);

module.exports = router;
