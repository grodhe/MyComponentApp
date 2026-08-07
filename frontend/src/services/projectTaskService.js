import api from "../api/api";

export function getProjectTasks(projectId) {

    return api.get(`/projects/${projectId}/tasks`);

}

export function createProjectTask(projectId, data) {

    return api.post(`/projects/${projectId}/tasks`, data);

}

export function updateProjectTask(projectId, id, data) {

    return api.put(`/projects/${projectId}/tasks/${id}`, data);

}

export function deleteProjectTask(projectId, id) {

    return api.delete(`/projects/${projectId}/tasks/${id}`);

}
