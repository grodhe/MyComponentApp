const service = require("../services/manufacturersServices");

async function getAllManufacturers(req, res) {

    try {

        const manufacturers =
            await service.getAllManufacturers();

        res.json(manufacturers);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function getManufacturerById(req, res) {

    try {

        const manufacturer =
            await service.getManufacturerById(req.params.id);

        if (!manufacturer) {

            return res.status(404).json({
                error: `Manufacturer ${req.params.id} not found`
            });

        }

        res.json(manufacturer);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createManufacturer(req, res) {

    try {

        const manufacturer =
            await service.createManufacturer(req.body);

        res.status(201).json(manufacturer);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateManufacturer(req, res) {

    try {

        const manufacturer =
            await service.updateManufacturer(req.params.id, req.body);

        res.json(manufacturer);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteManufacturer(req, res) {

    try {

        await service.deleteManufacturer(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllManufacturers,
    getManufacturerById,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer
};
