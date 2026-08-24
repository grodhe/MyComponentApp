require("dotenv").config();

module.exports = {

    port: Number(process.env.PORT || 3001),

    db: {

        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        schema: process.env.DB_SCHEMA || "public"

    },

    // Login against the Synology NAS's own DSM accounts instead of a
    // separate user database -- see services/dsmAuthService.js.
    dsm: {

        // Base URL of the DSM Web API, e.g. "https://192.168.1.50:5001" or
        // "http://192.168.1.50:5000". Since the backend container usually
        // runs on the same NAS it's authenticating against, this is often
        // the NAS's own LAN IP (not "localhost", unless using host
        // networking) -- "127.0.0.1" from inside a bridge-networked
        // container is the container itself, not the NAS.
        apiUrl: process.env.DSM_API_URL,

        // The "session" name DSM uses to scope the login -- shows up as
        // the application name in DSM's Control Panel > Privileges, so an
        // admin can restrict/allow it per user or group there.
        sessionName: process.env.DSM_SESSION_NAME || "HobbyistApp",

        // DSM's local HTTPS certificate is normally self-signed, which
        // Node will reject by default. Set DSM_VERIFY_SSL=true once a
        // trusted certificate is in place; defaults to not verifying,
        // since this traffic normally never leaves the NAS itself.
        verifySsl: process.env.DSM_VERIFY_SSL === "true",

        // Comma-separated DSM usernames allowed to log into Hobbyist.
        // Empty/unset means "any valid DSM login is allowed" -- almost
        // certainly not what you want, so this should normally be set.
        allowedUsers: (process.env.DSM_ALLOWED_USERS || "")
            .split(",")
            .map((u) => u.trim().toLowerCase())
            .filter(Boolean)

    },

    session: {

        secret: process.env.SESSION_SECRET,
        cookieName: "hobbyist_session",
        maxAgeMs: 1000 * 60 * 60 * 24 * 7 // 7 days

    }

};