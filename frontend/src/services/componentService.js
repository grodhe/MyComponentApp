import api from "../api/api";

const API_URL = import.meta.env.VITE_API_URL;

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

// Not a fetch() call -- this is opened directly (window.location.href or
// an <a href>) so the browser handles the file download itself using the
// Content-Disposition header the backend sends.
export function getComponentsExportCsvUrl() {

    return `${API_URL}/components/export/csv`;

}

export function importComponentsCsv(csvText) {

    return api.post("/components/import/csv", { csv: csvText });

}
