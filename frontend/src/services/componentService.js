import api from "../api/api";

export function getComponents() {

    return api.get("/components");

}