SET search_path = compo;

BEGIN;

------------------------------------------------------------
-- Project Status
------------------------------------------------------------

INSERT INTO project_status
(
    name,
    description,
    display_order
)
VALUES
('Planning',   'Project planning',            1),
('Design',     'Design phase',                2),
('Prototype',  'Prototype build',             3),
('Testing',    'Testing and validation',      4),
('Production', 'Production ready',            5),
('Completed',  'Finished project',            6),
('Archived',   'Archived project',            7)
ON CONFLICT (name) DO NOTHING;

------------------------------------------------------------
-- Projects
------------------------------------------------------------

INSERT INTO projects
(
    project_number,
    project_name,
    description,
    status_id,
    version,
    github_url,
    documentation_url,
    image_url,
    notes
)
SELECT
    'PRJ-0001',
    'BeeScale',
    'Hive scale using ESP32-C6 and HX711',
    ps.id,
    'Rev A',
    'https://github.com/yourname/BeeScale',
    'https://wiki.example.com/beescale',
    'images/beescale.jpg',
    'Main beehive monitoring project'
FROM project_status ps
WHERE ps.name = 'Prototype'
ON CONFLICT DO NOTHING;


INSERT INTO projects
(
    project_number,
    project_name,
    description,
    status_id,
    version,
    github_url,
    notes
)
SELECT
    'PRJ-0002',
    'Matter Gateway',
    'ESP32-C6 Thread / Matter Gateway',
    ps.id,
    'Rev B',
    'https://github.com/yourname/MatterGateway',
    'Matter experiments'
FROM project_status ps
WHERE ps.name = 'Design'
ON CONFLICT DO NOTHING;


INSERT INTO projects
(
    project_number,
    project_name,
    description,
    status_id,
    version,
    github_url,
    notes
)
SELECT
    'PRJ-0003',
    'RFID Reader',
    'Multi-frequency RFID Reader',
    ps.id,
    'Rev A',
    'https://github.com/yourname/RFIDReader',
    '125kHz + 13.56MHz'
FROM project_status ps
WHERE ps.name = 'Testing'
ON CONFLICT DO NOTHING;

------------------------------------------------------------
-- Project Repositories
------------------------------------------------------------

INSERT INTO project_repositories
(
    project_id,
    repository_name,
    repository_type,
    repository_url
)
SELECT
    p.id,
    'BeeScale Firmware',
    'Firmware',
    'https://github.com/yourname/BeeScale'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;


INSERT INTO project_repositories
(
    project_id,
    repository_name,
    repository_type,
    repository_url
)
SELECT
    p.id,
    'BeeScale Backend',
    'Backend',
    'https://github.com/yourname/BeeScaleServer'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;


INSERT INTO project_repositories
(
    project_id,
    repository_name,
    repository_type,
    repository_url
)
SELECT
    p.id,
    'BeeScale PCB',
    'KiCad',
    'https://github.com/yourname/BeeScalePCB'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;

------------------------------------------------------------
-- Project Documents
------------------------------------------------------------

INSERT INTO project_documents
(
    project_id,
    document_name,
    document_type,
    file_name,
    notes
)
SELECT
    p.id,
    'BeeScale Schematic',
    'PDF',
    'BeeScale_Schematic.pdf',
    'Latest schematic'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;


INSERT INTO project_documents
(
    project_id,
    document_name,
    document_type,
    file_name,
    notes
)
SELECT
    p.id,
    'BeeScale PCB',
    'PDF',
    'BeeScale_PCB.pdf',
    'PCB Layout'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;

------------------------------------------------------------
-- Project Components (BOM)
------------------------------------------------------------

INSERT INTO project_components
(
    project_id,
    component_id,
    quantity,
    reference_designators
)
SELECT
    p.id,
    c.id,
    1,
    'U1'
FROM projects p
JOIN components c
    ON c.part_number = 'ESP32-C6'
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;


INSERT INTO project_components
(
    project_id,
    component_id,
    quantity,
    reference_designators
)
SELECT
    p.id,
    c.id,
    1,
    'U2'
FROM projects p
JOIN components c
    ON c.part_number = 'HX711'
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;


INSERT INTO project_components
(
    project_id,
    component_id,
    quantity,
    reference_designators
)
SELECT
    p.id,
    c.id,
    1,
    'U3'
FROM projects p
JOIN components c
    ON c.part_number = 'BME280'
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;

------------------------------------------------------------
-- Project Tasks
------------------------------------------------------------

INSERT INTO project_tasks
(
    project_id,
    title,
    status,
    priority,
    notes
)
SELECT
    p.id,
    'Complete PCB',
    'Completed',
    'High',
    'Rev A finished'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;


INSERT INTO project_tasks
(
    project_id,
    title,
    status,
    priority
)
SELECT
    p.id,
    'Assemble prototype',
    'Open',
    'High'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;


INSERT INTO project_tasks
(
    project_id,
    title,
    status,
    priority
)
SELECT
    p.id,
    'Field test',
    'Open',
    'Medium'
FROM projects p
WHERE p.project_number = 'PRJ-0001'
ON CONFLICT DO NOTHING;

COMMIT;