const repository = require("../repositories/projectRepositoriesRepository");
const { translatePgError } = require("../utils/pgErrors");

function normalize(data = {}) {

    return {
        repository_name: (data.repository_name ?? "").trim(),
        repository_type: data.repository_type ?? "",
        repository_url: (data.repository_url ?? "").trim(),
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.repository_name) {
        const error = new Error("repository_name is required");
        error.status = 400;
        throw error;
    }

    if (!normalized.repository_url) {
        const error = new Error("repository_url is required");
        error.status = 400;
        throw error;
    }

}

async function getAllForProject(projectId) {

    return await repository.getAllForProject(projectId);

}

async function createProjectRepository(projectId, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(projectId, normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function updateProjectRepository(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        const updated = await repository.update(id, normalized);

        if (!updated) {
            const error = new Error(`Project repository ${id} not found`);
            error.status = 404;
            throw error;
        }

        return updated;

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deleteProjectRepository(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Project repository ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllForProject,
    createProjectRepository,
    updateProjectRepository,
    deleteProjectRepository
};
