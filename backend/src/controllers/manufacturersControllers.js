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

module.exports = {
    getAllManufacturers
};