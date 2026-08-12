const { execFile } = require("child_process");
const { promisify } = require("util");

const config = require("../config/app");

const execFileAsync = promisify(execFile);

// Runs pg_dump against just the app's schema and returns the plain-text
// SQL dump. Buffered in memory (rather than streamed straight to the
// response) so a pg_dump failure can still be reported as a clean JSON
// error instead of a truncated/corrupt download -- fine for a hobby-scale
// inventory database.
async function generateBackup() {

    const args = [
        "--host", config.db.host,
        "--port", String(config.db.port),
        "--username", config.db.user,
        "--dbname", config.db.database,
        "--schema", config.db.schema,
        "--no-owner",
        "--no-privileges"
    ];

    const { stdout } = await execFileAsync("pg_dump", args, {
        env: {
            ...process.env,
            PGPASSWORD: config.db.password
        },
        maxBuffer: 1024 * 1024 * 200,
        encoding: "utf8"
    });

    return stdout;

}

module.exports = {
    generateBackup
};
