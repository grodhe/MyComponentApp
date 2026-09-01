-- Complete schema rebuilt
SET search_path = compo;


-- ===== schema/01_CreateSchema.sql =====
CREATE SCHEMA IF NOT EXISTS compo;

-- ===== schema/02_CreateManufacturers.sql =====
CREATE TABLE IF NOT EXISTS compo.manufacturers
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    website TEXT,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== schema/03_CreateCategories.sql =====
CREATE TABLE IF NOT EXISTS compo.categories
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== schema/04_CreateLocations.sql =====
CREATE TABLE IF NOT EXISTS compo.locations
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== schema/05_CreateSuppliers.sql =====
CREATE TABLE IF NOT EXISTS compo.suppliers
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    website TEXT,

    email VARCHAR(255),

    phone VARCHAR(50),

    contact_person VARCHAR(150),

    country VARCHAR(100),

    currency CHAR(3),

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== schema/06_CreateComponents.sql =====
CREATE TABLE IF NOT EXISTS compo.components
(

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    part_number VARCHAR(150) NOT NULL,

    part_name VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    manufacturer_id BIGINT,

    category_id BIGINT,

    location_id BIGINT,

    manufacturer_part_number VARCHAR(150),

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
        REFERENCES compo.manufacturers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_component_category
        FOREIGN KEY (category_id)
        REFERENCES compo.categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_component_location
        FOREIGN KEY (location_id)
        REFERENCES compo.locations(id)
        ON DELETE SET NULL

);

-- ===== schema/07_CreateComponentSuppliers.sql =====
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

-- ===== schema/08_CreateIndexes.sql =====
------------------------------------------------------------
-- Manufacturers
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_manufacturers_name
ON compo.manufacturers(name);

------------------------------------------------------------
-- Categories
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_categories_name
ON compo.categories(name);

------------------------------------------------------------
-- Locations
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_locations_name
ON compo.locations(name);

------------------------------------------------------------
-- Suppliers
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_suppliers_name
ON compo.suppliers(name);

CREATE INDEX IF NOT EXISTS idx_suppliers_country
ON compo.suppliers(country);

------------------------------------------------------------
-- Components
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_components_part_number
ON compo.components(part_number);

CREATE INDEX IF NOT EXISTS idx_components_part_name
ON compo.components(part_name);

CREATE INDEX IF NOT EXISTS idx_components_manufacturer
ON compo.components(manufacturer_id);

CREATE INDEX IF NOT EXISTS idx_components_category
ON compo.components(category_id);

CREATE INDEX IF NOT EXISTS idx_components_location
ON compo.components(location_id);

CREATE INDEX IF NOT EXISTS idx_components_package
ON compo.components(package);

CREATE INDEX IF NOT EXISTS idx_components_value
ON compo.components(component_value);

------------------------------------------------------------
-- Component Suppliers
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_component_suppliers_component
ON compo.component_suppliers(component_id);

CREATE INDEX IF NOT EXISTS idx_component_suppliers_supplier
ON compo.component_suppliers(supplier_id);

CREATE INDEX IF NOT EXISTS idx_component_suppliers_preferred
ON compo.component_suppliers(preferred_supplier);

-- ===== ProjectTables.sql =====

CREATE TABLE project_status
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(50) UNIQUE NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 0
);


CREATE TABLE projects
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_number VARCHAR(50) UNIQUE NOT NULL,
    project_name   VARCHAR(150) NOT NULL,

    description TEXT,

    status_id BIGINT NOT NULL,

    version VARCHAR(30),

    start_date DATE,
    target_date DATE,
    completed_date DATE,

    github_url TEXT,
    documentation_url TEXT,
    image_url TEXT,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_status
        FOREIGN KEY(status_id)
        REFERENCES project_status(id)
);

CREATE TABLE project_components
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL,

    component_id BIGINT NOT NULL,

    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,

    reference_designators VARCHAR(255),

    notes TEXT,

    CONSTRAINT fk_pc_project
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pc_component
        FOREIGN KEY(component_id)
        REFERENCES compo.components(id)
        ON DELETE RESTRICT
);

CREATE TABLE project_documents
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL,

    document_name VARCHAR(150) NOT NULL,

    document_type VARCHAR(50),

    file_name VARCHAR(255),

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_document
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);

CREATE TABLE project_repositories
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL,

    repository_name VARCHAR(150) NOT NULL,

    repository_type VARCHAR(50),

    repository_url TEXT NOT NULL,

    notes TEXT,

    CONSTRAINT fk_project_repository
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);


CREATE TABLE project_tasks
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,

    status VARCHAR(30) DEFAULT 'Open',

    priority VARCHAR(20),

    due_date DATE,

    completed_date DATE,

    notes TEXT,

    CONSTRAINT fk_project_task
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);



ALTER TABLE compo.project_components
ADD CONSTRAINT uq_project_component
UNIQUE(project_id, component_id);

ALTER TABLE compo.project_repositories
ADD CONSTRAINT uq_project_repository
UNIQUE(project_id, repository_name);

ALTER TABLE compo.project_documents
ADD CONSTRAINT uq_project_document
UNIQUE(project_id, document_name);

ALTER TABLE compo.project_tasks
ADD CONSTRAINT uq_project_task
UNIQUE(project_id, title);

