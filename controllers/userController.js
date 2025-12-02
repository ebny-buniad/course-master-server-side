const { getCollections } = require("../config/database")

const createUser = async (req, res) => {
    const { usersCollection } = getCollections();
    try {
        const userData = req.body;
        const existingUser = await usersCollection.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(409).send({ message: 'user already exist' });
        }
        const result = await usersCollection.insertOne(userData);
        res.status(201).send({
            success: true,
            message: 'User created successfully!',
            data: result,
        });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = { createUser }