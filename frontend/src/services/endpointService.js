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

export const deleteEndpoint = async (endpoint_id) => {
    return api.delete(`/${endpoint_id}/delete`);
}

export const runUrl = async (endpoint_id) => {
    return api.post("/runUrl", {
        "endpoint_id": endpoint_id
    });
}

export const getEndpointStats = (id, startDate, endDate, limit) => {
    return api.get(`/${id}/stats`, {
        params: {
            start_date: startDate,
            end_date: endDate,
            limit: limit
        }
    });
};