const repository = require("../repositories/locationsRepository");

function normalize(data = {}) {

    return {
        name: (data.name ?? "").trim(),
        description: data.description ?? ""
    };

}

async function getAllLocations() {

    return await repository.getAll();

}

async function getLocationById(id) {

    return await repository.getById(id);

}

async function createLocation(data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    return await repository.create(normalized);

}

async function updateLocation(id, data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    const updated = await repository.update(id, normalized);

    if (!updated) {
        const error = new Error(`Location ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteLocation(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Location ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
};
