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

async function getById(id) {

    const sql = `
        SELECT

            id,
            name,
            website,
            country,
            currency,
            notes

        FROM ${schema}.suppliers

        WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.suppliers (
            name,
            website,
            country,
            currency,
            notes
        ) VALUES (
            $1, $2, $3, $4, $5
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.website,
        data.country,
        data.currency,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.suppliers
        SET
            name = $1,
            website = $2,
            country = $3,
            currency = $4,
            notes = $5
        WHERE id = $6
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.website,
        data.country,
        data.currency,
        data.notes,
        id
    ]);

    if (result.rowCount === 0) {
        return null;
    }

    return getById(id);

}

async function remove(id) {

    const sql = `
        DELETE FROM ${schema}.suppliers
        WHERE id = $1
        RETURNING id;
    `;

    const result = await pool.query(sql, [id]);

    return result.rowCount > 0;

}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
