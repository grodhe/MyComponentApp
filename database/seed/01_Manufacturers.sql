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