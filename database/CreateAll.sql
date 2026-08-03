set search_path = pigges;
BEGIN;

\i schema/01_CreateSchema.sql
\i schema/02_CreateManufacturers.sql
\i schema/03_CreateCategories.sql
\i schema/04_CreateLocations.sql
\i schema/05_CreateSuppliers.sql
\i schema/06_CreateComponents.sql
\i schema/07_CreateComponentSuppliers.sql
\i schema/08_CreateIndexes.sql

COMMIT;