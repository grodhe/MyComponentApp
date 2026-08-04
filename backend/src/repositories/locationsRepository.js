const { pool, schema } = require("./baseRepository");

async function getAll() {

    const sql = `
        SELECT

            id,
            name,
            description

        FROM ${schema}.locations

        ORDER BY name;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

module.exports = {
    getAll
};