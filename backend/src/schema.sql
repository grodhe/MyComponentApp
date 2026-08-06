-- Best-guess schema, reverse-engineered from the columns your repositories
-- already query. Adjust types/constraints to match your real database if
-- one already exists -- this is only meant to get a fresh dev DB running.

CREATE TABLE IF NOT EXISTS manufacturers (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    website     TEXT,
    notes       TEXT
);

CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS locations (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS suppliers (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    website     TEXT,
    country     TEXT,
    currency    TEXT,
    notes       TEXT
);

CREATE TABLE IF NOT EXISTS components (
    id                          SERIAL PRIMARY KEY,
    part_number                 TEXT NOT NULL,
    part_name                   TEXT,
    description                 TEXT,
    manufacturer_part_number    TEXT,
    package                     TEXT,
    footprint                   TEXT,
    component_value             TEXT,
    quantity                    INTEGER NOT NULL DEFAULT 0,
    minimum_quantity            INTEGER NOT NULL DEFAULT 0,
    datasheet_url               TEXT,
    notes                       TEXT,
    manufacturer_id             INTEGER REFERENCES manufacturers(id) ON DELETE SET NULL,
    category_id                 INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    location_id                 INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_components_manufacturer ON components(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category_id);
CREATE INDEX IF NOT EXISTS idx_components_location ON components(location_id);
