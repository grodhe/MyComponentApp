require("dotenv").config();

module.exports = {

    port: Number(process.env.PORT || 3001),

    db: {

        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        schema: process.env.DB_SCHEMA || "public"

    }

};