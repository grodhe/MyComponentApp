const repository = require("../repositories/projectsRepository");

// Converts "" -> null so Postgres doesn't choke on empty strings where it
// expects an integer (status_id) or a date (start_date/target_date/completed_date).
function toValueOrNull(value) {

    if (value === "" || value === undefined) {
        return null;
    }

    return value;

}

function toIntOrNull(value) {

    const normalized = toValueOrNull(value);

    if (normalized === null) {
        return null;
    }

    const parsed = Number(normalized);

    return Number.isNaN(parsed) ? null : parsed;

}

function normalize(data = {}) {

    return {
        project_number: (data.project_number ?? "").trim(),
        project_name: (data.project_name ?? "").trim(),
        description: data.description ?? "",
        status_id: toIntOrNull(data.status_id),
        version: data.version ?? "",
        start_date: toValueOrNull(data.start_date),
        target_date: toValueOrNull(data.target_date),
        completed_date: toValueOrNull(data.completed_date),
        github_url: data.github_url ?? "",
        documentation_url: data.documentation_url ?? "",
        image_url: data.image_url ?? "",
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.project_number) {
        const error = new Error("project_number is required");
        error.status = 400;
        throw error;
    }

    if (!normalized.project_name) {
        const error = new Error("project_name is required");
        error.status = 400;
        throw error;
    }

    if (!normalized.status_id) {
        const error = new Error("status_id is required");
        error.status = 400;
        throw error;
    }

}

async function getAllProjects() {

    return await repository.getAll();

}

async function getProjectById(id) {

    return await repository.getById(id);

}

async function createProject(data) {

    const normalized = normalize(data);

    validate(normalized);

    return await repository.create(normalized);

}

async function updateProject(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    const updated = await repository.update(id, normalized);

    if (!updated) {
        const error = new Error(`Project ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteProject(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Project ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    normalizeProject: normalize
};
