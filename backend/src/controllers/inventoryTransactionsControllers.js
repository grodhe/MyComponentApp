const service = require("../services/inventoryTransactionsServices");

async function createTransaction(req, res) {

    try {

        const result =
            await service.recordTransaction(req.params.componentId, req.body);

        res.status(201).json(result);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function getComponentTransactions(req, res) {

    try {

        const transactions =
            await service.getComponentTransactions(req.params.componentId);

        res.json(transactions);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function getAllTransactions(req, res) {

    try {

        const transactions =
            await service.getAllTransactions();

        res.json(transactions);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

module.exports = {
    createTransaction,
    getComponentTransactions,
    getAllTransactions
};
