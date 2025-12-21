import api from "./api"

export const getEndpoints = async (u_id) => {
    return api.get("/getEndpoints");
}

export const runUrls = async (url) => {
    return api.post("/runUrl", {
        "url": url
    });
}