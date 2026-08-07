import api from "../api/api";

export function getProjectDocuments(projectId) {

    return api.get(`/projects/${projectId}/documents`);

}

export function createProjectDocument(projectId, data) {

    return api.post(`/projects/${projectId}/documents`, data);

}

export function updateProjectDocument(projectId, id, data) {

    return api.put(`/projects/${projectId}/documents/${id}`, data);

}

export function deleteProjectDocument(projectId, id) {

    return api.delete(`/projects/${projectId}/documents/${id}`);

}
