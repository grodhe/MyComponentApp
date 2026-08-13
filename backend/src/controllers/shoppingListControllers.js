const service = require("../services/shoppingListServices");

async function getAllShoppingListItems(req, res) {

    try {

        const items =
            await service.getAllShoppingListItems();

        res.json(items);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function getShoppingListItemById(req, res) {

    try {

        const item =
            await service.getShoppingListItemById(req.params.id);

        if (!item) {

            return res.status(404).json({
                error: `Shopping list item ${req.params.id} not found`
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

async function createShoppingListItem(req, res) {

    try {

        const item =
            await service.createShoppingListItem(req.body);

        res.status(201).json(item);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateShoppingListItem(req, res) {

    try {

        const item =
            await service.updateShoppingListItem(req.params.id, req.body);

        res.json(item);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteShoppingListItem(req, res) {

    try {

        await service.deleteShoppingListItem(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllShoppingListItems,
    getShoppingListItemById,
    createShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem
};
