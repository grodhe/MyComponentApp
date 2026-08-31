const repository = require("../repositories/componentPurchasesRepository");
const { translatePgError } = require("../utils/pgErrors");

const toIntOrNull = (value) => {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

};

// unit_price is a plain decimal (not necessarily whole), unlike quantity
// fields elsewhere -- Number(...) handles "12.5" fine, just don't round it.
const toDecimalOrNull = (value) => {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

};

// "" -> null throughout, same reasoning as componentsServices.normalize --
// purchase_date and order_reference/notes are all optional, supplier_id is
// an optional FK (a purchase doesn't have to be tied to a supplier record).
function normalize(data = {}) {

    return {
        supplier_id: toIntOrNull(data.supplier_id),
        supplier_part_number: data.supplier_part_number ?? "",
        quantity: toIntOrNull(data.quantity),
        unit_price: toDecimalOrNull(data.unit_price),
        purchase_date: data.purchase_date || null,
        order_reference: data.order_reference ?? "",
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.quantity || normalized.quantity <= 0) {
        const error = new Error("quantity must be a positive number");
        error.status = 400;
        throw error;
    }

}

async function getAllForComponent(componentId) {

    return await repository.getAllForComponent(componentId);

}

async function createPurchase(componentId, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(componentId, normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deletePurchase(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Purchase ${id} not found`);
        error.status = 404;
        throw error;
    }

}

module.exports = {
    getAllForComponent,
    createPurchase,
    deletePurchase
};
