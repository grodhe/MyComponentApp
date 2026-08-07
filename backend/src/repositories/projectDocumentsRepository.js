const { pool, schema } = require("./baseRepository");

async function getAllForProject(projectId) {

    const sql = `
        SELECT

            id,
            project_id,
            document_name,
            document_type,
            file_name,
            notes,
            created_at

        FROM ${schema}.project_documents

        WHERE project_id = $1

        ORDER BY document_name;
    `;

    const result = await pool.query(sql, [projectId]);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT

            id,
            project_id,
            document_name,
            document_type,
            file_name,
            notes,
            created_at

        FROM ${schema}.project_documents

        WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(projectId, data) {

    const sql = `
        INSERT INTO ${schema}.project_documents (
            project_id,
            document_name,
            document_type,
            file_name,
            notes,
            created_at
        ) VALUES (
            $1, $2, $3, $4, $5, NOW()
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        projectId,
        data.document_name,
        data.document_type,
        data.file_name,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.project_documents
        SET
            document_name = $1,
            document_type = $2,
            file_name = $3,
            notes = $4
        WHERE id = $5
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.document_name,
        data.document_type,
        data.file_name,
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
        DELETE FROM ${schema}.project_documents
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
