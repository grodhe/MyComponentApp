import api from "../api/api";

const API_URL = import.meta.env.VITE_API_URL;

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

export function getGenericItemsExportCsvUrl() {

    return `${API_URL}/generic-items/export/csv`;

}

export function importGenericItemsCsv(csvText) {

    return api.post("/generic-items/import/csv", { csv: csvText });

}
