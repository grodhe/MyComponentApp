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

async function getLocationById(req, res) {

    try {

        const location =
            await service.getLocationById(req.params.id);

        if (!location) {

            return res.status(404).json({
                error: `Location ${req.params.id} not found`
            });

        }

        res.json(location);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function getLocationContents(req, res) {

    try {

        const contents =
            await service.getLocationContents(req.params.id);

        res.json(contents);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function createLocation(req, res) {

    try {

        const location =
            await service.createLocation(req.body);

        res.status(201).json(location);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateLocation(req, res) {

    try {

        const location =
            await service.updateLocation(req.params.id, req.body);

        res.json(location);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteLocation(req, res) {

    try {

        await service.deleteLocation(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllLocations,
    getLocationById,
    getLocationContents,
    createLocation,
    updateLocation,
    deleteLocation
};
