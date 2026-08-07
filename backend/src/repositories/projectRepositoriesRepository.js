const { pool, schema } = require("./baseRepository");

async function getAllForProject(projectId) {

    const sql = `
        SELECT

            id,
            project_id,
            repository_name,
            repository_type,
            repository_url,
            notes

        FROM ${schema}.project_repositories

        WHERE project_id = $1

        ORDER BY repository_name;
    `;

    const result = await pool.query(sql, [projectId]);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT

            id,
            project_id,
            repository_name,
            repository_type,
            repository_url,
            notes

        FROM ${schema}.project_repositories

        WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(projectId, data) {

    const sql = `
        INSERT INTO ${schema}.project_repositories (
            project_id,
            repository_name,
            repository_type,
            repository_url,
            notes
        ) VALUES (
            $1, $2, $3, $4, $5
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        projectId,
        data.repository_name,
        data.repository_type,
        data.repository_url,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.project_repositories
        SET
            repository_name = $1,
            repository_type = $2,
            repository_url = $3,
            notes = $4
        WHERE id = $5
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.repository_name,
        data.repository_type,
        data.repository_url,
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
        DELETE FROM ${schema}.project_repositories
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
