const multer = require("multer");

const config = require("../config/app");

const ALLOWED_MIME_TO_EXT = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, config.uploads.componentsDir);
    },

    filename: (req, file, cb) => {

        const ext = ALLOWED_MIME_TO_EXT[file.mimetype];

        // fileFilter below already rejects anything not in this map, so
        // ext should always be defined here -- this is just a safety net.
        cb(null, `${req.params.id}${ext || ""}`);

    }

});

const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },

    fileFilter: (req, file, cb) => {

        if (!ALLOWED_MIME_TO_EXT[file.mimetype]) {

            cb(new Error("Only JPEG, PNG, or WEBP images are allowed."));
            return;

        }

        cb(null, true);

    }

});

module.exports = {
    upload,
    ALLOWED_MIME_TO_EXT
};
