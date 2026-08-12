const backupService = require("../services/backupService");

async function downloadBackup(req, res) {

    try {

        const sql = await backupService.generateBackup();

        const date = new Date().toISOString().slice(0, 10);

        res.setHeader("Content-Type", "application/sql; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="hobbyist_backup_${date}.sql"`
        );

        res.send(sql);

    } catch (err) {

        console.error("Backup failed:", err);

        res.status(500).json({
            error: "Database backup failed. Make sure the backend container has " +
                "pg_dump installed (postgresql-client) and can reach the database. " +
                (err.message || "")
        });

    }

}

module.exports = {
    downloadBackup
};
