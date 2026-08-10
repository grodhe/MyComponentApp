const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    l.id,
    l.name,
    l.description,

    l.parent_id,
    p.name AS parent_name
`;

const JOINS = `
    FROM ${schema}.locations l

    LEFT JOIN ${schema}.locations p
        ON p.id = l.parent_id
`;

async function getAll() {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        ORDER BY l.name;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE l.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.locations (
            name,
            description,
            parent_id
        ) VALUES (
            $1, $2, $3
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.description,
        data.parent_id
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.locations
        SET
            name = $1,
            description = $2,
            parent_id = $3
        WHERE id = $4
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.name,
        data.description,
        data.parent_id,
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
