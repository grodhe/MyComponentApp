const service = require("../services/locationsServices");

async function getAllLocations(req, res) {

    try {

        const locations =
            await service.getAllLocations();

        res.json(locations);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllLocations
};