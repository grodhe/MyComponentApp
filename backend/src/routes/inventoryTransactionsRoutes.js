// Mounted at /api/inventory-transactions -- the full movement log across
// every component, for the standalone Inventory Transactions page.
const express = require("express");

const controller = require("../controllers/inventoryTransactionsControllers");

const router = express.Router();

router.get("/", controller.getAllTransactions);

module.exports = router;
