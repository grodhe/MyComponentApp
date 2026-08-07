const repository = require("../repositories/projectDocumentsRepository");
const { translatePgError } = require("../utils/pgErrors");

function normalize(data = {}) {

    return {
        document_name: (data.document_name ?? "").trim(),
        document_type: data.document_type ?? "",
        file_name: data.file_name ?? "",
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.document_name) {
        const error = new Error("document_name is required");
        error.status = 400;
        throw error;
    }

}

async function getAllForProject(projectId) {

    return await repository.getAllForProject(projectId);

}

async function createProjectDocument(projectId, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(projectId, normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function updateProjectDocument(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        const updated = await repository.update(id, normalized);

        if (!updated) {
            const error = new Error(`Project document ${id} not found`);
            error.status = 404;
            throw error;
        }

        return updated;

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deleteProjectDocument(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Project document ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllForProject,
    createProjectDocument,
    updateProjectDocument,
    deleteProjectDocument
};
