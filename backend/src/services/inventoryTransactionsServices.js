const transactionsRepository = require("../repositories/inventoryTransactionsRepository");
const componentsRepository = require("../repositories/componentsRepository");

function toIntOrNull(value) {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

}

// Records a stock movement AND applies it to the component's quantity, so
// the two never drift apart -- there's no path in the app that changes
// quantity without also leaving a transaction behind.
//
// This isn't wrapped in an explicit DB transaction (BEGIN/COMMIT): it's a
// single-user local app with no concurrent writers, so the brief window
// between these two queries isn't a practical risk, and it keeps this
// consistent with how the rest of the app talks to the database (nothing
// else here uses explicit transactions either).
async function recordTransaction(componentId, data) {

    const quantityDelta = toIntOrNull(data.quantity_delta);
    const reason = (data.reason ?? "").trim();

    if (!Number.isInteger(quantityDelta) || quantityDelta === 0) {
        const error = new Error("quantity_delta is required and must be a non-zero whole number");
        error.status = 400;
        throw error;
    }

    if (!reason) {
        const error = new Error("A reason is required");
        error.status = 400;
        throw error;
    }

    const component = await componentsRepository.getById(componentId);

    if (!component) {
        const error = new Error(`Component ${componentId} not found`);
        error.status = 404;
        throw error;
    }

    const newQuantity = (component.quantity ?? 0) + quantityDelta;

    if (newQuantity < 0) {
        const error = new Error(`Not enough stock: only ${component.quantity} available.`);
        error.status = 400;
        throw error;
    }

    const updatedComponent = await componentsRepository.update(componentId, {
        ...component,
        quantity: newQuantity
    });

    const transaction = await transactionsRepository.create({
        component_id: componentId,
        quantity_delta: quantityDelta,
        reason
    });

    return { component: updatedComponent, transaction };

}

async function getComponentTransactions(componentId) {

    const component = await componentsRepository.getById(componentId);

    if (!component) {
        const error = new Error(`Component ${componentId} not found`);
        error.status = 404;
        throw error;
    }

    return await transactionsRepository.getByComponentId(componentId);

}

async function getAllTransactions() {

    return await transactionsRepository.getAll();

}

module.exports = {
    recordTransaction,
    getComponentTransactions,
    getAllTransactions
};
