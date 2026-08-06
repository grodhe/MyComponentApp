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

async function getById(id) {

    const sql = `
        SELECT

            id,
            name,
            description

        FROM ${schema}.locations

        WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.locations (
            name,
            description
        ) VALUES (
            $1, $2
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.description
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.locations
        SET
            name = $1,
            description = $2
        WHERE id = $3
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.description,
        id
    ]);

    if (result.rowCount === 0) {
        return null;
    }

    return getById(id);

}

async function remove(id) {

    const sql = `
        DELETE FROM ${schema}.locations
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
