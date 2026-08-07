const { pool, schema } = require("./baseRepository");

const SELECT_FIELDS = `
    p.id,

    p.project_number,
    p.project_name,
    p.description,

    p.status_id,
    ps.name AS status,

    p.version,

    p.start_date,
    p.target_date,
    p.completed_date,

    p.github_url,
    p.documentation_url,
    p.image_url,

    p.notes,

    p.created_at,
    p.updated_at
`;

const JOINS = `
    FROM ${schema}.projects p

    LEFT JOIN ${schema}.project_status ps
        ON ps.id = p.status_id
`;

async function getAll() {

    const sql = `
        SELECT
            ${SELECT_FIELDS}
        ${JOINS}
        ORDER BY
            p.project_number;
    `;

    const result = await pool.query(sql);

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

async function create(data) {

    const sql = `
        INSERT INTO ${schema}.projects (
            project_number,
            project_name,
            description,
            status_id,
            version,
            start_date,
            target_date,
            completed_date,
            github_url,
            documentation_url,
            image_url,
            notes,
            created_at,
            updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
        )
        RETURNING id;
    `;

    const values = [
        data.project_number,
        data.project_name,
        data.description,
        data.status_id,
        data.version,
        data.start_date,
        data.target_date,
        data.completed_date,
        data.github_url,
        data.documentation_url,
        data.image_url,
        data.notes
    ];

    const result = await pool.query(sql, values);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.projects
        SET
            project_number = $1,
            project_name = $2,
            description = $3,
            status_id = $4,
            version = $5,
            start_date = $6,
            target_date = $7,
            completed_date = $8,
            github_url = $9,
            documentation_url = $10,
            image_url = $11,
            notes = $12,
            updated_at = NOW()
        WHERE id = $13
        RETURNING id;
    `;

    const values = [
        data.project_number,
        data.project_name,
        data.description,
        data.status_id,
        data.version,
        data.start_date,
        data.target_date,
        data.completed_date,
        data.github_url,
        data.documentation_url,
        data.image_url,
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
        DELETE FROM ${schema}.projects
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
