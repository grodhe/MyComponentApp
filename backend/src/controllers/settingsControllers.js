const service = require("../services/settingsServices");

async function getSettings(req, res) {

    try {

        const settings = await service.getSettings();
        res.json(settings);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function updateSettings(req, res) {

    try {

        const settings = await service.updateSettings(req.body);
        res.json(settings);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getSettings,
    updateSettings
};
