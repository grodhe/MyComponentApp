const { pool, schema } = require("./baseRepository");

async function getAll() {

    const sql = `
        SELECT

            id,
            name,
            website,
            country,
            currency,
            notes

        FROM ${schema}.suppliers

        ORDER BY name;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

module.exports = {
    getAll
};