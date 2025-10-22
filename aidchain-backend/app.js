const express = require('express');
const bodyParser = require('body-parser');
const { getConnection } = require("./db")


require('dotenv').config();
let dbConnection = null;
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const accessRoutes = require('./routes/accessRoutes');

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/files', fileRoutes);
app.use('/users', userRoutes);
app.use('/access', accessRoutes);

app.get('/', async (req, res) => {
    res.send('AidChain Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    const dbConnection = await getConnection()

});
