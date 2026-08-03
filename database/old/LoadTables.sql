BEGIN;

------------------------------------------------------------
-- Manufacturers
------------------------------------------------------------

INSERT INTO compo.manufacturers (name, website)
VALUES
    ('Espressif', 'https://www.espressif.com'),
    ('Texas Instruments', 'https://www.ti.com'),
    ('Nexperia', 'https://www.nexperia.com'),
    ('STMicroelectronics', 'https://www.st.com'),
    ('Analog Devices', 'https://www.analog.com')
ON CONFLICT (name) DO NOTHING;

------------------------------------------------------------
-- Categories
------------------------------------------------------------

INSERT INTO compo.categories (name, description)
VALUES
    ('Microcontrollers', 'Microcontrollers and SoCs'),
    ('Power', 'Power Supplies and Regulators'),
    ('Logic', 'Logic ICs'),
    ('Sensors', 'Sensors'),
    ('Passive', 'Passive Components')
ON CONFLICT (name) DO NOTHING;

------------------------------------------------------------
-- Locations
------------------------------------------------------------

INSERT INTO compo.locations (name, description)
VALUES
    ('Drawer A1', 'Microcontrollers'),
    ('Drawer A2', 'Power'),
    ('Drawer B1', 'Logic'),
    ('Drawer C1', 'Sensors'),
    ('Shelf 1', 'Development Boards')
ON CONFLICT (name) DO NOTHING;

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
    notes
)
VALUES
(
    'Mouser',
    'https://www.mouser.com',
    'sales@mouser.com',
    NULL,
    NULL,
    'USA',
    'Primary distributor'
),
(
    'DigiKey',
    'https://www.digikey.com',
    'sales@digikey.com',
    NULL,
    NULL,
    'USA',
    'Fast delivery'
),
(
    'LCSC',
    'https://www.lcsc.com',
    NULL,
    NULL,
    NULL,
    'China',
    'Low-cost supplier'
),
(
    'Electrokit',
    'https://www.electrokit.com',
    NULL,
    NULL,
    NULL,
    'Sweden',
    'Local supplier'
),
(
    'AliExpress',
    'https://www.aliexpress.com',
    NULL,
    NULL,
    NULL,
    'China',
    'Marketplace'
)
ON CONFLICT (name) DO NOTHING;

------------------------------------------------------------
-- Components
------------------------------------------------------------

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
    supplier_part_number,
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
WHERE m.name='Espressif'
  AND c.name='Microcontrollers'
  AND l.name='Drawer A1';

------------------------------------------------------------
-- LM2596
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
    supplier_part_number,
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
    'LM2596SX-5.0/NOPB',
    'TO-263',
    'TO-263-5',
    '5V',
    42,
    10,
    'https://www.ti.com',
    'Switching regulator'
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='Texas Instruments'
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
    supplier_part_number,
    package,
    footprint,
    component_value,
    quantity,
    minimum_quantity,
    datasheet_url,
    notes
)
SELECT
    '74HC595',
    'Shift Register',
    '8-bit Serial-In / Parallel-Out Shift Register',
    m.id,
    c.id,
    l.id,
    '74HC595D',
    '74HC595D,653',
    'SOIC-16',
    'SOIC-16_3.9x9.9mm',
    NULL,
    120,
    20,
    NULL,
    NULL
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='Nexperia'
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
    supplier_part_number,
    package,
    footprint,
    component_value,
    quantity,
    minimum_quantity,
    datasheet_url,
    notes
)
SELECT
    'HX711',
    'Load Cell ADC',
    '24-bit Load Cell ADC',
    m.id,
    c.id,
    l.id,
    'HX711',
    'HX711',
    'SOP-16',
    'SOIC-16_3.9x9.9mm',
    '24-bit',
    25,
    5,
    NULL,
    'BeeScale Project'
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='STMicroelectronics'
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
    supplier_part_number,
    package,
    footprint,
    component_value,
    quantity,
    minimum_quantity,
    datasheet_url,
    notes
)
SELECT
    'BME280',
    'Environmental Sensor',
    'Temperature / Humidity / Pressure Sensor',
    m.id,
    c.id,
    l.id,
    'BME280',
    'BME280',
    'LGA-8',
    'LGA-8',
    NULL,
    14,
    3,
    'https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/',
    NULL
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='Analog Devices'
  AND c.name='Sensors'
  AND l.name='Drawer C1';

COMMIT;