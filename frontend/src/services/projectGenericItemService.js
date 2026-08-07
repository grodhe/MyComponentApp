import api from "../api/api";

export function getProjectGenericItems(projectId) {

    return api.get(`/projects/${projectId}/generic-items`);

}

export function createProjectGenericItem(projectId, data) {

    return api.post(`/projects/${projectId}/generic-items`, data);

}

export function updateProjectGenericItem(projectId, id, data) {

    return api.put(`/projects/${projectId}/generic-items/${id}`, data);

}

export function deleteProjectGenericItem(projectId, id) {

    return api.delete(`/projects/${projectId}/generic-items/${id}`);

}
