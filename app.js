// app.js
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
app.use(express.json());

mongoose.connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connected to ${process.env.NODE_ENV} database`);
}).catch(err => {
    console.error(`Error connecting to ${process.env.NODE_ENV} database:`, err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', userSchema);

// Read
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
