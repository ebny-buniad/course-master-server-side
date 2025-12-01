const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpqzrtb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let database;

const connectDB = async () => {
    try {
        await client.connect();

        database = client.db('course_master');
        usersCollection = database.collection('users');
        





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}

const getCollections = () => {
    if (!usersCollection ) {
        throw new Error('userCollection not initialized. Call connectDB() first')
    }
    return {
        usersCollection
    };
}


module.exports = { connectDB, getCollections }
