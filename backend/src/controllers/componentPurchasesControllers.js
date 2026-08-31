const service = require("../services/componentPurchasesServices");

async function getAllForComponent(req, res) {

    try {

        const rows =
            await service.getAllForComponent(req.params.componentId);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createPurchase(req, res) {

    try {

        const row =
            await service.createPurchase(req.params.componentId, req.body);

        res.status(201).json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deletePurchase(req, res) {

    try {

        await service.deletePurchase(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllForComponent,
    createPurchase,
    deletePurchase
};
