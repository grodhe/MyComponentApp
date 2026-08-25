const jwt = require("jsonwebtoken");
const config = require("../config/app");

// Guards every route it's applied to -- reads the session cookie set at
// login (see authControllers.js), verifies it, and attaches req.user.
// Anything mounted after this in server.js needs a valid session; login,
// logout, and /api/health are mounted before it and stay public.
function requireAuth(req, res, next) {

    // AUTH_ENABLED=false (see config/app.js) skips login checking
    // entirely -- every route behaves as if a fixed local user is
    // already signed in. This is the one place that's enforced, so it
    // applies uniformly whether requireAuth is reached via the global
    // "/api" gate in server.js or directly on a single route (like
    // GET /api/auth/me).
    if (!config.auth.enabled) {

        req.user = { username: "local" };
        return next();

    }

    const token = req.cookies && req.cookies[config.session.cookieName];

    if (!token) {

        return res.status(401).json({
            error: "Not logged in."
        });

    }

    try {

        const payload = jwt.verify(token, config.session.secret);

        req.user = { username: payload.username };

        next();

    } catch (err) {

        return res.status(401).json({
            error: "Your session has expired. Please log in again."
        });

    }

}

module.exports = requireAuth;
