const repository = require("../repositories/manufacturersRepository");

async function getAllManufacturers() {

    return await repository.getAll();

}

module.exports = {
    getAllManufacturers
};