const { pool, schema } = require("./baseRepository");

async function getAll() {

    const sql = `
        SELECT

            id,
            name,
            website,
            notes

        FROM ${schema}.manufacturers

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
            notes

        FROM ${schema}.manufacturers

        WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.manufacturers (
            name,
            website,
            notes
        ) VALUES (
            $1, $2, $3
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.website,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.manufacturers
        SET
            name = $1,
            website = $2,
            notes = $3
        WHERE id = $4
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.website,
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
        DELETE FROM ${schema}.manufacturers
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
