var express = require('express');
var router = express.Router();
var Judgment = require('../controllers/acordao')

/**
 * GET all the judgments
 */
router.get('/acordaos', function(req, res) {
  if (Object.keys(req.query).length > 0) {
    Judgment.getAcordaos(req.query, {})
    .then(data => res.status(200).json(data))
    .catch(error => res.status(520).json({error: error, message: "Could not obtain the list of judgments"}))
  }  
  else{
    console.log('no querystring')
    Judgment.list()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(520).json({error: error, message: "Could not obtain the list of judgments"}))
  }
  
});

/**
 * GET acordão com certo ID
 */
router.get('/acordaos/:id', (req,res) => {
  Judgment.getAcordao(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(521).json({error: error, message: "Could not obtain the judgment"}))
})

/**
 * GET acordãos de um dado tribunal
 */
router.get('/acordaos/tribunais/:tribunal', (req, res) => {
  Judgment.getAcordaosDoTribunal(req.params.tribunal)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(521).json({error: error, message: "Could not obtain the judgment"}))
})

/**
 * POST a judgment
 */
router.post('/acordaos', (req,res) => {
  Judgment.addAcordao(req.body)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(522).json({error: error, message: "Could not insert the judgment"}))
})

/**
 * PUT a judgment
 */
router.put('/acordaos/:id', (req,res) => {
  Judgment.updateAcordao(req.body)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(523).json({error: error, message: "Could not update the judgment"}))
})

/**
 * DELETE a judgment
 */
router.delete('/acordaos/:id', (req,res) => {
  Judgment.deleteAcordao(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(524).json({error: error, message: "Could not delete the judgment"}))
})

module.exports = router;