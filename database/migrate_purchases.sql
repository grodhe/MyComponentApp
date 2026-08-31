-- Purchasing: closes the gap between the Suppliers table (which already
-- has basic CRUD) and actually tracking what you paid, what the supplier
-- calls the part, and a history of purchases over time.
--
-- Two separate things, on purpose (see the app's earlier design call on
-- Inventory Transactions): this does NOT touch components.quantity or the
-- existing stock-transaction log. Logging a purchase here is pure
-- record-keeping -- you still use Add Stock separately when the parts
-- actually arrive and stock needs to go up. Idempotent -- safe to run
-- against a database that's already been migrated.

-- Current/default values shown directly on the component -- prefilled onto
-- new purchase records below, but editable per-purchase since price and
-- the supplier's own part number can both drift over time.
ALTER TABLE components ADD COLUMN IF NOT EXISTS supplier_part_number TEXT;
ALTER TABLE components ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(10, 2);

-- One row per purchase. component_id is required (this is purchase
-- history *for* a component); supplier_id is optional and independently
-- nullable from the component's own current supplier_id, since who you
-- bought a specific batch from can differ from your "usual" supplier.
CREATE TABLE IF NOT EXISTS purchases (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    component_id BIGINT NOT NULL,
    supplier_id BIGINT,

    supplier_part_number TEXT,

    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2),

    purchase_date DATE,
    order_reference TEXT,
    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_purchases_component
        FOREIGN KEY (component_id)
        REFERENCES components(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_purchases_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_purchases_quantity_positive
        CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_purchases_component ON purchases(component_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);
