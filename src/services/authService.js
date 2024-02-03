import axios from "../axios";

export function refreshToken() {
    return axios.post(
        "auth/refresh-token",
        {},
        {
            withCredentials: true,
        }
    );
}

export function CheckRole() {
    return axios.get("/user/current-role", {
        withCredentials: true,
    });
}

export function SignInService(data) {
    return axios.post("/auth/register", data, {
        withCredentials: true,
    });
}

export function LogInFirebaseService(data) {
    return axios.post("/auth/fire-base", data, {
        withCredentials: true,
    });
}

export function LogInService(data) {
    return axios.post("/auth/login", data, {
        withCredentials: true,
    });
}

export function LogOutService() {
    return axios.post(
        "/auth/logout",
        {},
        {
            withCredentials: true,
        }
    );
}
