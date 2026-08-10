-- Adds hierarchical support to an EXISTING locations table
-- (e.g. Cabinet A -> Drawer A1/A2/A3).
--
-- Safe to run more than once -- every statement is guarded so re-running
-- this script is a no-op if it's already been applied.
--
-- Run this once against your real database:
--   psql -f migrate_location_hierarchy.sql

ALTER TABLE locations
    ADD COLUMN IF NOT EXISTS parent_id INTEGER;

-- Add the self-referencing foreign key separately, since
-- "ADD COLUMN ... REFERENCES" has no IF NOT EXISTS guard of its own.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_locations_parent'
          AND table_name = 'locations'
    ) THEN
        ALTER TABLE locations
            ADD CONSTRAINT fk_locations_parent
            FOREIGN KEY (parent_id)
            REFERENCES locations(id)
            ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations(parent_id);
