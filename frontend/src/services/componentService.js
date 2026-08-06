import api from "../api/api";

export function getComponents() {

    return api.get("/components");

}

export function getComponent(id) {

    return api.get(`/components/${id}`);

}

export function createComponent(data) {

    return api.post("/components", data);

}

export function updateComponent(id, data) {

    return api.put(`/components/${id}`, data);

}

export function deleteComponent(id) {

    return api.delete(`/components/${id}`);

}
