import api from "./api"

export const loginAuth = async (username, password) => {
    return api.post("/auth/login", {
        username,
        password
    });
}

export const registerAuth = async (username, password) => {
    return api.post("/auth/register", {
        username,
        password
    });
}

export const googleAuth = (token) => {
    return api.post(`/auth/google`, { token }); 
};

export const deleteUser = (user_id) => {
    return api.post(`/auth/${user_id}/delete`); 
};