const fs = require("fs");
const path = require("path");

const config = require("../config/app");
const componentsRepository = require("../repositories/componentsRepository");

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function findPhotoPath(id) {

    for (const ext of EXTENSIONS) {

        const candidate = path.join(config.uploads.componentsDir, `${id}${ext}`);

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
            error: "No photo uploaded for this component."
        });

    }

    res.sendFile(photoPath, (err) => {

        if (err && !res.headersSent) {

            console.error("Failed to send component photo:", err);
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
        // both sitting on disk (which would make findPhotoPath's
        // extension-order matter and could serve the wrong one).
        const keepFilename = req.file.filename;

        for (const ext of EXTENSIONS) {

            const candidate = path.join(config.uploads.componentsDir, `${req.params.id}${ext}`);

            if (path.basename(candidate) !== keepFilename && fs.existsSync(candidate)) {
                fs.unlinkSync(candidate);
            }

        }

        // So the frontend's cache-busting query param (?v=updated_at)
        // changes and the browser actually fetches the new image instead
        // of showing a cached copy at the same URL.
        await componentsRepository.touchUpdatedAt(req.params.id);

        res.status(201).json({ success: true });

    } catch (err) {

        console.error("Failed to save component photo:", err);

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

        await componentsRepository.touchUpdatedAt(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error("Failed to delete component photo:", err);

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
