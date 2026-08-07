const service = require("../services/projectTasksServices");

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

async function createProjectTask(req, res) {

    try {

        const row =
            await service.createProjectTask(req.params.projectId, req.body);

        res.status(201).json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateProjectTask(req, res) {

    try {

        const row =
            await service.updateProjectTask(req.params.id, req.body);

        res.json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteProjectTask(req, res) {

    try {

        await service.deleteProjectTask(req.params.id);

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
    createProjectTask,
    updateProjectTask,
    deleteProjectTask
};
