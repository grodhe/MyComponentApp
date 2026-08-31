const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    p.id,
    p.component_id,

    p.supplier_id,
    s.name AS supplier,

    p.supplier_part_number,

    p.quantity,
    p.unit_price,

    p.purchase_date,
    p.order_reference,
    p.notes,

    p.created_at
`;

const JOINS = `
    FROM ${schema}.purchases p

    LEFT JOIN ${schema}.suppliers s
        ON s.id = p.supplier_id
`;

async function getAllForComponent(componentId) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE p.component_id = $1
        ORDER BY
            p.purchase_date DESC NULLS LAST,
            p.created_at DESC;
    `;

    const result = await pool.query(sql, [componentId]);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE p.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(componentId, data) {

    const sql = `
        INSERT INTO ${schema}.purchases (
            component_id,
            supplier_id,
            supplier_part_number,
            quantity,
            unit_price,
            purchase_date,
            order_reference,
            notes,
            created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, NOW()
        )
        RETURNING id;
    `;

    const values = [
        componentId,
        data.supplier_id,
        data.supplier_part_number,
        data.quantity,
        data.unit_price,
        data.purchase_date,
        data.order_reference,
        data.notes
    ];

    const result = await pool.query(sql, values);

    return getById(result.rows[0].id);

}

async function remove(id) {

    const sql = `
        DELETE FROM ${schema}.purchases
        WHERE id = $1
        RETURNING id;
    `;

    const result = await pool.query(sql, [id]);

    return result.rowCount > 0;

}

module.exports = {
    getAllForComponent,
    getById,
    create,
    remove
};
