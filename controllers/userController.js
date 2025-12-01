const { getCollections } = require("../config/database")

const createUser = async (req, res) => {
    const { usersCollection } = getCollections();
    try {

    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = {createUser}