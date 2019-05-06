const express = require('express');
const bcrypt = require('bcrypt');
const Client = require('../models/client');

const router = express.Router();

router.post('/', (req, res) => {
    let clientData = req.body;
    Client.findOne({email: clientData.email}, (err, client)=> {
       if (err){
           console.log('error: ', err);
       } else {
           if (!client) {
               res.status(400).send('Invalid Email');

           } else {
               bcrypt.compare(clientData.password, client.password, (error, login)=> {
                   if (login){
                       console.log('login success', login);
                       res.status(200).send(client);
                   } else {
                       res.status(403).send('password incorrect');
                   }
               })
           }

           // else if(client.password !== clientData.password) {
           //     res.status(401).send('invalid password');
           // } else {
           //     res.status(200).send(client);
           // }

       }
    });
});

router.get('/', (req, res) => res.send('Bad Request'));

module.exports = router;
