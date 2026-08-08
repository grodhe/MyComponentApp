const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {

    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    if (!response.ok) {

        const message = await response.text();

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