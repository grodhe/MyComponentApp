import api from "../api/api";

export function getManufacturers() {

    return api.get("/manufacturers");

}