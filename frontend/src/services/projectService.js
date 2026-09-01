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

// Photos are plain image bytes, not JSON, so these bypass api.js's
// JSON-only request() helper and talk to fetch() directly -- same
// approach already used for Components/Generic Items.

export function getProjectPhotoUrl(id, updatedAt) {

    // updatedAt busts the browser's cache after a re-upload -- the URL
    // itself never changes otherwise, so without this the browser would
    // keep showing the old cached image.
    const v = updatedAt ? encodeURIComponent(updatedAt) : "";

    return `${API_URL}/projects/${id}/photo?v=${v}`;

}

async function parsePhotoErrorResponse(response) {

    const raw = await response.text();

    try {
        return JSON.parse(raw).error || raw;
    } catch {
        return raw || response.statusText;
    }

}

export async function uploadProjectPhoto(id, file) {

    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(`${API_URL}/projects/${id}/photo`, {
        method: "POST",
        credentials: "include",
        // No Content-Type header here on purpose -- the browser sets the
        // correct "multipart/form-data; boundary=..." value itself, and
        // setting it manually would break the boundary.
        body: formData
    });

    if (!response.ok) {

        const message = await parsePhotoErrorResponse(response);

        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent("hobbyist:unauthorized"));
        }

        throw new Error(message);

    }

    return await response.json();

}

export async function deleteProjectPhoto(id) {

    const response = await fetch(`${API_URL}/projects/${id}/photo`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok && response.status !== 404) {

        const message = await parsePhotoErrorResponse(response);

        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent("hobbyist:unauthorized"));
        }

        throw new Error(message);

    }

}
