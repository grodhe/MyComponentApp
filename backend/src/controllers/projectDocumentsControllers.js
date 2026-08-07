const service = require("../services/projectDocumentsServices");

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

async function createProjectDocument(req, res) {

    try {

        const row =
            await service.createProjectDocument(req.params.projectId, req.body);

        res.status(201).json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateProjectDocument(req, res) {

    try {

        const row =
            await service.updateProjectDocument(req.params.id, req.body);

        res.json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteProjectDocument(req, res) {

    try {

        await service.deleteProjectDocument(req.params.id);

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
    createProjectDocument,
    updateProjectDocument,
    deleteProjectDocument
};
