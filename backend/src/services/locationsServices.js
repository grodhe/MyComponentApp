const repository = require("../repositories/locationsRepository");
const componentsRepository = require("../repositories/componentsRepository");
const genericItemsRepository = require("../repositories/genericItemsRepository");
const { translatePgError } = require("../utils/pgErrors");

function toIntOrNull(value) {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;

}

function normalize(data = {}) {

    return {
        name: (data.name ?? "").trim(),
        description: data.description ?? "",
        parent_id: toIntOrNull(data.parent_id)
    };

}

async function getAllLocations() {

    return await repository.getAll();

}

async function getLocationById(id) {

    return await repository.getById(id);

}

async function createLocation(data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    return await repository.create(normalized);

}

async function updateLocation(id, data) {

    const normalized = normalize(data);

    if (!normalized.name) {
        const error = new Error("name is required");
        error.status = 400;
        throw error;
    }

    if (normalized.parent_id !== null && Number(normalized.parent_id) === Number(id)) {
        const error = new Error("A location can't be its own parent");
        error.status = 400;
        throw error;
    }

    const updated = await repository.update(id, normalized);

    if (!updated) {
        const error = new Error(`Location ${id} not found`);
        error.status = 404;
        throw error;
    }

    return updated;

}

async function deleteLocation(id) {

    try {

        const deleted = await repository.remove(id);

        if (!deleted) {
            const error = new Error(`Location ${id} not found`);
            error.status = 404;
            throw error;
        }

    } catch (err) {

        throw translatePgError(err, {
            referenceMessage: "This location still has sub-locations or items stored in it, so it can't be deleted while those still reference it."
        });

    }

}

// Powers "click a drawer, see what's in it": everything (components +
// generic items) whose location_id points directly at this location. Does
// NOT recurse into child locations -- a cabinet's own contents are separate
// from what's in its drawers, matching how the physical shelf works.
async function getLocationContents(id) {

    const location = await repository.getById(id);

    if (!location) {
        const error = new Error(`Location ${id} not found`);
        error.status = 404;
        throw error;
    }

    const [components, genericItems] = await Promise.all([
        componentsRepository.getByLocationId(id),
        genericItemsRepository.getByLocationId(id)
    ]);

    return {
        location,
        components,
        genericItems
    };

}

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    getLocationContents
};
