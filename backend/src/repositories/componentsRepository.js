const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    c.id,

    c.part_number,
    c.part_name,
    c.description,

    c.manufacturer_part_number,

    c.package,
    c.footprint,
    c.component_value,

    c.quantity,
    c.minimum_quantity,

    c.datasheet_url,

    c.notes,

    c.created_at,
    c.updated_at,

    c.manufacturer_id,
    m.name AS manufacturer,
    m.website AS manufacturer_website,

    c.category_id,
    cat.name AS category,

    c.location_id,
    l.name AS location
`;

const JOINS = `
    FROM ${schema}.components c

    LEFT JOIN ${schema}.manufacturers m
        ON m.id = c.manufacturer_id

    LEFT JOIN ${schema}.categories cat
        ON cat.id = c.category_id

    LEFT JOIN ${schema}.locations l
        ON l.id = c.location_id
`;

async function getAll() {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        ORDER BY
            c.part_number;
    `;

    const result = await pool.query(sql);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        WHERE c.id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.components (
            part_number,
            part_name,
            description,
            manufacturer_part_number,
            package,
            footprint,
            component_value,
            quantity,
            minimum_quantity,
            datasheet_url,
            notes,
            manufacturer_id,
            category_id,
            location_id,
            created_at,
            updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
        )
        RETURNING id;
    `;

    const values = [
        data.part_number,
        data.part_name,
        data.description,
        data.manufacturer_part_number,
        data.package,
        data.footprint,
        data.component_value,
        data.quantity,
        data.minimum_quantity,
        data.datasheet_url,
        data.notes,
        data.manufacturer_id,
        data.category_id,
        data.location_id
    ];

    const result = await pool.query(sql, values);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.components
        SET
            part_number = $1,
            part_name = $2,
            description = $3,
            manufacturer_part_number = $4,
            package = $5,
            footprint = $6,
            component_value = $7,
            quantity = $8,
            minimum_quantity = $9,
            datasheet_url = $10,
            notes = $11,
            manufacturer_id = $12,
            category_id = $13,
            location_id = $14,
            updated_at = NOW()
        WHERE id = $15
        RETURNING id;
    `;

    const values = [
        data.part_number,
        data.part_name,
        data.description,
        data.manufacturer_part_number,
        data.package,
        data.footprint,
        data.component_value,
        data.quantity,
        data.minimum_quantity,
        data.datasheet_url,
        data.notes,
        data.manufacturer_id,
        data.category_id,
        data.location_id,
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
        DELETE FROM ${schema}.components
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
