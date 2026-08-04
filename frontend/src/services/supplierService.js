import api from "../api/api";

export function getSuppliers() {

    return api.get("/suppliers");

}