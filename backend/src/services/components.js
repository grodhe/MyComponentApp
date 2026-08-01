const repository = require("../repositories/components");

async function getAllComponents() {

    return await repository.getAll();

}

module.exports = {
    getAllComponents
};