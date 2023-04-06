var express = require('express');
var router = express.Router();
var Judgment = require('../controllers/judgment')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * GET all the judgments
 */
router.get('/judgments', function(req, res) {
  Judgment.list()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(520).json({error: error, message: "Could not obtain the list of judgments"}))
});

/**
 * GET one judgment
 */
router.get('/judgments/:id', (req,res) => {
  Judgment.getJudgment(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(521).json({error: error, message: "Could not obtain the judgment"}))
})

/**
 * POST a judgment
 */
router.post('/judgments', (req,res) => {
  Judgment.addJudgment(req.body)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(522).json({error: error, message: "Could not insert the judgment"}))
})

/**
 * PUT a judgment
 */
router.put('/judgments/:id', (req,res) => {
  Judgment.updateJudgment(req.body)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(523).json({error: error, message: "Could not update the judgment"}))
})

/**
 * DELETE a judgment
 */
router.delete('/judgments/:id', (req,res) => {
  Judgment.deleteJudgment(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(524).json({error: error, message: "Could not delete the judgment"}))
})

module.exports = router;
