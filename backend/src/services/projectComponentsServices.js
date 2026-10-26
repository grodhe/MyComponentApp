const repository = require("../repositories/projectComponentsRepository");
const { translatePgError } = require("../utils/pgErrors");
const { toCsv } = require("../utils/csv");

// Assembly-house BOM export profiles. Each maps a row from
// repository.getAllForProject() to the column names/order that house's
// upload expects. All three append a "Part Number" column at the end --
// your own internal reference, not part of any house's required format --
// so you can cross-check against your inventory before deleting that
// column and submitting the file.
//
// jlcpcb: verified against jlcpcb.com/help/article/how-to-generate-the-
//   bom-and-centroid-file-from-kicad -- Comment, Designator, Footprint,
//   LCSC Part #. Multiple same-value parts are one row with
//   space-separated designators (already how reference_designators works
//   here).
// pcbway: verified against pcbway.com/assembly-file-requirements.html --
//   Designator, Value, Package, and a part-number column (MPN/Supplier
//   PN). We don't track a separate manufacturer part number, so MPN is
//   filled from the same supplier_part_number field as JLCPCB's LCSC
//   column.
// seeed: verified against wiki.seeedstudio.com/Service_for_Fusion_PCB --
//   Designator, MPN / Seeed SKU, Quantity (their quoting system derives
//   everything else). Quantity here is the per-assembly quantity
//   (project_components.quantity), not the warehouse stock level.
// appLabels is a second header row, in our own app's field names,
// aligned 1-for-1 with `columns` -- a reading aid so it's obvious which
// app field landed in which manufacturer column. It goes ABOVE the real
// header row and is meant to be deleted before the file is handed to the
// assembly house, same as the Part Number column.
const BOM_PROFILES = {

    jlcpcb: {
        columns: ["Comment", "Designator", "Footprint", "LCSC Part #", "Part Number"],
        appLabels: ["Component Value", "Reference Designators", "Package", "Supplier Part Number", "Part Number"],
        mapRow: (row) => ({
            "Comment": row.component_value || row.part_name || "",
            "Designator": row.reference_designators || "",
            "Footprint": row.package || "",
            "LCSC Part #": row.supplier_part_number || "",
            "Part Number": row.part_number || ""
        })
    },

    pcbway: {
        columns: ["Designator", "Value", "Package", "MPN", "Part Number"],
        appLabels: ["Reference Designators", "Component Value", "Package", "Supplier Part Number", "Part Number"],
        mapRow: (row) => ({
            "Designator": row.reference_designators || "",
            "Value": row.component_value || row.part_name || "",
            "Package": row.package || "",
            "MPN": row.supplier_part_number || "",
            "Part Number": row.part_number || ""
        })
    },

    seeed: {
        columns: ["Designator", "MPN / Seeed SKU", "Quantity", "Part Number"],
        appLabels: ["Reference Designators", "Supplier Part Number", "Quantity Per Assembly", "Part Number"],
        mapRow: (row) => ({
            "Designator": row.reference_designators || "",
            "MPN / Seeed SKU": row.supplier_part_number || "",
            "Quantity": row.quantity ?? "",
            "Part Number": row.part_number || ""
        })
    }

};

const DEFAULT_BOM_PROFILE = "jlcpcb";

function toIntOrNull(value) {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

}

function normalize(data = {}) {

    const quantity = toIntOrNull(data.quantity);

    return {
        component_id: toIntOrNull(data.component_id),
        quantity: quantity === null ? 1 : quantity,
        reference_designators: data.reference_designators ?? "",
        notes: data.notes ?? ""
    };

}

function validate(normalized) {

    if (!normalized.component_id) {
        const error = new Error("component_id is required");
        error.status = 400;
        throw error;
    }

}

async function getAllForProject(projectId) {

    return await repository.getAllForProject(projectId);

}

async function createProjectComponent(projectId, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        return await repository.create(projectId, normalized);

    } catch (err) {

        throw translatePgError(err);

    }

}

async function updateProjectComponent(id, data) {

    const normalized = normalize(data);

    validate(normalized);

    try {

        const updated = await repository.update(id, normalized);

        if (!updated) {
            const error = new Error(`Project component ${id} not found`);
            error.status = 404;
            throw error;
        }

        return updated;

    } catch (err) {

        throw translatePgError(err);

    }

}

async function deleteProjectComponent(id) {

    const deleted = await repository.remove(id);

    if (!deleted) {
        const error = new Error(`Project component ${id} not found`);
        error.status = 404;
        throw error;
    }

}

async function exportBom(projectId, profileKey) {

    const profile = BOM_PROFILES[profileKey] || BOM_PROFILES[DEFAULT_BOM_PROFILE];

    const rows = await repository.getAllForProject(projectId);

    const records = rows.map(profile.mapRow);

    // appLabels row goes in as plain text, not through toCsv's own
    // escaping -- every label here is a short fixed string we chose
    // ourselves with no commas/quotes/newlines in it, so it's always
    // safe to join directly.
    const labelRow = profile.appLabels.join(",") + "\r\n";

    return labelRow + toCsv(records, profile.columns);

}

module.exports = {
    getAllForProject,
    createProjectComponent,
    updateProjectComponent,
    deleteProjectComponent,
    exportBom,
    BOM_PROFILES
};
