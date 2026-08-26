BEGIN;
SET search_path=compo;

-- seed/01_Manufacturers.sql
------------------------------------------------------------
-- Manufacturers
------------------------------------------------------------

INSERT INTO compo.manufacturers
(
    name,
    website,
    notes
)
VALUES
(
    'Espressif',
    'https://www.espressif.com',
    'WiFi / Bluetooth / Thread'
),
(
    'Texas Instruments',
    'https://www.ti.com',
    'Analog and Power'
),
(
    'Nexperia',
    'https://www.nexperia.com',
    'Logic ICs'
),
(
    'STMicroelectronics',
    'https://www.st.com',
    'MCUs and Sensors'
),
(
    'Analog Devices',
    'https://www.analog.com',
    'Precision Analog'
),
(
    'Bosch Sensortec',
    'https://www.bosch-sensortec.com',
    'Environmental Sensors'
),
(
    'Microchip',
    'https://www.microchip.com',
    'Microcontrollers'
),
(
    'Infineon',
    'https://www.infineon.com',
    'Power Semiconductors'
)
ON CONFLICT (name) DO NOTHING;

-- seed/02_Categories.sql
------------------------------------------------------------
-- Categories
------------------------------------------------------------

INSERT INTO compo.categories
(
    name,
    description
)
VALUES
(
    'Microcontrollers',
    'MCUs and Wireless SoCs'
),
(
    'Power',
    'Power Supplies and Regulators'
),
(
    'Logic',
    'Logic ICs'
),
(
    'Sensors',
    'Environmental and Analog Sensors'
),
(
    'Passive',
    'Resistors, Capacitors and Inductors'
),
(
    'Connectors',
    'Headers and Connectors'
),
(
    'Displays',
    'LCD, OLED and TFT'
),
(
    'Modules',
    'Complete RF Modules'
)
ON CONFLICT (name) DO NOTHING;

-- seed/03_Locations.sql
------------------------------------------------------------
-- Locations
------------------------------------------------------------

INSERT INTO compo.locations
(
    name,
    description
)
VALUES
(
    'Drawer A1',
    'Microcontrollers'
),
(
    'Drawer A2',
    'Power'
),
(
    'Drawer A3',
    'Passives'
),
(
    'Drawer B1',
    'Logic'
),
(
    'Drawer B2',
    'Connectors'
),
(
    'Drawer C1',
    'Sensors'
),
(
    'Drawer C2',
    'Modules'
),
(
    'Shelf 1',
    'Development Boards'
),
(
    'Shelf 2',
    'Power Supplies'
),
(
    'Bin 1',
    'Miscellaneous'
)
ON CONFLICT (name) DO NOTHING;

-- seed/04_Suppliers.sql
------------------------------------------------------------
-- Suppliers
------------------------------------------------------------

INSERT INTO compo.suppliers
(
    name,
    website,
    email,
    phone,
    contact_person,
    country,
    currency,
    notes
)
VALUES

('Mouser',
'https://www.mouser.com',
'sales@mouser.com',
NULL,
NULL,
'USA',
'USD',
'Primary Distributor'),

('DigiKey',
'https://www.digikey.com',
'sales@digikey.com',
NULL,
NULL,
'USA',
'USD',
'Fast Delivery'),

('LCSC',
'https://www.lcsc.com',
NULL,
NULL,
NULL,
'China',
'USD',
'Low Cost'),

('Electrokit',
'https://www.electrokit.com',
NULL,
NULL,
NULL,
'Sweden',
'SEK',
'Swedish Distributor'),

('Farnell',
'https://www.farnell.com',
NULL,
NULL,
NULL,
'United Kingdom',
'EUR',
'European Distributor'),

('RS Components',
'https://www.rs-online.com',
NULL,
NULL,
NULL,
'Sweden',
'SEK',
'Industrial Supplier'),

('AliExpress',
'https://www.aliexpress.com',
NULL,
NULL,
NULL,
'China',
'USD',
'Marketplace')

ON CONFLICT (name) DO NOTHING;

-- seed/05_Components.sql
------------------------------------------------------------
-- ESP32-C6
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,
component_value,

quantity,
minimum_quantity,

datasheet_url,
notes
)

SELECT

'ESP32-C6',

'ESP32-C6 Module',

'WiFi 6 / BLE / Thread Module',

m.id,

c.id,

l.id,

'ESP32-C6-WROOM-1-N8',

'Module',

'ESP32-C6-WROOM',

NULL,

18,

5,

'https://www.espressif.com',

'Matter Gateway'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Espressif'
AND c.name='Microcontrollers'
AND l.name='Drawer A1';



------------------------------------------------------------
-- LM2596S
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,
component_value,

quantity,
minimum_quantity,

datasheet_url,
notes
)

SELECT

'LM2596S',

'Buck Converter',

'Buck Regulator',

m.id,

c.id,

l.id,

'LM2596SX-5.0',

'TO-263',

'TO-263-5',

'5V',

42,

10,

'https://www.ti.com',

'Power Supply'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Texas Instruments'
AND c.name='Power'
AND l.name='Drawer A2';



------------------------------------------------------------
-- 74HC595
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,

quantity,
minimum_quantity
)

SELECT

'74HC595',

'Shift Register',

'8-bit Shift Register',

m.id,

c.id,

l.id,

'74HC595D',

'SOIC-16',

'SOIC-16_3.9x9.9mm',

120,

20

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Nexperia'
AND c.name='Logic'
AND l.name='Drawer B1';



------------------------------------------------------------
-- HX711
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,
component_value,

quantity,
minimum_quantity,

notes
)

SELECT

'HX711',

'Load Cell ADC',

'24-bit ADC for Load Cells',

