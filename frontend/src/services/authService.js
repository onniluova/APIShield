import axios from 'axios';

const api = axios.create({baseURL: 'http://127.0.0.1:5000'})

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