import api from "../api/api";

// Every stock movement goes through here -- there's no other path that
// changes a component's quantity, so this doubles as the single place
// that keeps quantity and transaction history in sync (enforced
// server-side, see inventoryTransactionsServices.js).
export function getComponentTransactions(componentId) {

    return api.get(`/components/${componentId}/transactions`);

}

// { component, transaction } -- the updated component (new quantity) and
// the transaction row that was just recorded.
export function createTransaction(componentId, data) {

    return api.post(`/components/${componentId}/transactions`, data);

}

// The full movement log across every component, for the standalone
// Inventory Transactions page.
export function getAllTransactions() {

    return api.get("/inventory-transactions");

}
