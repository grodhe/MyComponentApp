-- Idempotent migration for an existing database: adds the
-- inventory_transactions table used by the Inventory Transactions feature.
-- Safe to run more than once.
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id              SERIAL PRIMARY KEY,
    component_id    INTEGER NOT NULL REFERENCES components(id) ON DELETE CASCADE,
    quantity_delta  INTEGER NOT NULL,
    reason          TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_component ON inventory_transactions(component_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at);
