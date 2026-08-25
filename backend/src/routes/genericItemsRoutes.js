const express = require("express");

const controller = require("../controllers/genericItemsControllers");
const photoController = require("../controllers/genericItemPhotoControllers");
const { upload } = require("../middleware/genericItemPhotoUpload");

const router = express.Router();

router.get("/", controller.getAllGenericItems);

router.get("/export/csv", controller.exportGenericItemsCsv);
router.post("/import/csv", controller.importGenericItemsCsv);

router.get("/:id", controller.getGenericItemById);
router.post("/", controller.createGenericItem);
router.put("/:id", controller.updateGenericItem);
router.delete("/:id", controller.deleteGenericItem);

router.get("/:id/photo", photoController.getPhoto);

// Wrapped manually (instead of just `upload.single("photo")` inline) so a
// multer error -- wrong file type, over the 5MB limit -- comes back as a
// clean JSON error instead of Express's default HTML error page.
router.post("/:id/photo", (req, res, next) => {

    upload.single("photo")(req, res, (err) => {

        if (err) {

            const message = err.code === "LIMIT_FILE_SIZE"
                ? "That photo is too large -- the limit is 5MB."
                : err.message || "Failed to upload photo.";

            return res.status(400).json({ error: message });

        }

        next();

    });

}, photoController.uploadPhoto);

router.delete("/:id/photo", photoController.deletePhoto);

module.exports = router;