-- Generic parts catalog: anything a build needs that isn't a "component"
-- in the electronics sense -- enclosures, screws, cable, adhesive, etc.
-- Reuses the existing categories/locations/suppliers lookup tables so it
-- fits the same organizational model as components.
CREATE TABLE IF NOT EXISTS generic_items
(
    id                  SERIAL PRIMARY KEY,

    name                TEXT NOT NULL,
    description         TEXT,

    category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    location_id         INTEGER REFERENCES compo.locations(id) ON DELETE SET NULL,
    supplier_id         INTEGER REFERENCES compo.suppliers(id) ON DELETE SET NULL,

    part_number         TEXT,

    unit                TEXT NOT NULL DEFAULT 'pcs',

    quantity            INTEGER NOT NULL DEFAULT 0,
    minimum_quantity    INTEGER NOT NULL DEFAULT 0,

    reference_url       TEXT,
    notes               TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generic_items_category ON compo.generic_items(category_id);
CREATE INDEX IF NOT EXISTS idx_generic_items_location ON compo.generic_items(location_id);
CREATE INDEX IF NOT EXISTS idx_generic_items_supplier ON compo.generic_items(supplier_id);

-- Same shape as project_components, but for generic_items. Kept as a
-- separate table (rather than making project_components polymorphic) so
-- nothing about your existing project_components table has to change.
CREATE TABLE IF NOT EXISTS project_generic_items
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL,

    generic_item_id INTEGER NOT NULL,

    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,

    notes TEXT,

    CONSTRAINT fk_pgi_project
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pgi_generic_item
        FOREIGN KEY(generic_item_id)
        REFERENCES generic_items(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_project_generic_item
        UNIQUE(project_id, generic_item_id)
);


-- ===== migrate_component_supplier.sql =====

-- Components previously had no supplier link at all (only Manufacturer),
-- while Generic Items already had one -- this closes that gap so you can
-- note where you bought a component, same as you already can for generic
-- items. Idempotent -- safe to run against a database that's already
-- been migrated.

ALTER TABLE compo.components ADD COLUMN IF NOT EXISTS supplier_id INTEGER REFERENCES compo.suppliers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_components_supplier ON compo.components(supplier_id);

-- ===== migrate_barcode.sql =====
-- Adds a barcode column to components and generic_items, so a scanned
-- barcode (either printed on a part/packaging, or entered manually when
-- adding stock) can be looked up later. Idempotent -- safe to run against
-- a database that's already been migrated.
--
-- No uniqueness constraint on purpose: a blank/duplicate barcode
-- shouldn't ever be able to block saving a component or item, and the
-- lookup endpoint just takes the first match if there happen to be two.

ALTER TABLE compo.components ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE compo.generic_items ADD COLUMN IF NOT EXISTS barcode TEXT;

CREATE INDEX IF NOT EXISTS idx_components_barcode ON compo.components(barcode);
CREATE INDEX IF NOT EXISTS idx_generic_items_barcode ON compo.generic_items(barcode);

-- ===== migrate_location_hierarchy.sql =====
-- Adds hierarchical support to an EXISTING locations table
-- (e.g. Cabinet A -> Drawer A1/A2/A3).
--
-- Safe to run more than once -- every statement is guarded so re-running
-- this script is a no-op if it's already been applied.
--
-- Run this once against your real database:
--   psql -f migrate_location_hierarchy.sql

ALTER TABLE compo.locations
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
        ALTER TABLE compo.locations
            ADD CONSTRAINT fk_locations_parent
            FOREIGN KEY (parent_id)
            REFERENCES compo.locations(id)
            ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_locations_parent ON compo.locations(parent_id);

-- ===== migrate_inventory_transactions.sql =====
-- Idempotent migration for an existing database: adds the
-- inventory_transactions table used by the Inventory Transactions feature.
-- Safe to run more than once.
CREATE TABLE IF NOT EXISTS compo.inventory_transactions (
    id              SERIAL PRIMARY KEY,
    component_id    INTEGER NOT NULL REFERENCES compo.components(id) ON DELETE CASCADE,
    quantity_delta  INTEGER NOT NULL,
    reason          TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_component ON compo.inventory_transactions(component_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON compo.inventory_transactions(created_at);

-- ===== migrate_shopping_list.sql =====

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
        REFERENCES compo.components(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_shopping_list_has_label
        CHECK (component_id IS NOT NULL OR description IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_shopping_list_component ON shopping_list_items(component_id);


-- Complete schema rebuilt
SET search_path = compo;

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


-- Generic items previously had no price field at all (Components got
-- purchase_price as part of the Suppliers/Purchasing work; this closes the
-- same gap for Generic Items so project cost rollups can include both).
-- Idempotent -- safe to run against a database that's already been
-- migrated.

ALTER TABLE generic_items ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(10, 2);

CREATE INDEX IF NOT EXISTS idx_purchases_component ON purchases(component_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);


-- General-purpose app-wide settings, as plain key/value text pairs --
-- meant to hold small config values that shouldn't be hard-coded in the
-- frontend (starting with the currency label shown next to prices), and
-- to grow to hold future settings later without needing a new migration
-- each time. Idempotent -- safe to run against a database that's already
-- been migrated.

CREATE TABLE IF NOT EXISTS app_settings (
    key   TEXT PRIMARY KEY,
    value TEXT
);

INSERT INTO app_settings (key, value)
VALUES ('currency_symbol', 'kr')
ON CONFLICT (key) DO NOTHING;
