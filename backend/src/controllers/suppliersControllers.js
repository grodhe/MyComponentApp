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

async function getSupplierById(req, res) {

    try {

        const supplier =
            await service.getSupplierById(req.params.id);

        if (!supplier) {

            return res.status(404).json({
                error: `Supplier ${req.params.id} not found`
            });

        }

        res.json(supplier);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createSupplier(req, res) {

    try {

        const supplier =
            await service.createSupplier(req.body);

        res.status(201).json(supplier);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateSupplier(req, res) {

    try {

        const supplier =
            await service.updateSupplier(req.params.id, req.body);

        res.json(supplier);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteSupplier(req, res) {

    try {

        await service.deleteSupplier(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
