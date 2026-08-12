const genericItemsRepository = require("../repositories/genericItemsRepository");
const categoriesRepository = require("../repositories/categoriesRepository");
const locationsRepository = require("../repositories/locationsRepository");
const suppliersRepository = require("../repositories/suppliersRepository");
const genericItemsServices = require("./genericItemsServices");

const { parseCsv, toCsv } = require("../utils/csv");
const { normalizeKey, buildNameMap, makeNameResolver } = require("../utils/csvEntityHelpers");

const COLUMNS = [
    "id",
    "name",
    "description",
    "category",
    "location",
    "supplier",
    "part_number",
    "unit",
    "quantity",
    "minimum_quantity",
    "reference_url",
    "notes"
];

async function exportGenericItemsCsv() {

    const items = await genericItemsRepository.getAll();

    return toCsv(items, COLUMNS);

}

async function importGenericItemsCsv(csvText) {

    const { headers, records } = parseCsv(csvText);

    if (!headers.includes("name")) {

        const error = new Error(
            "The CSV must include a \"name\" column. " +
            "Export a copy from this page first to see the expected format."
        );

        error.status = 400;

        throw error;

    }

    const [
        existingItems,
        categories,
        locations,
        suppliers
    ] = await Promise.all([
        genericItemsRepository.getAll(),
        categoriesRepository.getAll(),
        locationsRepository.getAll(),
        suppliersRepository.getAll()
    ]);

    const itemsById = new Map(existingItems.map((i) => [String(i.id), i]));

    const itemsByName = new Map();

    for (const item of existingItems) {

        const key = normalizeKey(item.name);

        if (key && !itemsByName.has(key)) {
            itemsByName.set(key, item);
        }

    }

    const warnings = [];
    const errors = [];

    const resolveCategoryId = makeNameResolver({
        nameMap: buildNameMap(categories),
        createFn: (name) => categoriesRepository.create({ name, description: null }),
        label: "Category",
        warnings
    });

    const resolveLocationId = makeNameResolver({
        nameMap: buildNameMap(locations),
        // No createFn -- locations are nested/hierarchical, so a flat CSV
        // name isn't enough to safely create one.
        label: "Location",
        warnings
    });

    const resolveSupplierId = makeNameResolver({
        nameMap: buildNameMap(suppliers),
        createFn: (name) => suppliersRepository.create({
            name,
            website: null,
            country: null,
            currency: null,
            notes: null
        }),
        label: "Supplier",
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

            const name = (record.name ?? "").trim();

            if (!name) {

                errors.push({
                    row: rowNumber,
                    message: "name is required."
                });

                continue;

            }

            const category_id = await resolveCategoryId(record.category, rowNumber);
            const location_id = await resolveLocationId(record.location, rowNumber);
            const supplier_id = await resolveSupplierId(record.supplier, rowNumber);

            const data = {
                name,
                description: record.description,
                category_id,
                location_id,
                supplier_id,
                part_number: record.part_number,
                unit: record.unit,
                quantity: record.quantity,
                minimum_quantity: record.minimum_quantity,
                reference_url: record.reference_url,
                notes: record.notes
            };

            const idValue = (record.id ?? "").toString().trim();

            let target = null;

            if (idValue) {

                target = itemsById.get(idValue);

                if (!target) {

                    errors.push({
                        row: rowNumber,
                        message: `id ${idValue} doesn't match any existing generic item. ` +
                            "Leave the id column blank to add it as a new item instead."
                    });

                    continue;

                }

            } else {

                target = itemsByName.get(normalizeKey(name));

            }

            if (target) {

                await genericItemsServices.updateGenericItem(target.id, data);
                updated += 1;

            } else {

                const createdItem = await genericItemsServices.createGenericItem(data);
                created += 1;

                itemsByName.set(normalizeKey(name), createdItem);

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
    exportGenericItemsCsv,
    importGenericItemsCsv,
    COLUMNS
};
