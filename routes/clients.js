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

// Update Personal Info
router.post('/:id/updatePersonalInfo', verifyToken, (req, res) => {
   console.log('UPDATING CLIENT INFO: ', req.body);

   Client.findByIdAndUpdate(req.userId, req.body, (err, client) => {
       if (err) {
           console.log('error updating personal info: ', err);
           res.status(401).send(err)
       }}).then((document) => {
            res.status(200).send(document);

   })
});
// Update Email
router.post('/:id/updateEmail', verifyToken, (req, res)=> {
    Client.findOne({_id:req.params.id}, (err, foundClient) =>{
        if (err){
            console.log('error: ', err);
            res.status(401).send('Invalid User');
        } else {
            if (!foundClient){
                res.status(401).send('Client not found');
            } else {
                let client = new Client(foundClient);
                Client.findOne({email:req.body.newEmail}, (err, newEmail) => {
                    if (err){
                        res.status(401).send('Client not found??');
                    } else {
                        if (newEmail){
                            console.log("Duplicate Email Found.  Cancelling", newEmail);
                            res.status(403).send('Duplicate Email Found In System')
                        } else {
                            client.email = req.body.newEmail
                            client.save((error, updatedClient)=>{
                                res.status(200).send(updatedClient);
                            })
                        }
                    }
                })
            }
        }
    })
});

// Update Password
router.post('/:id/updatePassword', verifyToken, (req, res)=>{
    Client.findOne({_id: req.params.id}, (err, client)=>{
        if (err){
            console.log('error: ', err);
        } else {
            if (!client){
                res.status(401).send('Client not found');
            } else {
                bcrypt.compare(req.body.currentPassword, client.password, (error, changePW)=> {
                    if (changePW){
                        bcrypt.hash(req.body.newPassword, 10, (err, hash)=>{
                            console.log('new password hashed: ', hash);
                            if (err){
                                console.log('error hashing password: ', err);
                                res.status(400).send("An Error occured updating the password. Password was not changed.");
                            } else {
                                let updateObject = {
                                    'password': hash,
                                };
                                Client.findByIdAndUpdate(req.params.id, updateObject, (err, client) => {
                                    if (err) {
                                        console.log('error updating personal info: ', err);
                                    }
                                }).then((document) => {
                                    console.log('updated document');
                                    res.status(200).send(document);
                                })
                            }
                        });
                    } else {
                        console.log('incorrect password');
                        res.status(403).send('password incorrect');
                    }
                })
            }
        }
    });

})


module.exports = router;
