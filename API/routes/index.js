var express = require('express');
var router = express.Router();
var Judgment = require('../controllers/acordao')


// Pagination 

function paginatedResults(model, queries) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    const results = {};
    
    if (endIndex < total) {
        results.next = { 
          page: page + 1,
          limit: limit
        }      
    }

    if (startIndex > 0) {
        results.previous = { 
          page: page - 1,
          limit: limit
        }
    }

    try {
      results.results = await model.find(queries).skip(startIndex).limit(limit).exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({error: error, message: error.message});
    }
  }
}

/**
 * GET all the judgments
 */
router.get('/acordaos', paginatedResults(Judgment, {}), function(req, res) {  
  res.json(res.paginatedResults);
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
router.get('/acordaos/tribunais/:tribunal', paginatedResults(Judgment, { tribunal : req.params.tribunal}), (req, res) => {
  res.json(res.paginatedResults);
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