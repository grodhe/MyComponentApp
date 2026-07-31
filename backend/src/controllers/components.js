const service = require("../services/components");

async function getAll(req, res) {
    try {
        const components = await service.getAllComponents();
        res.json(components);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
}

module.exports = {
    getAll
};