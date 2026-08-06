import api from "../api/api";

export function getLocations() {

    return api.get("/locations");

}

export function getLocation(id) {

    return api.get(`/locations/${id}`);

}

export function createLocation(data) {

    return api.post("/locations", data);

}

export function updateLocation(id, data) {

    return api.put(`/locations/${id}`, data);

}

export function deleteLocation(id) {

    return api.delete(`/locations/${id}`);

}
