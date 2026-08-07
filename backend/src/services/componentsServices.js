const repository = require("../repositories/componentsRepository");
const { translatePgError } = require("../utils/pgErrors");

// Converts "" -> null for FK fields and coerces quantity fields to numbers,
// so the DB never sees an empty string where it expects an integer.
function normalize(data = {}) {

    const toIntOrNull = (value) => {

        if (value === "" || value === null || value === undefined) {
            return null;
        }

        const parsed = Number(value);

        return Number.isNaN(parsed) ? null : parsed;

    };

    return {
        part_number: data.part_number ?? "",
        part_name: data.part_name ?? "",
        description: data.description ?? "",
        manufacturer_part_number: data.manufacturer_part_number ?? "",
        package: data.package ?? "",
        footprint: data.footprint ?? "",
        component_value: data.component_value ?? "",
        quantity: toIntOrNull(data.quantity) ?? 0,
        minimum_quantity: toIntOrNull(data.minimum_quantity) ?? 0,
        datasheet_url: data.datasheet_url ?? "",
        notes: data.notes ?? "",
        manufacturer_id: toIntOrNull(data.manufacturer_id),
        category_id: toIntOrNull(data.category_id),
        location_id: toIntOrNull(data.location_id)
    };

}

async function getAllComponents() {

    return await repository.getAll();

}

async function getComponentById(id) {

    return await repository.getById(id);

}

async function createComponent(data) {

    if (!data.part_number || !data.part_number.trim()) {
        const error = new Error("part_number is required");
        error.status = 400;
        throw error;
    }

    return await repository.create(normalize(data));

}

async function updateComponent(id, data) {

    if (!data.part_number || !data.part_number.trim()) {
        const error = new Error("part_number is required");
        error.status = 400;
        throw error;
    }

    const updated = await repository.update(id, normalize(data));

    if (!updated) {
        const error = new Error(`Component ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteComponent(id) {

    try {

        const deleted = await repository.remove(id);

        if (!deleted) {
            const error = new Error(`Component ${id} not found`);
            error.status = 404;
            throw error;
        }

    } catch (err) {

        throw translatePgError(err, {
            referenceMessage: "This component is used in one or more projects and can't be deleted while it's still referenced there."
        });

    }

}

module.exports = {
    getAllComponents,
    getComponentById,
    createComponent,
    updateComponent,
    deleteComponent
};
