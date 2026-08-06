const repository = require("../repositories/suppliersRepository");

function normalize(data = {}) {

    return {
        name: (data.name ?? "").trim(),
        website: data.website ?? "",
        country: data.country ?? "",
        currency: data.currency ?? "",
        notes: data.notes ?? ""
    };

}

async function getAllSuppliers() {

    return await repository.getAll();

}

async function getSupplierById(id) {

    return await repository.getById(id);

}

async function createSupplier(data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    return await repository.create(normalized);

}

async function updateSupplier(id, data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    const updated = await repository.update(id, normalized);

    if (!updated) {
        const error = new Error(`Supplier ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteSupplier(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Supplier ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
