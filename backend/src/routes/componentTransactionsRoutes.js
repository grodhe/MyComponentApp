// Mounted at /api/components/:componentId/transactions -- history and new
// stock movements scoped to a single component.
const express = require("express");

const controller = require("../controllers/inventoryTransactionsControllers");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getComponentTransactions);
router.post("/", controller.createTransaction);

module.exports = router;
