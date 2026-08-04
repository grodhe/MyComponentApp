const repository = require("../repositories/locationsRepository");

async function getAllLocations() {

    return await repository.getAll();

}

module.exports = {
    getAllLocations
};