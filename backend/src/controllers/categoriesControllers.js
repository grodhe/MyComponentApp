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

async function getCategoryById(req, res) {

    try {

        const category =
            await service.getCategoryById(req.params.id);

        if (!category) {

            return res.status(404).json({
                error: `Category ${req.params.id} not found`
            });

        }

        res.json(category);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

async function createCategory(req, res) {

    try {

        const category =
            await service.createCategory(req.body);

        res.status(201).json(category);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function updateCategory(req, res) {

    try {

        const category =
            await service.updateCategory(req.params.id, req.body);

        res.json(category);

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

async function deleteCategory(req, res) {

    try {

        await service.deleteCategory(req.params.id);

        res.status(204).send();

    } catch (err) {

        console.error(err);

        res.status(err.status || 500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
