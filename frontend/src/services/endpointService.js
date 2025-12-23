import api from "./api"

export const getEndpoints = async () => {
    return api.get(`/getEndpoints?t=${Date.now()}`);
}

export const addEndpoint = async (name, url) => {
    return api.post("/addEndpoint", {
        "name": name,
        "url": url,
    });
}

export const runUrl = async (endpoint_id) => {
    return api.post("/runUrl", {
        "endpoint_id": endpoint_id
    });
}

export const getEndpointStats = (id) => {
    return api.get(`/${id}/stats`);
};