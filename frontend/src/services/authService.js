import api from "../api/api";

export function login(username, password, otpCode) {

    return api.post("/auth/login", {
        username,
        password,
        otp_code: otpCode || undefined
    });

}

export function logout() {

    return api.post("/auth/logout");

}

export function getMe() {

    return api.get("/auth/me");

}
