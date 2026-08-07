const service = require("../services/projectStatusServices");

async function getAllProjectStatuses(req, res) {

    try {

        const statuses =
            await service.getAllProjectStatuses();

        res.json(statuses);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}

module.exports = {
    getAllProjectStatuses
};
