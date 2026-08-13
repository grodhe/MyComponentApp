-- Shopping list: components (or free-text items not in inventory) that
-- need to be bought. Idempotent -- safe to run against a database that
-- already has this table.
CREATE TABLE IF NOT EXISTS shopping_list_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    component_id BIGINT,

    -- Free-text label, used for items that aren't (yet) inventory
    -- components, e.g. "M3x10 screws" or "9V battery clips". Optional
    -- when component_id is set -- the component's own part number/name is
    -- used for display in that case.
    description TEXT,

    quantity_needed INTEGER NOT NULL DEFAULT 1,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_shopping_list_component
        FOREIGN KEY (component_id)
        REFERENCES components(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_shopping_list_has_label
        CHECK (component_id IS NOT NULL OR description IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_shopping_list_component ON shopping_list_items(component_id);
