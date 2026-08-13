const express = require("express");
const router = express.Router();

const controller = require("../controllers/shoppingListControllers");

router.get("/", controller.getAllShoppingListItems);
router.get("/:id", controller.getShoppingListItemById);
router.post("/", controller.createShoppingListItem);
router.put("/:id", controller.updateShoppingListItem);
router.delete("/:id", controller.deleteShoppingListItem);

module.exports = router;
