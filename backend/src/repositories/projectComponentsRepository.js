const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    pc.id,

    pc.project_id,

    pc.component_id,
    c.part_number,
    c.part_name,
    c.component_value,
    c.quantity AS available_quantity,
    c.updated_at,

    pc.quantity,
    pc.reference_designators,
    pc.notes
`;

const JOINS = `
    FROM ${schema}.project_components pc

    LEFT JOIN ${schema}.components c
        ON c.id = pc.component_id
`;

async function getAllForProject(projectId) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE pc.project_id = $1
        ORDER BY
            c.part_number;
    `;

    const result = await pool.query(sql, [projectId]);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE pc.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(projectId, data) {

    const sql = `
        INSERT INTO ${schema}.project_components (
            project_id,
            component_id,
            quantity,
            reference_designators,
            notes
        ) VALUES (
            $1, $2, $3, $4, $5
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        projectId,
        data.component_id,
        data.quantity,
        data.reference_designators,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.project_components
        SET
            component_id = $1,
            quantity = $2,
            reference_designators = $3,
            notes = $4
        WHERE id = $5
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.component_id,
        data.quantity,
        data.reference_designators,
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
        DELETE FROM ${schema}.project_components
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
