const jwt = require("jsonwebtoken");

const config = require("../config/app");
const dsmAuthService = require("../services/dsmAuthService");

function cookieOptions() {

    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: config.session.maxAgeMs
    };

}

async function login(req, res) {

    const { username, password, otp_code } = req.body || {};

    if (!username || !password) {

        return res.status(400).json({
            error: "Username and password are required."
        });

    }

    if (!config.session.secret) {

        console.error("SESSION_SECRET is not set -- refusing to issue a login session.");

        return res.status(500).json({
            error: "The server isn't configured for login yet (missing SESSION_SECRET). Check the backend .env file."
        });

    }

    try {

        const result = await dsmAuthService.loginToDsm(username, password, otp_code);

        if (!result.success) {

            return res.status(401).json({
                error: result.message,
                otpRequired: result.otpRequired
            });

        }

        const normalizedUsername = username.trim().toLowerCase();

        if (
            config.dsm.allowedUsers.length > 0 &&
            !config.dsm.allowedUsers.includes(normalizedUsername)
        ) {

            return res.status(403).json({
                error: "Your Synology account doesn't have access to Hobbyist. Ask the administrator to add you to DSM_ALLOWED_USERS."
            });

        }

        const token = jwt.sign(
            { username: username.trim() },
            config.session.secret,
            { expiresIn: "7d" }
        );

        res.cookie(config.session.cookieName, token, cookieOptions());

        res.json({ username: username.trim() });

    } catch (err) {

        console.error("DSM login failed:", err);

        res.status(err.status || 502).json({
            error: err.message || "Couldn't reach the Synology login service."
        });

    }

}

function logout(req, res) {

    res.clearCookie(config.session.cookieName, cookieOptions());

    res.status(204).send();

}

function me(req, res) {

    // authEnabled lets the frontend tell "really logged in" apart from
    // "login is turned off, so everyone's automatically in" -- used to
    // hide the Sign Out button in that second case (signing out would
    // otherwise strand you on a login screen with no DSM server to log
    // back in against).
    res.json({
        username: req.user.username,
        authEnabled: config.auth.enabled
    });

}

module.exports = {
    login,
    logout,
    me
};
