import api from "../api/api";

const API_URL = import.meta.env.VITE_API_URL;

export function getProjects() {

    return api.get("/projects");

}

export function getProject(id) {

    return api.get(`/projects/${id}`);

}

export function createProject(data) {

    return api.post("/projects", data);

}

export function updateProject(id, data) {

    return api.put(`/projects/${id}`, data);

}

export function deleteProject(id) {

    return api.delete(`/projects/${id}`);

}

export function getProjectStatuses() {

    return api.get("/project-statuses");

}

export function getProjectsExportCsvUrl() {

    return `${API_URL}/projects/export/csv`;

}

export function importProjectsCsv(csvText) {

    return api.post("/projects/import/csv", { csv: csvText });

}
