-- ============================================================
-- Component Database
-- PostgreSQL 15+
-- ============================================================

BEGIN;

-- ============================================================
-- Categories
-- ============================================================

CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_id BIGINT NULL,
    description TEXT,

    CONSTRAINT fk_category_parent
        FOREIGN KEY (parent_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- ============================================================
-- Manufacturers
-- ============================================================

CREATE TABLE manufacturers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    website TEXT,
    notes TEXT
);

-- ============================================================
-- Storage Locations
-- ============================================================

CREATE TABLE locations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- ============================================================
-- Suppliers
-- ============================================================

CREATE TABLE suppliers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    website TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    notes TEXT
);

-- ============================================================
-- Components
-- ============================================================
CREATE TABLE components (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    part_number VARCHAR(150) NOT NULL,
    part_name VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    manufacturer_id BIGINT,
    category_id BIGINT,
    location_id BIGINT,

    manufacturer_part_number VARCHAR(150),
    supplier_part_number VARCHAR(150),

    package VARCHAR(50),
    footprint VARCHAR(100),
    component_value VARCHAR(100),

    quantity INTEGER NOT NULL DEFAULT 0,
    minimum_quantity INTEGER NOT NULL DEFAULT 0,

    datasheet_url TEXT,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_component_manufacturer
        FOREIGN KEY (manufacturer_id)
        REFERENCES manufacturers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_component_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_component_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE SET NULL

);

-- ============================================================
-- Component Suppliers (Many-to-Many)
-- ============================================================

CREATE TABLE component_suppliers (
    component_id BIGINT NOT NULL,
    supplier_id BIGINT NOT NULL,

    supplier_part_number VARCHAR(150),
    purchase_url TEXT,
    last_price NUMERIC(12,4),
    currency CHAR(3),

    PRIMARY KEY (component_id, supplier_id),

    CONSTRAINT fk_cs_component
        FOREIGN KEY (component_id)
        REFERENCES components(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cs_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE CASCADE
);

-- ============================================================
-- Attachments
-- ============================================================

CREATE TABLE attachments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    component_id BIGINT NOT NULL,

    filename VARCHAR(255) NOT NULL,
    filepath TEXT NOT NULL,

    filetype VARCHAR(50),

    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attachment_component
        FOREIGN KEY (component_id)
        REFERENCES components(id)
        ON DELETE CASCADE
);

-- ============================================================
-- Inventory History
-- ============================================================

CREATE TABLE stock_movements (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    component_id BIGINT NOT NULL,

    movement INTEGER NOT NULL,

    reason VARCHAR(100),

    comment TEXT,

    movement_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_component
        FOREIGN KEY (component_id)
        REFERENCES components(id)
        ON DELETE CASCADE
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_component_part_number
ON components(part_number);

CREATE INDEX idx_component_description
ON components(description);

CREATE INDEX idx_component_category
ON components(category_id);

CREATE INDEX idx_component_location
ON components(location_id);

CREATE INDEX idx_component_manufacturer
ON components(manufacturer_id);

CREATE INDEX idx_stock_component
ON stock_movements(component_id);

-- ============================================================
-- Sample Data
-- ============================================================

INSERT INTO categories(name)
VALUES
('Microcontrollers'),
('Power'),
('Logic'),
('Passive'),
('Connectors');

INSERT INTO locations(name)
VALUES
('Drawer A1'),
('Drawer A2'),
('Drawer B1'),
('Shelf 1');

INSERT INTO manufacturers(name, website)
VALUES
('Texas Instruments','https://www.ti.com'),
('Espressif','https://www.espressif.com'),
('Nexperia','https://www.nexperia.com');

COMMIT;


ALTER TABLE compo.components
ADD CONSTRAINT uq_components_part_number
UNIQUE (part_number);

ALTER TABLE compo.manufacturers
ADD CONSTRAINT uq_manufacturer_name UNIQUE (name);

ALTER TABLE compo.categories
ADD CONSTRAINT uq_category_name UNIQUE (name);

ALTER TABLE compo.locations
ADD CONSTRAINT uq_location_name UNIQUE (name);