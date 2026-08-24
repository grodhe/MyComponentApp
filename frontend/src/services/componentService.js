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

// Photos are plain image bytes, not JSON, so these bypass api.js's
// JSON-only request() helper and talk to fetch() directly -- same
// approach already used for CSV export/import.

export function getComponentPhotoUrl(id, updatedAt) {

    // updatedAt busts the browser's cache after a re-upload -- the URL
    // itself never changes otherwise, so without this the browser would
    // keep showing the old cached image.
    const v = updatedAt ? encodeURIComponent(updatedAt) : "";

    return `${API_URL}/components/${id}/photo?v=${v}`;

}

async function parsePhotoErrorResponse(response) {

    const raw = await response.text();

    try {
        return JSON.parse(raw).error || raw;
    } catch {
        return raw || response.statusText;
    }

}

export async function uploadComponentPhoto(id, file) {

    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(`${API_URL}/components/${id}/photo`, {
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

export async function deleteComponentPhoto(id) {

    const response = await fetch(`${API_URL}/components/${id}/photo`, {
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
