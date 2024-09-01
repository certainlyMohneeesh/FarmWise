const mongoose = require('mongoose');

// Correct connection string and options
mongoose.connect("mongodb://localhost:27017/SIH")
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((err) => {
        console.error("Database cannot be Connected:", err);
    });

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Collection part
const collection = mongoose.model("users", Loginschema);

module.exports = collection;
