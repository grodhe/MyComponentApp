const service = require("../services/projectRepositoriesServices");

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

async function createProjectRepository(req, res) {

    try {

        const row =
            await service.createProjectRepository(req.params.projectId, req.body);

        res.status(201).json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateProjectRepository(req, res) {

    try {

        const row =
            await service.updateProjectRepository(req.params.id, req.body);

        res.json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteProjectRepository(req, res) {

    try {

        await service.deleteProjectRepository(req.params.id);

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
    createProjectRepository,
    updateProjectRepository,
    deleteProjectRepository
};
