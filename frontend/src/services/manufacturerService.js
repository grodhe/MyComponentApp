import api from "../api/api";

export function getManufacturers() {

    return api.get("/manufacturers");

}

export function getManufacturer(id) {

    return api.get(`/manufacturers/${id}`);

}

export function createManufacturer(data) {

    return api.post("/manufacturers", data);

}

export function updateManufacturer(id, data) {

    return api.put(`/manufacturers/${id}`, data);

}

export function deleteManufacturer(id) {

    return api.delete(`/manufacturers/${id}`);

}
