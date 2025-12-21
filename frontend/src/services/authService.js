import api from "./api"

export const loginAuth = async (username, password) => {
    return api.post("/login", {
        username,
        password
    });
}

export const registerAuth = async (username, password) => {
    return api.post("/register", {
        username,
        password
    });
}