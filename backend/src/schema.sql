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

-- Below: your actual project tables, as provided (ProjectTables.sql). Only
-- `projects` and `project_status` are wired up in the app so far -- the
-- BOM (project_components), project_documents, project_repositories and
-- project_tasks tables are here for reference and ready for a future pass.

CREATE TABLE IF NOT EXISTS project_status
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(50) UNIQUE NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects
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

CREATE TABLE IF NOT EXISTS project_components
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
        REFERENCES components(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_project_component
        UNIQUE(project_id, component_id)
);

CREATE TABLE IF NOT EXISTS project_documents
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
        ON DELETE CASCADE,

    CONSTRAINT uq_project_document
        UNIQUE(project_id, document_name)
);

CREATE TABLE IF NOT EXISTS project_repositories
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
        ON DELETE CASCADE,

    CONSTRAINT uq_project_repository
        UNIQUE(project_id, repository_name)
);

CREATE TABLE IF NOT EXISTS project_tasks
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
        ON DELETE CASCADE,

    CONSTRAINT uq_project_task
        UNIQUE(project_id, title)
);
