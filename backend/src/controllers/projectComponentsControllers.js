const service = require("../services/projectComponentsServices");

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

async function createProjectComponent(req, res) {

    try {

        const row =
            await service.createProjectComponent(req.params.projectId, req.body);

        res.status(201).json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateProjectComponent(req, res) {

    try {

        const row =
            await service.updateProjectComponent(req.params.id, req.body);

        res.json(row);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteProjectComponent(req, res) {

    try {

        await service.deleteProjectComponent(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function exportBom(req, res) {

    try {

        const profileKey = (req.query.profile || "jlcpcb").toLowerCase();

        const csv = await service.exportBom(req.params.projectId, profileKey);

        const date = new Date().toISOString().slice(0, 10);

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${profileKey}_bom_project_${req.params.projectId}_${date}.csv"`
        );

        res.send(csv);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllForProject,
    createProjectComponent,
    updateProjectComponent,
    deleteProjectComponent,
    exportBom
};
