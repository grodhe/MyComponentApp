const service = require("../services/componentsServices");
const csvService = require("../services/componentsCsvService");

async function getAllComponents(req, res) {

    try {

        const components =
            await service.getAllComponents();

        res.json(components);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function getComponentById(req, res) {

    try {

        const component =
            await service.getComponentById(req.params.id);

        if (!component) {

            return res.status(404).json({
                error: `Component ${req.params.id} not found`
            });

        }

        res.json(component);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createComponent(req, res) {

    try {

        const component =
            await service.createComponent(req.body);

        res.status(201).json(component);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateComponent(req, res) {

    try {

        const component =
            await service.updateComponent(req.params.id, req.body);

        res.json(component);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteComponent(req, res) {

    try {

        await service.deleteComponent(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}


async function exportComponentsCsv(req, res) {

    try {

        const csv = await csvService.exportComponentsCsv();

        const date = new Date().toISOString().slice(0, 10);

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="components_export_${date}.csv"`
        );

        res.send(csv);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function importComponentsCsv(req, res) {

    try {

        const csvText = req.body && req.body.csv;

        if (typeof csvText !== "string" || !csvText.trim()) {

            return res.status(400).json({
                error: "No CSV content was received."
            });

        }

        const result = await csvService.importComponentsCsv(csvText);

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllComponents,
    getComponentById,
    createComponent,
    updateComponent,
    deleteComponent,
    exportComponentsCsv,
    importComponentsCsv
};
