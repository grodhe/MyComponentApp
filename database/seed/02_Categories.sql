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