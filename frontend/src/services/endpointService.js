import api from "./api"

export const getEndpoints = async () => {
    return api.get("/getEndpoints");
}

export const addEndpoint = async (user_id, url, name) => {
    return api.post("/addEnpoint"), {
        "user_id": user_id,
        "url": url,
        "name": name
    };
}

export const runUrl = async (endpoint_id) => {
    return api.post("/runUrl", {
        "endpoint_id": endpoint_id
    });
}