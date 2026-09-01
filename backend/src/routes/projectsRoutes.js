const express = require("express");

const controller = require("../controllers/projectsControllers");
const photoController = require("../controllers/projectPhotoControllers");
const { upload } = require("../middleware/projectPhotoUpload");

const router = express.Router();

router.get("/", controller.getAllProjects);

router.get("/export/csv", controller.exportProjectsCsv);
router.post("/import/csv", controller.importProjectsCsv);

router.get("/:id", controller.getProjectById);
router.post("/", controller.createProject);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

router.get("/:id/photo", photoController.getPhoto);

// Wrapped manually (instead of just `upload.single("photo")` inline) so a
// multer error -- wrong file type, over the 5MB limit -- comes back as a
// clean JSON error instead of Express's default HTML error page. Mirrors
// componentsRoutes.js.
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
