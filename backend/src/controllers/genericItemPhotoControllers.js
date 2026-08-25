// Mirrors componentPhotoControllers.js for generic items. Kept as a
// separate file rather than refactored into a shared helper so the
// already-working, already-tested Component photo code path isn't
// touched by this change.

const fs = require("fs");
const path = require("path");

const config = require("../config/app");
const genericItemsRepository = require("../repositories/genericItemsRepository");

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function findPhotoPath(id) {

    for (const ext of EXTENSIONS) {

        const candidate = path.join(config.uploads.genericItemsDir, `${id}${ext}`);

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
            error: "No photo uploaded for this item."
        });

    }

    res.sendFile(photoPath, (err) => {

        if (err && !res.headersSent) {

            console.error("Failed to send generic item photo:", err);
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

        // multer already wrote the new file as "{id}.{ext}" -- clean up
        // any leftover file from a previous upload that used a different
        // extension, so re-uploading a PNG over an old JPG doesn't leave
        // both sitting on disk.
        const keepFilename = req.file.filename;

        for (const ext of EXTENSIONS) {

            const candidate = path.join(config.uploads.genericItemsDir, `${req.params.id}${ext}`);

            if (path.basename(candidate) !== keepFilename && fs.existsSync(candidate)) {
                fs.unlinkSync(candidate);
            }

        }

        // So the frontend's cache-busting query param (?v=updated_at)
        // changes and the browser actually fetches the new image instead
        // of showing a cached copy at the same URL.
        await genericItemsRepository.touchUpdatedAt(req.params.id);

        res.status(201).json({ success: true });

    } catch (err) {

        console.error("Failed to save generic item photo:", err);

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

        await genericItemsRepository.touchUpdatedAt(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error("Failed to delete generic item photo:", err);

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
