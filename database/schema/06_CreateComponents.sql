CREATE TABLE IF NOT EXISTS compo.components
(

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    part_number VARCHAR(150) NOT NULL,

    part_name VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    manufacturer_id BIGINT,

    category_id BIGINT,

    location_id BIGINT,

    manufacturer_part_number VARCHAR(150),

    package VARCHAR(50),

    footprint VARCHAR(100),

    component_value VARCHAR(100),

    quantity INTEGER NOT NULL DEFAULT 0,

    minimum_quantity INTEGER NOT NULL DEFAULT 0,

    datasheet_url TEXT,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_component_manufacturer
        FOREIGN KEY (manufacturer_id)
        REFERENCES compo.manufacturers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_component_category
        FOREIGN KEY (category_id)
        REFERENCES compo.categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_component_location
        FOREIGN KEY (location_id)
        REFERENCES compo.locations(id)
        ON DELETE SET NULL

);