const { pool, schema } = require("./baseRepository");

async function getAll() {

    const sql = `
        SELECT

            id,
            name,
            description,
            display_order

        FROM ${schema}.project_status

        ORDER BY display_order, name;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

module.exports = {
    getAll
};
