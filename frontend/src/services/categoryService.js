import api from "../api/api";

export function getCategories() {

    return api.get("/categories");

}

export function getCategory(id) {

    return api.get(`/categories/${id}`);

}

export function createCategory(data) {

    return api.post("/categories", data);

}

export function updateCategory(id, data) {

    return api.put(`/categories/${id}`, data);

}

export function deleteCategory(id) {

    return api.delete(`/categories/${id}`);

}
