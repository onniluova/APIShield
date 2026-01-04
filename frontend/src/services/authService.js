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
    return api.delete(`/auth/${user_id}/delete`);
};

export const saveSettings = (settings) => {
    return api.put(`/auth/settings`,
        settings
    );
};

export const logoutAuth = async () => {
    return api.post("/auth/logout");
};