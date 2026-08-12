const service = require("../services/projectsServices");
const csvService = require("../services/projectsCsvService");

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


async function exportProjectsCsv(req, res) {

    try {

        const csv = await csvService.exportProjectsCsv();

        const date = new Date().toISOString().slice(0, 10);

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="projects_export_${date}.csv"`
        );

        res.send(csv);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function importProjectsCsv(req, res) {

    try {

        const csvText = req.body && req.body.csv;

        if (typeof csvText !== "string" || !csvText.trim()) {

            return res.status(400).json({
                error: "No CSV content was received."
            });

        }

        const result = await csvService.importProjectsCsv(csvText);

        res.json(result);

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
    deleteProject,
    exportProjectsCsv,
    importProjectsCsv
};
