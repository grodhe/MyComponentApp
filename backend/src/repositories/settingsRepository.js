const { pool, schema } = require("./baseRepository");

async function getAll() {

    const sql = `
        SELECT key, value
        FROM ${schema}.app_settings
        ORDER BY key;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

// Upsert -- callers don't need to know/care whether a key already exists.
async function set(key, value) {

    const sql = `
        INSERT INTO ${schema}.app_settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        RETURNING key, value;
    `;

    const result = await pool.query(sql, [key, value]);

    return result.rows[0];

}

module.exports = {
    getAll,
    set
};
