set search_path = "compo";

-- Components previously had no supplier link at all (only Manufacturer),
-- while Generic Items already had one -- this closes that gap so you can
-- note where you bought a component, same as you already can for generic
-- items. Idempotent -- safe to run against a database that's already
-- been migrated.

ALTER TABLE components ADD COLUMN IF NOT EXISTS supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_components_supplier ON components(supplier_id);
