// Shared helpers for the "resolve a name column to an id" step that every
// CSV import needs (manufacturer/category/status/supplier -- flat lookup
// tables that make sense to auto-create from a name that doesn't exist
// yet -- and location, which is nested/hierarchical so it's only ever
// matched, never created).

function normalizeKey(value) {

    return (value ?? "").toString().trim().toLowerCase();

}

// Builds a "lowercased name -> [matching rows]" map. Kept as arrays (not
// a single row) so duplicate names in the existing data show up as an
// ambiguous match instead of silently picking one.
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

// Returns an async resolve(name, rowNumber) function.
//
// - blank name -> null, no warning
// - exactly one existing match -> that row's id
// - more than one existing match (ambiguous) -> null + warning
// - no match:
//     - if createFn is given, creates a new row via createFn(trimmedName),
//       caches it (so the same new name later in the same file reuses it
//       instead of creating a duplicate), and returns its id + a warning
//       noting it was auto-created
//     - if createFn is omitted, leaves it null + a warning that it wasn't
//       found (used for locations, which are nested so a flat name can't
//       be safely auto-created)
function makeNameResolver({ nameMap, createFn, label, warnings }) {

    const createdCache = new Map();

    return async function resolve(name, rowNumber) {

        const key = normalizeKey(name);

        if (!key) {
            return null;
        }

        const matches = nameMap.get(key);

        if (matches && matches.length === 1) {
            return matches[0].id;
        }

        if (matches && matches.length > 1) {

            warnings.push({
                row: rowNumber,
                message: `${label} "${name.trim()}" matches ${matches.length} existing ` +
                    `${label.toLowerCase()} records -- left blank. Set it manually afterwards.`
            });

            return null;

        }

        if (!createFn) {

            warnings.push({
                row: rowNumber,
                message: `${label} "${name.trim()}" wasn't found -- left blank. ` +
                    "Set it manually afterwards."
            });

            return null;

        }

        if (createdCache.has(key)) {
            return createdCache.get(key);
        }

        const created = await createFn(name.trim());

        nameMap.set(key, [created]);
        createdCache.set(key, created.id);

        warnings.push({
            row: rowNumber,
            message: `${label} "${name.trim()}" didn't exist yet -- created it.`
        });

        return created.id;

    };

}

module.exports = {
    normalizeKey,
    buildNameMap,
    makeNameResolver
};
