const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const atlas = require('./config/keys');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', require('./routes/index'));
app.use('/clients', require('./routes/clients'));
app.use('/login', require('./routes/login'));


const PORT = process.env.PORT || '1337';

app.listen(PORT, () => {
  mongoose.connect(atlas.URI, error => {
    if (error){
      console.error("error: " + error);
    }
    else {
      console.log('connected to db');
    }
  })
  // MongoClient.connect(atlas.URI, { useNewUrlParser: true }, (error, client) => {
  //   if (error){
  //     throw error;
  //   }
  //   database = client.db(atlas.DB_NAME);
  //   collection = database.collection("clients");
  //   console.log(`Connected to ${atlas.DB_NAME}!`)
  // });

});
