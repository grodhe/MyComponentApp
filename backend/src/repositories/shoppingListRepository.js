const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    sl.id,

    sl.component_id,
    c.part_number,
    c.part_name,
    c.quantity AS component_quantity,

    sl.description,
    sl.quantity_needed,
    sl.notes,

    sl.created_at
`;

const JOINS = `
    FROM ${schema}.shopping_list_items sl

    LEFT JOIN ${schema}.components c
        ON c.id = sl.component_id
`;

async function getAll() {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        ORDER BY
            sl.created_at DESC;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE sl.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.shopping_list_items (
            component_id,
            description,
            quantity_needed,
            notes,
            created_at
        ) VALUES (
            $1, $2, $3, $4, NOW()
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.component_id,
        data.description,
        data.quantity_needed,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.shopping_list_items
        SET
            component_id = $1,
            description = $2,
            quantity_needed = $3,
            notes = $4
        WHERE id = $5
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.component_id,
        data.description,
        data.quantity_needed,
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
        DELETE FROM ${schema}.shopping_list_items
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
