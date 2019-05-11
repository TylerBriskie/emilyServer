const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/client');

const router = express.Router();

function verifyToken(req, res, next) {
    if (!req.headers.authorization){
        return res.status(401).send('Unauthorized Request - Authorization Missing');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === null){
        return res.status(401).send('Unauthorized Request - Token Missing');
    }
    let payload = jwt.verify(token, 'jonFishman');
    if (!payload){
        return res.status(401).send("Unauthorized Request - Bad Token");
    }
    req.userId = payload.subject;
    next();
}

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
                console.log(registeredClient);
                if (error){
                    res.status(409).send("Client with that email already exists");
                } else {
                    let payload = { subject: registeredClient._id };
                    console.log(payload);
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

router.get('/getLoggedIn', verifyToken, (req, res) => {
    console.log('finding client by poop pants: ', req.userId);
    let clientId = req.userId;
    Client.findById(clientId, (err, client)=> {
        if (err){
            res.status(401).send('Client Not Found');
        } else {
            // res.status(200).send(client);
        }
    }).then((document) => {
        // strip password
        const { password, ...clientData } = document._doc;
        res.status(200).send(clientData);
    });
});


module.exports = router;
