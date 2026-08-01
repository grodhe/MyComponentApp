import api from "./api";

export async function getComponents() {
    const response = await api.get("/components");
    return response.data;
}