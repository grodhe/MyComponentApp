import api from "../api/api";

export function getCategories() {

    return api.get("/categories");

}