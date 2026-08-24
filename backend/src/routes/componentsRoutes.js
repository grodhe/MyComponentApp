const express = require("express");
const router = express.Router();

const controller = require("../controllers/componentsControllers");
const photoController = require("../controllers/componentPhotoControllers");
const { upload } = require("../middleware/photoUpload");

router.get("/", controller.getAllComponents);

// These have to be registered before "/:id" -- otherwise Express would
// treat "export" and "import" as an :id value and route them to
// getComponentById instead.
router.get("/export/csv", controller.exportComponentsCsv);
router.post("/import/csv", controller.importComponentsCsv);

router.get("/:id", controller.getComponentById);
router.post("/", controller.createComponent);
router.put("/:id", controller.updateComponent);
router.delete("/:id", controller.deleteComponent);

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
