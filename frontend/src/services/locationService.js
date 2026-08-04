import api from "../api/api";

export function getLocations() {

    return api.get("/locations");

}