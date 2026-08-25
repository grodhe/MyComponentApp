import api from "../api/api";

const API_URL = import.meta.env.VITE_API_URL;

export function getGenericItems() {

    return api.get("/generic-items");

}

export function getGenericItem(id) {

    return api.get(`/generic-items/${id}`);

}

export function createGenericItem(data) {

    return api.post("/generic-items", data);

}

export function updateGenericItem(id, data) {

    return api.put(`/generic-items/${id}`, data);

}

export function deleteGenericItem(id) {

    return api.delete(`/generic-items/${id}`);

}

export function getGenericItemsExportCsvUrl() {

    return `${API_URL}/generic-items/export/csv`;

}

export function importGenericItemsCsv(csvText) {

    return api.post("/generic-items/import/csv", { csv: csvText });

}


// Photos are plain image bytes, not JSON, so these bypass api.js's
// JSON-only request() helper and talk to fetch() directly -- same
// approach used for Component photos and for CSV export/import.

export function getGenericItemPhotoUrl(id, updatedAt) {

    // updatedAt busts the browser's cache after a re-upload -- the URL
    // itself never changes otherwise, so without this the browser would
    // keep showing the old cached image.
    const v = updatedAt ? encodeURIComponent(updatedAt) : "";

    return `${API_URL}/generic-items/${id}/photo?v=${v}`;

}

async function parsePhotoErrorResponse(response) {

    const raw = await response.text();

    try {
        return JSON.parse(raw).error || raw;
    } catch {
        return raw || response.statusText;
    }

}

export async function uploadGenericItemPhoto(id, file) {

    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(`${API_URL}/generic-items/${id}/photo`, {
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

export async function deleteGenericItemPhoto(id) {

    const response = await fetch(`${API_URL}/generic-items/${id}/photo`, {
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
