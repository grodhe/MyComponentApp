import api from "../api/api";

const API_URL = import.meta.env.VITE_API_URL;

export function getProjectComponents(projectId) {

    return api.get(`/projects/${projectId}/components`);

}

export function createProjectComponent(projectId, data) {

    return api.post(`/projects/${projectId}/components`, data);

}

export function updateProjectComponent(projectId, id, data) {

    return api.put(`/projects/${projectId}/components/${id}`, data);

}

export function deleteProjectComponent(projectId, id) {

    return api.delete(`/projects/${projectId}/components/${id}`);

}

// Assembly-house BOM export, Components only -- mirrors
// getComponentsExportCsvUrl()'s pattern of a plain URL the caller
// navigates to directly, since this is a file download rather than a
// JSON response. `profile` picks the column layout ("jlcpcb", "pcbway",
// or "seeed" -- see BOM_PROFILES on the backend); defaults to jlcpcb.
export function getProjectComponentsBomExportUrl(projectId, profile = "jlcpcb") {

    return `${API_URL}/projects/${projectId}/components/export/bom?profile=${profile}`;

}
