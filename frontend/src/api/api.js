const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {

    const response = await fetch(`${API_URL}${path}`, {

        headers: {
            "Content-Type": "application/json"
        },

        // Session auth relies on an httpOnly cookie -- without this, the
        // browser won't send it (or accept the Set-Cookie from login) on
        // cross-origin requests, e.g. the Vite dev server on one port
        // talking to the backend on another.
        credentials: "include",

        ...options

    });

    if (!response.ok) {

        // The backend returns JSON error bodies ({ error: "..." }) almost
        // everywhere -- fall back to raw text for the rare response that
        // isn't JSON (e.g. a proxy's own error page).
        const raw = await response.text();

        let message = raw;

        try {

            const parsed = JSON.parse(raw);
            message = parsed.error || raw;

        } catch {

            // not JSON, use raw text as-is

        }

        if (response.status === 401) {

            // Let the app know the session is gone (expired, logged out
            // elsewhere, server restarted) so it can drop back to the
            // login screen -- this file has no router access itself, so
            // it signals via a DOM event instead.
            window.dispatchEvent(new CustomEvent("hobbyist:unauthorized"));

        }

        throw new Error(message || response.statusText);

    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();

}

function get(path) {

    return request(path);

}

function post(path, data) {

    return request(path, {
        method: "POST",
        body: JSON.stringify(data)
    });

}

function put(path, data) {

    return request(path, {
        method: "PUT",
        body: JSON.stringify(data)
    });

}

function remove(path) {

    return request(path, {
        method: "DELETE"
    });

}

export default {
    get,
    post,
    put,
    delete: remove
};
