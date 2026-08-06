set search_path = "compo";
BEGIN;

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
        REFERENCES components(id)
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

COMMIT;