m.id,

c.id,

l.id,

'HX711',

'SOP-16',

'SOIC-16',

'24-bit',

25,

5,

'BeeScale'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='STMicroelectronics'
AND c.name='Sensors'
AND l.name='Drawer C1';



------------------------------------------------------------
-- BME280
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,

quantity,
minimum_quantity,

datasheet_url
)

SELECT

'BME280',

'Environmental Sensor',

'Temperature / Humidity / Pressure',

m.id,

c.id,

l.id,

'BME280',

'LGA-8',

'LGA-8',

14,

3,

'https://www.bosch-sensortec.com'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Bosch Sensortec'
AND c.name='Sensors'
AND l.name='Drawer C1';

-- seed/06_ComponentSuppliers.sql
------------------------------------------------------------
-- Component Suppliers
------------------------------------------------------------

INSERT INTO compo.component_suppliers
(
component_id,
supplier_id,
supplier_part_number,
supplier_url,
unit_price,
currency,
minimum_order_quantity,
order_multiple,
lead_time_days,
preferred_supplier
)

SELECT

c.id,
s.id,

'ESP32-C6-WROOM-1-N8',

'https://www.mouser.com',

4.85,

'USD',

1,

1,

14,

TRUE

FROM compo.components c,
     compo.suppliers s

WHERE

c.part_number='ESP32-C6'
AND s.name='Mouser';



INSERT INTO compo.component_suppliers
(
component_id,
supplier_id,
supplier_part_number,
supplier_url,
unit_price,
currency
)

SELECT

c.id,
s.id,

'C5295814',

'https://www.lcsc.com',

3.42,

'USD'

FROM compo.components c,
     compo.suppliers s

WHERE

c.part_number='ESP32-C6'
AND s.name='LCSC';



INSERT INTO compo.component_suppliers
(
component_id,
supplier_id,
supplier_part_number,
supplier_url,
unit_price,
currency,
preferred_supplier
)

SELECT

c.id,
s.id,

'74HC595D',

'https://www.mouser.com',

0.42,

'USD',

TRUE

FROM compo.components c,
     compo.suppliers s

WHERE

c.part_number='74HC595'
AND s.name='Mouser';

-- seed_generic_items.sql
SET search_path = compo;
-- Test data for generic_items and project_generic_items.
--
-- Safe to run more than once: each INSERT is guarded by a NOT EXISTS check,
-- so re-running this script won't create duplicates.
--
-- category_id/location_id/supplier_id are looked up by name against your
-- existing categories/locations/suppliers tables. If a name below doesn't
-- exist in your data, that column is just left NULL -- nothing fails.
-- Adjust the names in the subqueries if you want tighter matches.

-- 10 generic (non-component) items: enclosures, hardware, cable, etc.

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'ABS Enclosure 100x60x25mm', 'Black plastic project box, screw-together',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf B2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-1591XXBK', 'pcs', 14, 2, 'https://example.com/enclosure-100x60x25', 'Fits most single-PCB projects'
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'M3x8 Socket Head Screw', 'Stainless steel, for enclosure/PCB mounting',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-91292A115', 'pcs', 200, 50, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'M3x8 Socket Head Screw');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'M3 Brass Standoff 10mm', 'Male-female, PCB mounting',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-91780A123', 'pcs', 80, 20, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'M3 Brass Standoff 10mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Heat Shrink Tubing 3mm', 'Black, 1m sticks',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'DigiKey' LIMIT 1),
       'DK-HS3MM', 'm', 25, 5, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Heat Shrink Tubing 3mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Hookup Wire 22AWG Red', 'Stranded, 10m spool',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'DigiKey' LIMIT 1),
       'DK-WIRE22R', 'm', 40, 10, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Hookup Wire 22AWG Red');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Hookup Wire 22AWG Black', 'Stranded, 10m spool',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'DigiKey' LIMIT 1),
       'DK-WIRE22B', 'm', 40, 10, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Hookup Wire 22AWG Black');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'USB-C Panel Mount Cable 30cm', 'Male to female, for enclosure passthrough',
       (SELECT id FROM categories WHERE name = 'Cable' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf B3' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'Amazon' LIMIT 1),
       'AMZ-USBC-PM30', 'pcs', 6, 2, 'https://example.com/usbc-panel-mount', NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Cable Tie 100mm', 'Nylon, black, pack of 100',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-7130K12', 'pack', 4, 1, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Cable Tie 100mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Thermal Paste 1g', 'For heatsink/regulator mounting',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'Amazon' LIMIT 1),
       'AMZ-THERM-1G', 'pcs', 3, 1, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Thermal Paste 1g');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Adhesive Cable Clip', 'Self-adhesive, for internal wire routing',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-1919A11', 'pcs', 60, 10, NULL, 'Good for keeping wiring off PCB edges'
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Adhesive Cable Clip');

-- Link a few of the seeded items to your two earliest projects (by id), so
-- the "Parts" tab has something to show. If you have no projects yet, each
-- of these inserts just matches 0 rows -- nothing fails.

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm'),
       1, 'main enclosure'
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM generic_items WHERE name = 'M3x8 Socket Head Screw'),
       4, 'lid screws'
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'M3x8 Socket Head Screw') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'M3x8 Socket Head Screw')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM generic_items WHERE name = 'M3 Brass Standoff 10mm'),
       4, NULL
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'M3 Brass Standoff 10mm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'M3 Brass Standoff 10mm')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm'),
       1, 'front panel port'
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM generic_items WHERE name = 'Cable Tie 100mm'),
       1, NULL
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'Cable Tie 100mm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'Cable Tie 100mm')
  );


-- LoadAllProject.sql
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

COMMIT;
