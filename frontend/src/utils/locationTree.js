// Shared helpers for turning the flat locations list (each row has
// parent_id) into a tree, and for computing paths/descendant sets. Used by
// LocationTree.jsx (rendering) and LocationDialog.jsx (excluding a
// location and its own descendants from its "parent" picker, so you can't
// create a cycle like Drawer A1 becoming the parent of Cabinet A).

// Postgres can return id-type columns as either a number or a string
// depending on their declared column type (e.g. a BIGSERIAL id comes back
// as a string from node-postgres, while a plain INTEGER parent_id comes
// back as a number). Comparing/keying a Map with one of each type looks
// fine but silently never matches (e.g. Map.get(16) !== Map.get("16")).
// Normalizing every id/parent_id through this before use avoids that.
function normId(value) {
    if (value === null || value === undefined || value === "")
        return null;
    return String(value);
}

export function buildLocationTree(locations) {

    const byId = new Map(
        locations.map((loc) => [normId(loc.id), { ...loc, children: [] }])
    );

    const roots = [];

    for (const loc of byId.values()) {

        const parentKey = normId(loc.parent_id);

        if (parentKey && byId.has(parentKey)) {
            byId.get(parentKey).children.push(loc);
        } else {
            roots.push(loc);
        }

    }

    function sortRec(nodes) {

        nodes.sort((a, b) => a.name.localeCompare(b.name));
        nodes.forEach((node) => sortRec(node.children));

    }

    sortRec(roots);

    return roots;

}

// All ids below `id` in the tree (children, grandchildren, ...). Does not
// include `id` itself.
export function getDescendantIds(locations, id) {

    const childrenByParent = new Map();

    for (const loc of locations) {

        const key = normId(loc.parent_id);

        if (!childrenByParent.has(key)) {
            childrenByParent.set(key, []);
        }

        childrenByParent.get(key).push(normId(loc.id));

    }

    const result = new Set();
    const stack = [normId(id)];

    while (stack.length > 0) {

        const current = stack.pop();
        const kids = childrenByParent.get(current) ?? [];

        for (const kid of kids) {

            if (!result.has(kid)) {
                result.add(kid);
                stack.push(kid);
            }

        }

    }

    return result;

}

// Builds the full nested tree used by the Locations page: location nodes
// (Cabinet, Drawer, ...) with their child locations AND the components /
// generic items filed directly in them, all as one unified list of
// children. Each node is tagged with `nodeType` so the tree renderer knows
// which icon/actions to show, and `raw` keeps the original record around
// for edit/delete/print.
export function buildFullLocationTree(locations, components = [], genericItems = []) {

    const locationsByParent = new Map();

    for (const loc of locations) {

        const key = normId(loc.parent_id);

        if (!locationsByParent.has(key)) {
            locationsByParent.set(key, []);
        }

        locationsByParent.get(key).push(loc);

    }

    const componentsByLocation = new Map();

    for (const component of components) {

        const key = normId(component.location_id);

        if (!key)
            continue;

        if (!componentsByLocation.has(key)) {
            componentsByLocation.set(key, []);
        }

        componentsByLocation.get(key).push(component);

    }

    const itemsByLocation = new Map();

    for (const item of genericItems) {

        const key = normId(item.location_id);

        if (!key)
            continue;

        if (!itemsByLocation.has(key)) {
            itemsByLocation.set(key, []);
        }

        itemsByLocation.get(key).push(item);

    }

    function buildLocationNode(loc) {

        const locKey = normId(loc.id);

        const childLocations = (locationsByParent.get(locKey) ?? [])
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(buildLocationNode);

        const childComponents = (componentsByLocation.get(locKey) ?? [])
            .slice()
            .sort((a, b) => (a.part_number ?? "").localeCompare(b.part_number ?? ""))
            .map((component) => ({
                nodeType: "component",
                key: `component-${component.id}`,
                id: component.id,
                name: `${component.part_number}${component.part_name ? ` — ${component.part_name}` : ""}`,
                secondary: `Qty: ${component.quantity}`,
                raw: component,
                children: []
            }));

        const childItems = (itemsByLocation.get(locKey) ?? [])
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => ({
                nodeType: "genericItem",
                key: `genericItem-${item.id}`,
                id: item.id,
                name: item.name,
                secondary: `Qty: ${item.quantity} ${item.unit ?? ""}`.trim(),
                raw: item,
                children: []
            }));

        return {
            nodeType: "location",
            key: `location-${loc.id}`,
            id: loc.id,
            name: loc.name,
            secondary: null,
            raw: loc,
            children: [...childLocations, ...childComponents, ...childItems]
        };

    }

    return (locationsByParent.get(null) ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(buildLocationNode);

}

// "Cabinet A / Drawer A1" -- for disambiguating identically-named leaves
// in different branches, and for breadcrumbs.
export function getLocationPath(locations, id) {

    const byId = new Map(locations.map((loc) => [normId(loc.id), loc]));

    const parts = [];
    const seen = new Set();

    let current = byId.get(normId(id));

    while (current && !seen.has(normId(current.id))) {

        parts.unshift(current.name);
        seen.add(normId(current.id));

        current = current.parent_id ? byId.get(normId(current.parent_id)) : null;

    }

    return parts.join(" / ");

}
