const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const router = express.Router();
const Client = require('../models/client');

router.post('/', (req, res) => {
    if (!req.body.email){
        res.status(422).send("Cannot create customer without email");
    }
    if (!req.body.password){
        res.status(422).send("Cannot create customer without password");
    }
    let clientData = req.body;
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if (err){
            console.log('error hashing password: ', err)
            res.status(400).send("An Error occured creating this Client");
        }else {
            console.log('hashing password - hashed:', hash);
            clientData.password = hash;
            let client = new Client(clientData);
            client.save((error, registeredClient) => {
                if (error){
                    res.status(409).send("Client with that email already exists");
                } else {
                    let payload = { subject: registeredClient._id };
                    let token = jwt.sign(payload, 'jonFishman');
                    res.status(200).send({token});
                }
            });
        }
    });
});

router.get('/', (req, res) => {
    res.status(200).send('hi');

});

router.get('/:id', (req, res) => {
    console.log('finding client by poop pants: ', req.params.id);
    let clientId = req.params.id;
    Client.findById(clientId, (err, client)=> {
        if (err){
            console.log('error: ', err);
            res.status(401).send('Client Not Found');
        } else {
            res.status(200).send(client);
        }
    });
});


module.exports = router;
