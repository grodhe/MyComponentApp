const express = require("express");

const controller = require("../controllers/locationsControllers");

const router = express.Router();

router.get("/", controller.getAllLocations);
router.get("/:id/contents", controller.getLocationContents);
router.get("/:id", controller.getLocationById);
router.post("/", controller.createLocation);
router.put("/:id", controller.updateLocation);
router.delete("/:id", controller.deleteLocation);

module.exports = router;
