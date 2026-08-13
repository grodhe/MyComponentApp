import api from "../api/api";

export function getShoppingListItems() {

    return api.get("/shopping-list");

}

export function createShoppingListItem(data) {

    return api.post("/shopping-list", data);

}

export function updateShoppingListItem(id, data) {

    return api.put(`/shopping-list/${id}`, data);

}

export function deleteShoppingListItem(id) {

    return api.delete(`/shopping-list/${id}`);

}
