const service = require("../services/projectGenericItemsServices");

async function getAllForProject(req, res) {

    try {

        const rows =
            await service.getAllForProject(req.params.projectId);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createProjectGenericItem(req, res) {

    try {

        const row =
            await service.createProjectGenericItem(req.params.projectId, req.body);

        res.status(201).json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateProjectGenericItem(req, res) {

    try {

        const row =
            await service.updateProjectGenericItem(req.params.id, req.body);

        res.json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteProjectGenericItem(req, res) {

    try {

        await service.deleteProjectGenericItem(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllForProject,
    createProjectGenericItem,
    updateProjectGenericItem,
    deleteProjectGenericItem
};
