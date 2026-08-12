const service = require("../services/genericItemsServices");
const csvService = require("../services/genericItemsCsvService");

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


async function exportGenericItemsCsv(req, res) {

    try {

        const csv = await csvService.exportGenericItemsCsv();

        const date = new Date().toISOString().slice(0, 10);

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="generic_items_export_${date}.csv"`
        );

        res.send(csv);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function importGenericItemsCsv(req, res) {

    try {

        const csvText = req.body && req.body.csv;

        if (typeof csvText !== "string" || !csvText.trim()) {

            return res.status(400).json({
                error: "No CSV content was received."
            });

        }

        const result = await csvService.importGenericItemsCsv(csvText);

        res.json(result);

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
    deleteGenericItem,
    exportGenericItemsCsv,
    importGenericItemsCsv
};
