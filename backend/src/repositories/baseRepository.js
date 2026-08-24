// backend/src/repositories/baseRepository.js

const pool = require("../config/db");
const config = require("../config/app");

const schema = config.db.schema;

// A location's own name alone can be ambiguous -- e.g. "Drawer 3" might
// exist under several different cabinets. This recursive CTE walks each
// location up through its parent_id chain and builds a full breadcrumb
// path ("Cabinet A / Drawer 3"), so anywhere a location name is joined in
// for display (components, generic items, ...) it's unambiguous. Locations
// with no parent just get their own name as the path.
//
// Shared across repositories rather than duplicated inline -- every
// caller just needs `WITH RECURSIVE location_path AS (...)` prepended to
// their query, then to JOIN location_path instead of the raw locations
// table and select its `path` column.
function locationPathCte() {

    return `
        WITH RECURSIVE location_path AS (

            SELECT
                id,
                parent_id,
                name::text AS path
            FROM ${schema}.locations
            WHERE parent_id IS NULL

            UNION ALL

            SELECT
                child.id,
                child.parent_id,
                parent.path || ' / ' || child.name
            FROM ${schema}.locations child
            JOIN location_path parent
                ON parent.id = child.parent_id

        )
    `;

}

module.exports = {
    pool,
    schema,
    locationPathCte
};