const repository = require("../repositories/componentsRepository");

async function getAllComponents() {

    return await repository.getAll();

}

module.exports = {
    getAllComponents
};