const service = require("../services/suppliersServices");

async function getAllSuppliers(req, res) {

    try {

        const suppliers =
            await service.getAllSuppliers();

        res.json(suppliers);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllSuppliers
};