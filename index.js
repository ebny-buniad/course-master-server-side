const express = require('express')
require('dotenv').config()
const app = express()
const port = 3000 || process.env.port
const cors = require('cors')
const { connectDB } = require('./config/database')
app.use(cors())
app.use(express.json());

const userRoutes = require('./routes/userRoutes');

app.get('/', (req, res) => {
    res.send('Course master is runnning');
})

connectDB();

app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Course master running on port ${port}`)
})
