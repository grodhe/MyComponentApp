import api from "../api/api";

export function getSuppliers() {

    return api.get("/suppliers");

}

export function getSupplier(id) {

    return api.get(`/suppliers/${id}`);

}

export function createSupplier(data) {

    return api.post("/suppliers", data);

}

export function updateSupplier(id, data) {

    return api.put(`/suppliers/${id}`, data);

}

export function deleteSupplier(id) {

    return api.delete(`/suppliers/${id}`);

}
