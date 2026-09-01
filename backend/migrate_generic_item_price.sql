-- Generic items previously had no price field at all (Components got
-- purchase_price as part of the Suppliers/Purchasing work; this closes the
-- same gap for Generic Items so project cost rollups can include both).
-- Idempotent -- safe to run against a database that's already been
-- migrated.

ALTER TABLE generic_items ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(10, 2);
