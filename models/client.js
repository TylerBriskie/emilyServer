const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    email: String,
    password: String
});

module.exports = mongoose.model('client', clientSchema, 'clients');