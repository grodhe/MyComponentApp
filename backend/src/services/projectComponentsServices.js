const repository = require("../repositories/projectComponentsRepository");
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
        component_id: toIntOrNull(data.component_id),
        quantity: quantity === null ? 1 : quantity,
        reference_designators: data.reference_designators ?? "",
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.component_id) {
        const error = new Error("component_id is required");
        error.status = 400;
        throw error;
    }

}

async function getAllForProject(projectId) {

    return await repository.getAllForProject(projectId);

}

async function createProjectComponent(projectId, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(projectId, normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function updateProjectComponent(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        const updated = await repository.update(id, normalized);

        if (!updated) {
            const error = new Error(`Project component ${id} not found`);
            error.status = 404;
            throw error;
        }

        return updated;

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deleteProjectComponent(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Project component ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllForProject,
    createProjectComponent,
    updateProjectComponent,
    deleteProjectComponent
};
