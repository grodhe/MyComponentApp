const express = require("express");
const router = express.Router();

const controller = require("../controllers/backupControllers");

router.get("/", controller.downloadBackup);

module.exports = router;
