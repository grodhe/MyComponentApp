// Mirrors componentPhotoControllers.js -- see that file for the reasoning
// behind the extension-cleanup-on-reupload and cache-busting-via-
// touchUpdatedAt behavior below.

const fs = require("fs");
const path = require("path");

const config = require("../config/app");
const projectsRepository = require("../repositories/projectsRepository");

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function findPhotoPath(id) {

    for (const ext of EXTENSIONS) {

        const candidate = path.join(config.uploads.projectsDir, `${id}${ext}`);

        if (fs.existsSync(candidate)) {
            return candidate;
        }

    }

    return null;

}

async function getPhoto(req, res) {

    const photoPath = findPhotoPath(req.params.id);

    if (!photoPath) {

        return res.status(404).json({
            error: "No photo uploaded for this project."
        });

    }

    res.sendFile(photoPath, (err) => {

        if (err && !res.headersSent) {

            console.error("Failed to send project photo:", err);
            res.status(500).json({ error: "Failed to load photo." });

        }

    });

}

async function uploadPhoto(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({
                error: "No photo file received."
            });

        }

        const keepFilename = req.file.filename;

        for (const ext of EXTENSIONS) {

            const candidate = path.join(config.uploads.projectsDir, `${req.params.id}${ext}`);

            if (path.basename(candidate) !== keepFilename && fs.existsSync(candidate)) {
                fs.unlinkSync(candidate);
            }

        }

        await projectsRepository.touchUpdatedAt(req.params.id);

        res.status(201).json({ success: true });

    } catch (err) {

        console.error("Failed to save project photo:", err);

        res.status(500).json({
            error: "Failed to save the uploaded photo."
        });

    }

}

async function deletePhoto(req, res) {

    try {

        const photoPath = findPhotoPath(req.params.id);

        if (photoPath) {
            fs.unlinkSync(photoPath);
        }

        await projectsRepository.touchUpdatedAt(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error("Failed to delete project photo:", err);

        res.status(500).json({
            error: "Failed to delete the photo."
        });

    }

}

module.exports = {
    getPhoto,
    uploadPhoto,
    deletePhoto
};
