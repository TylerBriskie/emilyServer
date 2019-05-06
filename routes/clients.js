const express = require('express');
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
    let client = new Client(clientData);
    client.save((error, client) => {
       if (error){
           console.log(error);
       } else {
           res.status(200).send(client);
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
