const express = require('express');
const mongoose = require('mongoose');
const Client = require('../models/client');

const router = express.Router();

router.post('/', (req, res) => {
    let clientData = req.body;
    Client.findOne({email: clientData.email}, (err, client)=> {
       if (err){
           console.log('error: ', err);
       } else {
           if (!client) {
               res.status(401).send('Invalid Email');
           } else if(client.password !== clientData.password) {
               res.status(401).send('invalid password');
           } else {
               res.status(200).send(client);
           }

       }
    });
});

router.get('/', (req, res) => res.send('Bad Request'));

module.exports = router;
