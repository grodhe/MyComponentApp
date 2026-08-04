const service = require("../services/componentsServices");

async function getAllComponents(req, res) {

    try {

        const categories =
            await service.getAllComponents();

        res.json(categories);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllComponents
};