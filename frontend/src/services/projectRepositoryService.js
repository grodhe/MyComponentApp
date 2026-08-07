import api from "../api/api";

export function getProjectRepositories(projectId) {

    return api.get(`/projects/${projectId}/repositories`);

}

export function createProjectRepository(projectId, data) {

    return api.post(`/projects/${projectId}/repositories`, data);

}

export function updateProjectRepository(projectId, id, data) {

    return api.put(`/projects/${projectId}/repositories/${id}`, data);

}

export function deleteProjectRepository(projectId, id) {

    return api.delete(`/projects/${projectId}/repositories/${id}`);

}
