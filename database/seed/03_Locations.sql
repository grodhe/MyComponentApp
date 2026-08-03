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