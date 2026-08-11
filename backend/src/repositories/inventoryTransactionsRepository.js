const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    t.id,

    t.component_id,
    c.part_number,
    c.part_name,

    t.quantity_delta,
    t.reason,

    t.created_at
`;

const JOINS = `
    FROM ${schema}.inventory_transactions t

    JOIN ${schema}.components c
        ON c.id = t.component_id
`;

async function getAll() {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        ORDER BY t.created_at DESC, t.id DESC;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

async function getByComponentId(componentId) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE t.component_id = $1
        ORDER BY t.created_at DESC, t.id DESC;
    `;

    const result = await pool.query(sql, [componentId]);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE t.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create({ component_id, quantity_delta, reason }) {

    const sql = `
        INSERT INTO ${schema}.inventory_transactions (
            component_id,
            quantity_delta,
            reason,
            created_at
        ) VALUES (
            $1, $2, $3, NOW()
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [component_id, quantity_delta, reason]);

    return getById(result.rows[0].id);

}

module.exports = {
    getAll,
    getByComponentId,
    create
};
