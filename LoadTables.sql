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
('Microcontrollers', 'MCUs'),
('Power', 'Power Supplies'),
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
('Shelf 1', 'Modules')
ON CONFLICT (name) DO NOTHING;

------------------------------------------------------------
-- Components
------------------------------------------------------------

INSERT INTO compo.components
(
    part_number,
    description,
    manufacturer_id,
    category_id,
    location_id,
    package,
    quantity,
    minimum_quantity,
    datasheet_url,
    notes
)
SELECT
    'ESP32-C6-WROOM-1',
    'WiFi 6 / BLE / Thread Module',
    m.id,
    c.id,
    l.id,
    'MODULE',
    18,
    5,
    'https://www.espressif.com',
    'Matter Gateway'
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='Espressif'
  AND c.name='Microcontrollers'
  AND l.name='Drawer A1'
ON CONFLICT DO NOTHING;

INSERT INTO compo.components
(
    part_number,
    description,
    manufacturer_id,
    category_id,
    location_id,
    package,
    quantity,
    minimum_quantity,
    datasheet_url,
    notes
)
SELECT
    'LM2596S',
    'Buck Regulator',
    m.id,
    c.id,
    l.id,
    'TO-263',
    42,
    10,
    'https://www.ti.com',
    'Switching Regulator'
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='Texas Instruments'
  AND c.name='Power'
  AND l.name='Drawer A2'
ON CONFLICT DO NOTHING;

INSERT INTO compo.components
(
    part_number,
    description,
    manufacturer_id,
    category_id,
    location_id,
    package,
    quantity,
    minimum_quantity
)
SELECT
    '74HC595',
    'Shift Register',
    m.id,
    c.id,
    l.id,
    'SOIC-16',
    120,
    20
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='Nexperia'
  AND c.name='Logic'
  AND l.name='Drawer B1'
ON CONFLICT DO NOTHING;

INSERT INTO compo.components
(
    part_number,
    description,
    manufacturer_id,
    category_id,
    location_id,
    package,
    quantity,
    minimum_quantity,
    notes
)
SELECT
    'HX711',
    '24-bit Load Cell ADC',
    m.id,
    c.id,
    l.id,
    'SOP-16',
    25,
    5,
    'BeeScale Project'
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='STMicroelectronics'
  AND c.name='Sensors'
  AND l.name='Drawer C1'
ON CONFLICT DO NOTHING;

INSERT INTO compo.components
(
    part_number,
    description,
    manufacturer_id,
    category_id,
    location_id,
    package,
    quantity,
    minimum_quantity
)
SELECT
    'BME280',
    'Temperature/Humidity/Pressure Sensor',
    m.id,
    c.id,
    l.id,
    'LGA',
    14,
    3
FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l
WHERE m.name='Analog Devices'
  AND c.name='Sensors'
  AND l.name='Drawer C1'
ON CONFLICT DO NOTHING;

COMMIT;