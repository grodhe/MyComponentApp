CREATE TABLE IF NOT EXISTS compo.suppliers
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    website TEXT,

    email VARCHAR(255),

    phone VARCHAR(50),

    contact_person VARCHAR(150),

    country VARCHAR(100),

    currency CHAR(3),

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);