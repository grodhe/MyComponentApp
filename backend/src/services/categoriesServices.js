const repository = require("../repositories/categoriesRepository");

function normalize(data = {}) {

    return {
        name: (data.name ?? "").trim(),
        description: data.description ?? ""
    };

}

async function getAllCategories() {

    return await repository.getAll();

}

async function getCategoryById(id) {

    return await repository.getById(id);

}

async function createCategory(data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    return await repository.create(normalized);

}

async function updateCategory(id, data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    const updated = await repository.update(id, normalized);

    if (!updated) {
        const error = new Error(`Category ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteCategory(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Category ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
