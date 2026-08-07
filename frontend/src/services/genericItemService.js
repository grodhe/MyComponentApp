import api from "../api/api";

export function getGenericItems() {

    return api.get("/generic-items");

}

export function getGenericItem(id) {

    return api.get(`/generic-items/${id}`);

}

export function createGenericItem(data) {

    return api.post("/generic-items", data);

}

export function updateGenericItem(id, data) {

    return api.put(`/generic-items/${id}`, data);

}

export function deleteGenericItem(id) {

    return api.delete(`/generic-items/${id}`);

}
