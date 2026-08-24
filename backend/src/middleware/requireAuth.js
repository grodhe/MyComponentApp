const jwt = require("jsonwebtoken");
const config = require("../config/app");

// Guards every route it's applied to -- reads the session cookie set at
// login (see authControllers.js), verifies it, and attaches req.user.
// Anything mounted after this in server.js needs a valid session; login,
// logout, and /api/health are mounted before it and stay public.
function requireAuth(req, res, next) {

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
