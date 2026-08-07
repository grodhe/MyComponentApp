const repository = require("../repositories/projectGenericItemsRepository");
const { translatePgError } = require("../utils/pgErrors");

function toIntOrNull(value) {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

}

function normalize(data = {}) {

    const quantity = toIntOrNull(data.quantity);

    return {
        generic_item_id: toIntOrNull(data.generic_item_id),
        quantity: quantity === null ? 1 : quantity,
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.generic_item_id) {
        const error = new Error("generic_item_id is required");
        error.status = 400;
        throw error;
    }

}

async function getAllForProject(projectId) {

    return await repository.getAllForProject(projectId);

}

async function createProjectGenericItem(projectId, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(projectId, normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function updateProjectGenericItem(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        const updated = await repository.update(id, normalized);

        if (!updated) {
            const error = new Error(`Project generic item ${id} not found`);
            error.status = 404;
            throw error;
        }

        return updated;

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deleteProjectGenericItem(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Project generic item ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllForProject,
    createProjectGenericItem,
    updateProjectGenericItem,
    deleteProjectGenericItem
};
