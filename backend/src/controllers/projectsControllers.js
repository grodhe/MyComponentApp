const service = require("../services/projectsServices");

async function getAllProjects(req, res) {

    try {

        const projects =
            await service.getAllProjects();

        res.json(projects);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function getProjectById(req, res) {

    try {

        const project =
            await service.getProjectById(req.params.id);

        if (!project) {

            return res.status(404).json({
                error: `Project ${req.params.id} not found`
            });

        }

        res.json(project);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createProject(req, res) {

    try {

        const project =
            await service.createProject(req.body);

        res.status(201).json(project);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateProject(req, res) {

    try {

        const project =
            await service.updateProject(req.params.id, req.body);

        res.json(project);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteProject(req, res) {

    try {

        await service.deleteProject(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
