const { pool, schema, locationPathCte } = require("./baseRepository");

const SELECT_FIELDS = `
    gi.id,

    gi.name,
    gi.description,

    gi.category_id,
    cat.name AS category,

    gi.location_id,
    l.path AS location,

    gi.supplier_id,
    s.name AS supplier,

    gi.part_number,

    gi.unit,

    gi.barcode,

    gi.quantity,
    gi.minimum_quantity,

    gi.reference_url,
    gi.notes,

    gi.created_at,
    gi.updated_at
`;

const JOINS = `
    FROM ${schema}.generic_items gi

    LEFT JOIN ${schema}.categories cat
        ON cat.id = gi.category_id

    LEFT JOIN location_path l
        ON l.id = gi.location_id

    LEFT JOIN ${schema}.suppliers s
        ON s.id = gi.supplier_id
`;

async function getAll() {

    const sql = `
        ${locationPathCte()}
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        ORDER BY
            gi.name;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

async function getById(id) {

    const sql = `
        ${locationPathCte()}
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE gi.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.generic_items (
            name,
            description,
            category_id,
            location_id,
            supplier_id,
            part_number,
            unit,
            barcode,
            quantity,
            minimum_quantity,
            reference_url,
            notes,
            created_at,
            updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
        )
        RETURNING id;
    `;

    const values = [
        data.name,
        data.description,
        data.category_id,
        data.location_id,
        data.supplier_id,
        data.part_number,
        data.unit,
        data.barcode,
        data.quantity,
        data.minimum_quantity,
        data.reference_url,
        data.notes
    ];

    const result = await pool.query(sql, values);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.generic_items
        SET
            name = $1,
            description = $2,
            category_id = $3,
            location_id = $4,
            supplier_id = $5,
            part_number = $6,
            unit = $7,
            barcode = $8,
            quantity = $9,
            minimum_quantity = $10,
            reference_url = $11,
            notes = $12,
            updated_at = NOW()
        WHERE id = $13
        RETURNING id;
    `;

    const values = [
        data.name,
        data.description,
        data.category_id,
        data.location_id,
        data.supplier_id,
        data.part_number,
        data.unit,
        data.barcode,
        data.quantity,
        data.minimum_quantity,
        data.reference_url,
        data.notes,
        id
    ];

    const result = await pool.query(sql, values);

    if (result.rowCount === 0) {
        return null;
    }

    return getById(id);

}

async function remove(id) {

    const sql = `
        DELETE FROM ${schema}.generic_items
        WHERE id = $1
        RETURNING id;
    `;

    const result = await pool.query(sql, [id]);

    return result.rowCount > 0;

}

async function touchUpdatedAt(id) {

    await pool.query(
        `UPDATE ${schema}.generic_items SET updated_at = NOW() WHERE id = $1`,
        [id]
    );

}

async function findByBarcode(barcode) {

    const sql = `
        ${locationPathCte()}
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE gi.barcode = $1
        LIMIT 1;
    `;

    const result = await pool.query(sql, [barcode]);

    return result.rows[0];

}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    touchUpdatedAt,
    findByBarcode
};
