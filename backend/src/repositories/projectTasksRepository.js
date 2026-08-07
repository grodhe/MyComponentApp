const { pool, schema } = require("./baseRepository");

async function getAllForProject(projectId) {

    const sql = `
        SELECT

            id,
            project_id,
            title,
            status,
            priority,
            due_date,
            completed_date,
            notes

        FROM ${schema}.project_tasks

        WHERE project_id = $1

        ORDER BY
            (completed_date IS NOT NULL),
            due_date NULLS LAST,
            title;
    `;

    const result = await pool.query(sql, [projectId]);

    return result.rows;

}

async function getById(id) {

    const sql = `
        SELECT

            id,
            project_id,
            title,
            status,
            priority,
            due_date,
            completed_date,
            notes

        FROM ${schema}.project_tasks

        WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];

}

async function create(projectId, data) {

    const sql = `
        INSERT INTO ${schema}.project_tasks (
            project_id,
            title,
            status,
            priority,
            due_date,
            completed_date,
            notes
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        projectId,
        data.title,
        data.status,
        data.priority,
        data.due_date,
        data.completed_date,
        data.notes
    ]);

    return getById(result.rows[0].id);

}

async function update(id, data) {

    const sql = `
        UPDATE ${schema}.project_tasks
        SET
            title = $1,
            status = $2,
            priority = $3,
            due_date = $4,
            completed_date = $5,
            notes = $6
        WHERE id = $7
        RETURNING id;
    `;

    const result = await pool.query(sql, [
        data.title,
        data.status,
        data.priority,
        data.due_date,
        data.completed_date,
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
        DELETE FROM ${schema}.project_tasks
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
