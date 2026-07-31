BEGIN;

--------------------------------------------------------
-- Categories
--------------------------------------------------------

INSERT INTO compo.categories (name, description)
VALUES
('Microcontrollers', 'MCUs and SoCs'),
('Power', 'Power supplies and regulators'),
('Logic', 'Logic ICs'),
('Sensors', 'Sensors and measurement'),
('Passive', 'Resistors, capacitors and inductors');

--------------------------------------------------------
-- Manufacturers
--------------------------------------------------------

INSERT INTO compo.manufacturers (name, website)
VALUES
('Espressif', 'https://www.espressif.com'),
('Texas Instruments', 'https://www.ti.com'),
('Nexperia', 'https://www.nexperia.com'),
('STMicroelectronics', 'https://www.st.com'),
('Analog Devices', 'https://www.analog.com');

--------------------------------------------------------
-- Locations
--------------------------------------------------------

INSERT INTO compo.locations (name, description)
VALUES
('Drawer A1', 'Microcontrollers'),
('Drawer A2', 'Power Supplies'),
('Drawer B1', 'Logic'),
('Drawer C1', 'Sensors'),
('Shelf 1', 'Large modules');

--------------------------------------------------------
-- Components
--------------------------------------------------------

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
VALUES
(
    'ESP32-C6-WROOM-1',
    'WiFi 6 / BLE / Thread Module',
    1,
    1,
    1,
    'Module',
    18,
    5,
    'https://www.espressif.com',
    'Used for Matter projects'
),
(
    'LM2596S',
    'Buck Regulator 3A',
    2,
    2,
    2,
    'TO-263',
    42,
    10,
    'https://www.ti.com',
    'Very common'
),
(
    '74HC595',
    'Shift Register',
    3,
    3,
    3,
    'SOIC-16',
    120,
    20,
    '',
    ''
),
(
    'HX711',
    '24-bit Load Cell ADC',
    4,
    4,
    4,
    'SOP-16',
    25,
    5,
    '',
    'BeeScale project'
),
(
    'BME280',
    'Temperature/Humidity/Pressure Sensor',
    5,
    4,
    4,
    'LGA',
    14,
    3,
    '',
    ''
);

COMMIT;