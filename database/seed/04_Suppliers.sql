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