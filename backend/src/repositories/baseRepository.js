// backend/src/repositories/baseRepository.js

const pool = require("../config/db");
const config = require("../config/app");

module.exports = {
    pool,
    schema: config.db.schema
};