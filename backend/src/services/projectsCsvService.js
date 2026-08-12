const projectsRepository = require("../repositories/projectsRepository");
const projectStatusRepository = require("../repositories/projectStatusRepository");
const projectsServices = require("./projectsServices");

const { parseCsv, toCsv } = require("../utils/csv");
const { normalizeKey, buildNameMap, makeNameResolver } = require("../utils/csvEntityHelpers");

const COLUMNS = [
    "id",
    "project_number",
    "project_name",
    "description",
    "status",
    "version",
    "start_date",
    "target_date",
    "completed_date",
    "github_url",
    "documentation_url",
    "image_url",
    "notes"
];

async function exportProjectsCsv() {

    const projects = await projectsRepository.getAll();

    return toCsv(projects, COLUMNS);

}

async function importProjectsCsv(csvText) {

    const { headers, records } = parseCsv(csvText);

    if (!headers.includes("project_number")) {

        const error = new Error(
            "The CSV must include a \"project_number\" column. " +
            "Export a copy from this page first to see the expected format."
        );

        error.status = 400;

        throw error;

    }

    const [existingProjects, statuses] = await Promise.all([
        projectsRepository.getAll(),
        projectStatusRepository.getAll()
    ]);

    const projectsById = new Map(existingProjects.map((p) => [String(p.id), p]));

    const projectsByNumber = new Map();

    for (const p of existingProjects) {

        const key = normalizeKey(p.project_number);

        if (key && !projectsByNumber.has(key)) {
            projectsByNumber.set(key, p);
        }

    }

    const warnings = [];
    const errors = [];

    const resolveStatusId = makeNameResolver({
        nameMap: buildNameMap(statuses),
        createFn: (name) => projectStatusRepository.create({ name }),
        label: "Status",
        warnings
    });

    let created = 0;
    let updated = 0;

    for (let i = 0; i < records.length; i++) {

        const record = records[i];
        const rowNumber = i + 2;

        const isBlankRow = COLUMNS.every((col) => !(record[col] ?? "").toString().trim());

        if (isBlankRow) {
            continue;
        }

        try {

            const projectNumber = (record.project_number ?? "").trim();

            if (!projectNumber) {

                errors.push({
                    row: rowNumber,
                    message: "project_number is required."
                });

                continue;

            }

            const status_id = await resolveStatusId(record.status, rowNumber);

            const data = {
                project_number: projectNumber,
                project_name: record.project_name,
                description: record.description,
                status_id,
                version: record.version,
                start_date: record.start_date,
                target_date: record.target_date,
                completed_date: record.completed_date,
                github_url: record.github_url,
                documentation_url: record.documentation_url,
                image_url: record.image_url,
                notes: record.notes
            };

            const idValue = (record.id ?? "").toString().trim();

            let target = null;

            if (idValue) {

                target = projectsById.get(idValue);

                if (!target) {

                    errors.push({
                        row: rowNumber,
                        message: `id ${idValue} doesn't match any existing project. ` +
                            "Leave the id column blank to add it as a new project instead."
                    });

                    continue;

                }

            } else {

                target = projectsByNumber.get(normalizeKey(projectNumber));

            }

            if (target) {

                await projectsServices.updateProject(target.id, data);
                updated += 1;

            } else {

                const createdProject = await projectsServices.createProject(data);
                created += 1;

                projectsByNumber.set(normalizeKey(projectNumber), createdProject);

            }

        } catch (err) {

            errors.push({
                row: rowNumber,
                message: err.message || "Failed to import this row."
            });

        }

    }

    return {
        created,
        updated,
        errors,
        warnings
    };

}

module.exports = {
    exportProjectsCsv,
    importProjectsCsv,
    COLUMNS
};
