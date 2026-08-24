import { createContext, useContext, useEffect, useState } from "react";

import {
    login as loginRequest,
    logout as logoutRequest,
    getMe
} from "../services/authService";

const AuthContext = createContext(null);

// Three states: "loading" (checking for an existing session on first
// load), "unauthenticated" (show the login screen), "authenticated"
// (show the app). Also listens for the "hobbyist:unauthorized" event
// api.js fires whenever any request comes back 401, so an expired
// session drops back to the login screen wherever the user happens to be.
export function AuthProvider({ children }) {

    const [status, setStatus] = useState("loading");
    const [username, setUsername] = useState(null);

    async function checkExistingSession() {

        try {

            const me = await getMe();

            setUsername(me.username);
            setStatus("authenticated");

        } catch (err) {

            setStatus("unauthenticated");

        }

    }

    useEffect(() => {

        checkExistingSession();

    }, []);

    useEffect(() => {

        function handleUnauthorized() {

            setUsername(null);
            setStatus("unauthenticated");

        }

        window.addEventListener("hobbyist:unauthorized", handleUnauthorized);

        return () => window.removeEventListener("hobbyist:unauthorized", handleUnauthorized);

    }, []);

    async function login(usernameInput, password, otpCode) {

        const result = await loginRequest(usernameInput, password, otpCode);

        setUsername(result.username);
        setStatus("authenticated");

        return result;

    }

    async function logout() {

        try {

            await logoutRequest();

        } finally {

            setUsername(null);
            setStatus("unauthenticated");

        }

    }

    return (

        <AuthContext.Provider value={{ status, username, login, logout }}>
            {children}
        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}
