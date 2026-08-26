-- Adds a barcode column to components and generic_items, so a scanned
-- barcode (either printed on a part/packaging, or entered manually when
-- adding stock) can be looked up later. Idempotent -- safe to run against
-- a database that's already been migrated.
--
-- No uniqueness constraint on purpose: a blank/duplicate barcode
-- shouldn't ever be able to block saving a component or item, and the
-- lookup endpoint just takes the first match if there happen to be two.

ALTER TABLE components ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE generic_items ADD COLUMN IF NOT EXISTS barcode TEXT;

CREATE INDEX IF NOT EXISTS idx_components_barcode ON components(barcode);
CREATE INDEX IF NOT EXISTS idx_generic_items_barcode ON generic_items(barcode);
