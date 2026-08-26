const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventoryLookupController");

// Mounted at /api/inventory-lookup in server.js, so this is reachable as
// GET /api/inventory-lookup?barcode=CODE.
router.get("/", controller.lookupByBarcode);

module.exports = router;
