const express = require("express");
const router = express.Router();

const controller = require("../controllers/authControllers");
const requireAuth = require("../middleware/requireAuth");

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", requireAuth, controller.me);

module.exports = router;
