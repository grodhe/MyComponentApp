import api from "../api/api";

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
