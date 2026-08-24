const http = require("http");
const https = require("https");

const config = require("../config/app");

// Best-effort mapping of SYNO.API.Auth's documented error codes. These
// come from Synology's published DSM Login Web API Guide; verify against
// your actual DSM version if a login fails with an unexpected message --
// the exact code list can shift between DSM releases.
const ERROR_MESSAGES = {
    400: "Incorrect username or password.",
    401: "This Synology account is disabled.",
    402: "This Synology account doesn't have permission to log in here.",
    403: "This account requires a 2-step verification code.",
    404: "The 2-step verification code was incorrect.",
    406: "2-step verification is required for this account.",
    407: "Too many failed attempts from this address -- try again later.",
    408: "This account's password has expired and must be changed in DSM first.",
    409: "This account's password must be changed in DSM before logging in here."
};

const OTP_ERROR_CODES = new Set([403, 404, 406]);

function interpretError(code) {

    return {
        message: ERROR_MESSAGES[code] || `Synology login failed (error code ${code}).`,
        otpRequired: OTP_ERROR_CODES.has(code)
    };

}

// Plain http(s) GET returning parsed JSON -- deliberately not using the
// global fetch() here, since bypassing certificate verification for a
// self-signed local DSM cert is simplest and most version-stable through
// the classic https.Agent({ rejectUnauthorized }) option rather than
// fetch's dispatcher API.
function getJson(url) {

    return new Promise((resolve, reject) => {

        const isHttps = url.startsWith("https://");
        const client = isHttps ? https : http;

        const options = isHttps
            ? { rejectUnauthorized: config.dsm.verifySsl }
            : {};

        client.get(url, options, (res) => {

            let body = "";

            res.on("data", (chunk) => { body += chunk; });

            res.on("end", () => {

                try {

                    resolve(JSON.parse(body));

                } catch (err) {

                    reject(new Error(`DSM returned a non-JSON response (status ${res.statusCode}). Is DSM_API_URL correct?`));

                }

            });

        }).on("error", reject);

    });

}

// Validates a username/password against the NAS's own DSM accounts via
// the public SYNO.API.Auth login API. Returns:
//   { success: true, username }
//   { success: false, message, otpRequired }
async function loginToDsm(username, password, otpCode) {

    if (!config.dsm.apiUrl) {

        const error = new Error(
            "DSM_API_URL is not configured on the backend -- see the .env.example for what to set."
        );
        error.status = 500;
        throw error;

    }

    const params = new URLSearchParams({
        api: "SYNO.API.Auth",
        version: "6",
        method: "login",
        account: username,
        passwd: password,
        session: config.dsm.sessionName,
        format: "sid"
    });

    if (otpCode) {
        params.set("otp_code", otpCode);
    }

    const url = `${config.dsm.apiUrl.replace(/\/$/, "")}/webapi/entry.cgi?${params.toString()}`;

    const result = await getJson(url);

    if (result.success) {

        return {
            success: true,
            username
        };

    }

    const code = result.error && result.error.code;

    return {
        success: false,
        ...interpretError(code)
    };

}

module.exports = {
    loginToDsm
};
