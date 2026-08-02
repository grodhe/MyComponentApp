const pool = require("../config/db");
const config = require("../config/app");

const schema = config.db.schema;

async function getAll() {

    const sql = `
        SELECT
            c.id,
            c.part_number,
            c.part_name,
            c.description,
            c.quantity,
            l.name AS location,
            cat.name AS category,
            m.name AS manufacturer
        FROM ${schema}.components c
        LEFT JOIN ${schema}.locations l
            ON l.id = c.location_id
        LEFT JOIN ${schema}.categories cat
            ON cat.id = c.category_id
        LEFT JOIN ${schema}.manufacturers m
            ON m.id = c.manufacturer_id
        ORDER BY c.part_number;
    `;

    const result = await pool.query(sql);

    return result.rows;
}

module.exports = {
    getAll
};