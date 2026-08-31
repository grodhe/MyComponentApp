import api from "../api/api";

// Purchase history is pure record-keeping, separate from the stock
// transactions endpoint -- logging a purchase here never touches the
// component's quantity. See inventoryTransactionService.js for the
// Use Stock/Add Stock flow that does.

export function getComponentPurchases(componentId) {

    return api.get(`/components/${componentId}/purchases`);

}

export function createPurchase(componentId, data) {

    return api.post(`/components/${componentId}/purchases`, data);

}

export function deletePurchase(componentId, purchaseId) {

    return api.delete(`/components/${componentId}/purchases/${purchaseId}`);

}
