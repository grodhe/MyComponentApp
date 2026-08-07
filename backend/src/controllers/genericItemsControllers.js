const service = require("../services/genericItemsServices");

async function getAllGenericItems(req, res) {

    try {

        const items =
            await service.getAllGenericItems();

        res.json(items);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function getGenericItemById(req, res) {

    try {

        const item =
            await service.getGenericItemById(req.params.id);

        if (!item) {

            return res.status(404).json({
                error: `Generic item ${req.params.id} not found`
            });

        }

        res.json(item);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createGenericItem(req, res) {

    try {

        const item =
            await service.createGenericItem(req.body);

        res.status(201).json(item);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateGenericItem(req, res) {

    try {

        const item =
            await service.updateGenericItem(req.params.id, req.body);

        res.json(item);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteGenericItem(req, res) {

    try {

        await service.deleteGenericItem(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllGenericItems,
    getGenericItemById,
    createGenericItem,
    updateGenericItem,
    deleteGenericItem
};
