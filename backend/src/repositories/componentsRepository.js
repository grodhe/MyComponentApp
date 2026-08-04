const { pool, schema } = require("./baseRepository");

async function getAll() {

    const sql = `
        SELECT

            c.id,

            c.part_number,
            c.part_name,
            c.description,

            c.manufacturer_part_number,

            c.package,
            c.footprint,
            c.component_value,

            c.quantity,
            c.minimum_quantity,

            c.datasheet_url,

            c.notes,

            c.created_at,
            c.updated_at,

            c.manufacturer_id,
            m.name AS manufacturer,

            c.category_id,
            cat.name AS category,

            c.location_id,
            l.name AS location

        FROM ${schema}.components c

        LEFT JOIN ${schema}.manufacturers m
            ON m.id = c.manufacturer_id

        LEFT JOIN ${schema}.categories cat
            ON cat.id = c.category_id

        LEFT JOIN ${schema}.locations l
            ON l.id = c.location_id

        ORDER BY
            c.part_number;

    `;

    const result = await pool.query(sql);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ...
        FROM ${schema}.components c
        ...
        WHERE c.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

module.exports = {
    getAll,
    getById
};