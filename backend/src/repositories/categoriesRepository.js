const { pool, schema } = require("./baseRepository");

async function getAll() {

    const sql = `
        SELECT

            id,
            name,
            description

        FROM ${schema}.categories

        ORDER BY name;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

module.exports = {
    getAll
};