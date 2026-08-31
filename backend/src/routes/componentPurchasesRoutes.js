const express = require("express");

const controller = require("../controllers/componentPurchasesControllers");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllForComponent);
router.post("/", controller.createPurchase);
router.delete("/:id", controller.deletePurchase);

module.exports = router;
