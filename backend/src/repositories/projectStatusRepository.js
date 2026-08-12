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

// There's no UI page for managing statuses (project_status is a free-text
// lookup with no fixed vocabulary), so this exists mainly for CSV import
// to auto-create a status name that doesn't exist yet -- the same
// behavior components' CSV import already has for Manufacturer/Category.
async function create(data) {

    const sql = `
        INSERT INTO ${schema}.project_status (
            name,
            description,
            display_order
        ) VALUES (
            $1, $2, $3
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.description ?? null,
        data.display_order ?? 0
    ]);

    return getById(result.rows[0].id);

}

async function getById(id) {

    const sql = `
        SELECT

            id,
            name,
            description,
            display_order

        FROM ${schema}.project_status

        WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

module.exports = {
    getAll,
    create
};
