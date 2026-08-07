const repository = require("../repositories/projectTasksRepository");
const { translatePgError } = require("../utils/pgErrors");

function toValueOrNull(value) {

    if (value === "" || value === undefined) {
        return null;
    }

    return value;

}

function normalize(data = {}) {

    return {
        title: (data.title ?? "").trim(),
        status: data.status || "Open",
        priority: data.priority ?? "",
        due_date: toValueOrNull(data.due_date),
        completed_date: toValueOrNull(data.completed_date),
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.title) {
        const error = new Error("title is required");
        error.status = 400;
        throw error;
    }

}

async function getAllForProject(projectId) {

    return await repository.getAllForProject(projectId);

}

async function createProjectTask(projectId, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(projectId, normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function updateProjectTask(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        const updated = await repository.update(id, normalized);

        if (!updated) {
            const error = new Error(`Project task ${id} not found`);
            error.status = 404;
            throw error;
        }

        return updated;

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deleteProjectTask(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Project task ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllForProject,
    createProjectTask,
    updateProjectTask,
    deleteProjectTask
};
