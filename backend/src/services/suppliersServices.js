const repository = require("../repositories/suppliersRepository");

async function getAllSuppliers() {

    return await repository.getAll();

}

module.exports = {
    getAllSuppliers
};