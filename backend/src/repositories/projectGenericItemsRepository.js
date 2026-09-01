const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    pgi.id,

    pgi.project_id,

    pgi.generic_item_id,
    gi.name AS item_name,
    gi.part_number,
    gi.unit,
    gi.quantity AS available_quantity,
    gi.purchase_price,
    gi.updated_at,

    pgi.quantity,
    pgi.notes
`;

const JOINS = `
    FROM ${schema}.project_generic_items pgi

    LEFT JOIN ${schema}.generic_items gi
        ON gi.id = pgi.generic_item_id
`;

async function getAllForProject(projectId) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE pgi.project_id = $1
        ORDER BY
            gi.name;
    `;

    const result = await pool.query(sql, [projectId]);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE pgi.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(projectId, data) {

    const sql = `
        INSERT INTO ${schema}.project_generic_items (
            project_id,
            generic_item_id,
            quantity,
            notes
        ) VALUES (
            $1, $2, $3, $4
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        projectId,
        data.generic_item_id,
        data.quantity,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.project_generic_items
        SET
            generic_item_id = $1,
            quantity = $2,
            notes = $3
        WHERE id = $4
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.generic_item_id,
        data.quantity,
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
        DELETE FROM ${schema}.project_generic_items
        WHERE id = $1
        RETURNING id;
    `;

    const result = await pool.query(sql, [id]);

    return result.rowCount > 0;

}

module.exports = {
    getAllForProject,
    getById,
    create,
    update,
    remove
};
