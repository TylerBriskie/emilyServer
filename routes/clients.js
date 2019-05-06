const express = require('express');
const router = express.Router();
const Client = require('../models/client');

router.post('/', (req, res) => {
  // collection.insert(req.body, (error, result) => {
  //   if (error){
  //     console.log(error);
  //     return res.status(500).send(error);
  //   }
  //   res.send(result.result);
  // });
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
  // collection.find({}).toArray((error, result) => {
  //         if(error) {
  //             return res.status(500).send(error);
  //         }
  //         res.send(result);
  //     });
});

router.get('/:id', (req, res) => {
  // collection.findOne({"client_id": new ObjectId(req.params.client_id)}, (error, result) => {
  //         if(error) {
  //             return res.status(500).send(error);
  //         }
  //         res.send(result);
  //     });
});


module.exports = router;
