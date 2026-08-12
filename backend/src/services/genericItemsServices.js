const repository = require("../repositories/genericItemsRepository");
const { translatePgError } = require("../utils/pgErrors");

function toIntOrNull(value) {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

}

function normalize(data = {}) {

    return {
        name: (data.name ?? "").trim(),
        description: data.description ?? "",
        category_id: toIntOrNull(data.category_id),
        location_id: toIntOrNull(data.location_id),
        supplier_id: toIntOrNull(data.supplier_id),
        part_number: data.part_number ?? "",
        unit: (data.unit ?? "").trim() || "pcs",
        quantity: toIntOrNull(data.quantity) ?? 0,
        minimum_quantity: toIntOrNull(data.minimum_quantity) ?? 0,
        reference_url: data.reference_url ?? "",
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

}

async function getAllGenericItems() {

    return await repository.getAll();

}

async function getGenericItemById(id) {

    return await repository.getById(id);

}

async function createGenericItem(data) {

    const normalized = normalize(data);

    validate(normalized);

    return await repository.create(normalized);

}

async function updateGenericItem(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    const updated = await repository.update(id, normalized);

    if (!updated) {
        const error = new Error(`Generic item ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteGenericItem(id) {

    try {

        const deleted = await repository.remove(id);

        if (!deleted) {
            const error = new Error(`Generic item ${id} not found`);
            error.status = 404;
            throw error;
        }

    } catch (err) {

        throw translatePgError(err, {
            referenceMessage: "This item is used in one or more projects and can't be deleted while it's still referenced there."
        });

    }

}

module.exports = {
    getAllGenericItems,
    getGenericItemById,
    createGenericItem,
    updateGenericItem,
    deleteGenericItem,
    normalizeGenericItem: normalize
};
