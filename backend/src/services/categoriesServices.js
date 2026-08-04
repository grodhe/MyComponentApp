const repository = require("../repositories/categoriesRepository");

async function getAllCategories() {

    return await repository.getAll();

}

module.exports = {
    getAllCategories
};