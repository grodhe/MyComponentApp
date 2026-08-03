CREATE TABLE IF NOT EXISTS compo.component_suppliers
(

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    component_id BIGINT NOT NULL,

    supplier_id BIGINT NOT NULL,

    supplier_part_number VARCHAR(150),

    supplier_url TEXT,

    unit_price NUMERIC(12,4),

    currency CHAR(3),

    minimum_order_quantity INTEGER DEFAULT 1,

    order_multiple INTEGER DEFAULT 1,

    lead_time_days INTEGER,

    last_price_update DATE,

    preferred_supplier BOOLEAN DEFAULT FALSE,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_component_supplier_component
        FOREIGN KEY (component_id)
        REFERENCES compo.components(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_component_supplier_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES compo.suppliers(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_component_supplier
        UNIQUE
        (
            component_id,
            supplier_id,
            supplier_part_number
        )

);