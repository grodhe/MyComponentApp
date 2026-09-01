import api from "../api/api";

export function getSettings() {

    return api.get("/settings");

}

// `data` is a partial { key: value } object -- only the keys included get
// written, and the backend returns the full updated settings object back.
export function updateSettings(data) {

    return api.put("/settings", data);

}
