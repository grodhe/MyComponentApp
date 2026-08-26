set search_path = "compo";

ALTER TABLE components ADD COLUMN IF NOT EXISTS supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_components_supplier ON components(supplier_id);
