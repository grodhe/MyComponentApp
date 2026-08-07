const repository = require("../repositories/projectStatusRepository");

async function getAllProjectStatuses() {

    return await repository.getAll();

}

module.exports = {
    getAllProjectStatuses
};
