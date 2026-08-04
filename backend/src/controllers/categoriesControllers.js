const service = require("../services/categoriesServices");

async function getAllCategories(req, res) {

    try {

        const categories =
            await service.getAllCategories();

        res.json(categories);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllCategories
};