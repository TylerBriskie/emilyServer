const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

           } else {
               bcrypt.compare(clientData.password, client.password, (error, login)=> {
                   if (login){
                       let payload = { subject: client._id};
                       let token = jwt.sign(payload, 'jonFishman');
                       res.status(200).send({token});
                   } else {
                       res.status(403).send('password incorrect');
                   }
               })
           }
       }
    });
});

router.get('/', (req, res) => res.send('Bad Request'));

module.exports = router;
