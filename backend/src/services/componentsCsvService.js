const componentsRepository = require("../repositories/componentsRepository");
const manufacturersRepository = require("../repositories/manufacturersRepository");
const categoriesRepository = require("../repositories/categoriesRepository");
const locationsRepository = require("../repositories/locationsRepository");

const { normalizeComponent } = require("./componentsServices");
const { parseCsv, toCsv } = require("../utils/csv");

// Column order for both export and import. Import is header-driven (not
// positional) so a re-uploaded, re-ordered, or partially-edited export
// still works, and unknown extra columns are just ignored.
//
// "id" is included so a component can be re-imported unambiguously even
// if its part_number was edited in the spreadsheet -- see importRow()
// below for the matching rules.
const COLUMNS = [
    "id",
    "part_number",
    "part_name",
    "description",
    "manufacturer",
    "category",
    "location",
    "manufacturer_part_number",
    "package",
    "footprint",
    "component_value",
    "quantity",
    "minimum_quantity",
    "datasheet_url",
    "notes"
];

async function exportComponentsCsv() {

    const components = await componentsRepository.getAll();

    return toCsv(components, COLUMNS);

}

function normalizeKey(value) {

    return (value ?? "").toString().trim().toLowerCase();

}

// Builds "name -> id" lookup maps for the flat (non-hierarchical) lookup
// tables, and a "name -> [ids]" map for locations so ambiguous names (the
// same location name used under two different parents/cabinets) can be
// detected instead of silently matched to the wrong one.
function buildNameMap(rows) {

    const map = new Map();

    for (const row of rows) {

        const key = normalizeKey(row.name);

        if (!key) {
            continue;
        }

        if (!map.has(key)) {
            map.set(key, []);
        }

        map.get(key).push(row);

    }

    return map;

}

async function importComponentsCsv(csvText) {

    const { headers, records } = parseCsv(csvText);

    if (!headers.includes("part_number")) {

        const error = new Error(
            "The CSV must include a \"part_number\" column. " +
            "Export a copy from this page first to see the expected format."
        );

        error.status = 400;

        throw error;

    }

    const [
        existingComponents,
        manufacturers,
        categories,
        locations
    ] = await Promise.all([
        componentsRepository.getAll(),
        manufacturersRepository.getAll(),
        categoriesRepository.getAll(),
        locationsRepository.getAll()
    ]);

    const componentsById = new Map(
        existingComponents.map((c) => [String(c.id), c])
    );

    const componentsByPartNumber = new Map();

    for (const c of existingComponents) {

        const key = normalizeKey(c.part_number);

        // If part numbers aren't unique in the real data, the first one
        // found wins for matching purposes -- everything else with that
        // part number is left alone by import (existing ambiguity isn't
        // something a CSV import should try to silently resolve).
        if (key && !componentsByPartNumber.has(key)) {
            componentsByPartNumber.set(key, c);
        }

    }

    const manufacturerMap = buildNameMap(manufacturers);
    const categoryMap = buildNameMap(categories);
    const locationMap = buildNameMap(locations);

    // Manufacturers/categories created during this import are cached here
    // so importing the same new name twice in one file only creates it
    // once.
    const createdManufacturers = new Map();
    const createdCategories = new Map();

    let created = 0;
    let updated = 0;
    const errors = [];
    const warnings = [];

    async function resolveManufacturerId(name, rowNumber) {

        const key = normalizeKey(name);

        if (!key) {
            return null;
        }

        const existing = manufacturerMap.get(key);

        if (existing && existing.length > 0) {
            return existing[0].id;
        }

        if (createdManufacturers.has(key)) {
            return createdManufacturers.get(key);
        }

        const created = await manufacturersRepository.create({
            name: name.trim(),
            website: null,
            notes: null
        });

        manufacturerMap.set(key, [created]);
        createdManufacturers.set(key, created.id);

        warnings.push({
            row: rowNumber,
            message: `Manufacturer "${name.trim()}" didn't exist yet -- created it.`
        });

        return created.id;

    }

    async function resolveCategoryId(name, rowNumber) {

        const key = normalizeKey(name);

        if (!key) {
            return null;
        }

        const existing = categoryMap.get(key);

        if (existing && existing.length > 0) {
            return existing[0].id;
        }

        if (createdCategories.has(key)) {
            return createdCategories.get(key);
        }

        const created = await categoriesRepository.create({
            name: name.trim(),
            description: null
        });

        categoryMap.set(key, [created]);
        createdCategories.set(key, created.id);

        warnings.push({
            row: rowNumber,
            message: `Category "${name.trim()}" didn't exist yet -- created it.`
        });

        return created.id;

    }

    function resolveLocationId(name, rowNumber) {

        const key = normalizeKey(name);

        if (!key) {
            return null;
        }

        const matches = locationMap.get(key);

        if (!matches || matches.length === 0) {

            warnings.push({
                row: rowNumber,
                message: `Location "${name.trim()}" wasn't found -- left blank. ` +
                    "Locations aren't auto-created (they can be nested under a " +
                    "cabinet/drawer), so set it manually on the component afterwards."
            });

            return null;

        }

        if (matches.length > 1) {

            warnings.push({
                row: rowNumber,
                message: `Location "${name.trim()}" matches ${matches.length} different ` +
                    "locations -- left blank. Set it manually on the component afterwards."
            });

            return null;

        }

        return matches[0].id;

    }

    for (let i = 0; i < records.length; i++) {

        const record = records[i];
        const rowNumber = i + 2; // +1 for 0-index, +1 for the header row

        const isBlankRow = COLUMNS.every((col) => !(record[col] ?? "").toString().trim());

        if (isBlankRow) {
            continue;
        }

        try {

            const partNumber = (record.part_number ?? "").trim();

            if (!partNumber) {

                errors.push({
                    row: rowNumber,
                    message: "part_number is required."
                });

                continue;

            }

            const manufacturer_id = await resolveManufacturerId(record.manufacturer, rowNumber);
            const category_id = await resolveCategoryId(record.category, rowNumber);
            const location_id = resolveLocationId(record.location, rowNumber);

            const data = normalizeComponent({
                part_number: partNumber,
                part_name: record.part_name,
                description: record.description,
                manufacturer_part_number: record.manufacturer_part_number,
                package: record.package,
                footprint: record.footprint,
                component_value: record.component_value,
                quantity: record.quantity,
                minimum_quantity: record.minimum_quantity,
                datasheet_url: record.datasheet_url,
                notes: record.notes,
                manufacturer_id,
                category_id,
                location_id
            });

            const idValue = (record.id ?? "").toString().trim();

            let target = null;

            if (idValue) {

                target = componentsById.get(idValue);

                if (!target) {

                    errors.push({
                        row: rowNumber,
                        message: `id ${idValue} doesn't match any existing component. ` +
                            "Leave the id column blank to add it as a new component instead."
                    });

                    continue;

                }

            } else {

                target = componentsByPartNumber.get(normalizeKey(partNumber));

            }

            if (target) {

                await componentsRepository.update(target.id, data);
                updated += 1;

            } else {

                const createdComponent = await componentsRepository.create(data);
                created += 1;

                // So a second row later in the same file with the same new
                // part_number updates this row instead of creating a
                // duplicate.
                componentsByPartNumber.set(normalizeKey(partNumber), createdComponent);

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
    exportComponentsCsv,
    importComponentsCsv,
    COLUMNS
};
