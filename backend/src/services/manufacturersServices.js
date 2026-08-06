const repository = require("../repositories/manufacturersRepository");

function normalize(data = {}) {

    return {
        name: (data.name ?? "").trim(),
        website: data.website ?? "",
        notes: data.notes ?? ""
    };

}

async function getAllManufacturers() {

    return await repository.getAll();

}

async function getManufacturerById(id) {

    return await repository.getById(id);

}

async function createManufacturer(data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    return await repository.create(normalized);

}

async function updateManufacturer(id, data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    const updated = await repository.update(id, normalized);

    if (!updated) {
        const error = new Error(`Manufacturer ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteManufacturer(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Manufacturer ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllManufacturers,
    getManufacturerById,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer
};
