const service = require("../services/componentsServices");

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

module.exports = {
    getAllComponents,
    getComponentById,
    createComponent,
    updateComponent,
    deleteComponent
};
