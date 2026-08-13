const repository = require("../repositories/shoppingListRepository");
const { translatePgError } = require("../utils/pgErrors");

function toIntOrNull(value) {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

}

function normalize(data = {}) {

    const quantity = toIntOrNull(data.quantity_needed);

    return {
        component_id: toIntOrNull(data.component_id),
        description: (data.description ?? "").trim() || null,
        quantity_needed: quantity === null ? 1 : quantity,
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.component_id && !normalized.description) {
        const error = new Error("Pick a component or type a description for this item.");
        error.status = 400;
        throw error;
    }

    if (!normalized.quantity_needed || normalized.quantity_needed < 1) {
        const error = new Error("Quantity needed must be at least 1.");
        error.status = 400;
        throw error;
    }

}

async function getAllShoppingListItems() {

    return await repository.getAll();

}

async function getShoppingListItemById(id) {

    return await repository.getById(id);

}

async function createShoppingListItem(data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function updateShoppingListItem(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        const updated = await repository.update(id, normalized);

        if (!updated) {
            const error = new Error(`Shopping list item ${id} not found`);
            error.status = 404;
            throw error;
        }

        return updated;

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deleteShoppingListItem(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Shopping list item ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllShoppingListItems,
    getShoppingListItemById,
    createShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem
};
