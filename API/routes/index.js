var express = require('express');
var router = express.Router();
var Judgment = require('../controllers/acordao')
var Acordao = require('../models/acordao.js')

var Taxonomy = require('../search/taxonomy')



let taxonomyTree;
let fullTextObject;
let response

async function getTaxonomyTree() {
  try {
    [response, fullTextObject] = await Taxonomy.createDescriptorMap();
    taxonomyTree = await Taxonomy.createTaxonomyTree(response);
    console.log("Tree set up")

  } catch (error) {
    console.error('Error:', error);
  }
}

getTaxonomyTree();

var fullTextObjects = require('../search/full-text').fullTextObjects;

function convertStrLowerCaseMinusFristChar(str) {
  // Extrai o primeiro caractere em maiúscula
  const firstChar = str.charAt(0).toUpperCase();
  // Converte o restante da string para minúsculas
  const restOfString = str.substring(1).toLowerCase();
  // Retorna a string resultante com o primeiro caractere em minúscula
  return firstChar + restOfString;
}

/**
 * Function for getting the results for a simgle page. 
 */
function paginatedResults(model) {
  return async (req, res, next) => {
    const queries = []
    const match = {
      $match : {}
    }
    queries.push(match)

    if (req.query && req.query.ids){
      const processIds = req.query.ids.split(',').map(id => parseInt(id));
      queries.push({ $match: { _id: { $in: processIds } } });
    }

    if (req.query && req.query.tribunal) {
      match.$match['tribunal'] = req.query.tribunal
    }
  
    if (req.query && req.query.processo) {
      match.$match['Processo'] = { $regex : new RegExp('^' + req.query.processo, 'i') };
    }
    
    if (req.query && req.query.relator) {
      match.$match['Relator'] = { $regex : new RegExp('^' + req.query.relator, 'i') };
    }

    if (req.query && req.query.descritor) {
      //console.log("Descritor: " + req.query.descritor)
        const processosComDescritor = Taxonomy.getProcessos(req.query.descritor, taxonomyTree);
        queries.push({ $match: { _id: { $in: processosComDescritor } } });
      
    }

    if (req.query && req.query.producerId){
      match.$match['producerId'] = req.query.producerId
    }

    if (req.query && req.query.livre) {
      console.log(fullTextObject[req.query.livre])
      queries.push({ $match: { _id: { $in: fullTextObject[req.query.livre] } } });
    }
  
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    
    
    try {
      res.paginatedResults = results;

      const aggregation = model.aggregate(queries);
      var total = await model.aggregate([...queries, { $count: 'count' }]).exec();
      total = total.length > 0 ? total[0].count : 0
      results.results = await aggregation.skip(startIndex).limit(limit).exec();
      
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

      next();
    } catch (error) {
      res.status(500).json({error: error, message: error.message});
    }
  }
}

/**
 * GET all the judgments
 */
router.get('/acordaos', paginatedResults(Acordao), function(req, res) {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(res.paginatedResults);
});

/**
 * GET the judgments with a spcecific term in certain fields 
 */
router.get('/acordaos/search/full-text/:termo/params', (req,res) => {
  var termo = req.params.termo
  console.log(termo)
  var processos = []
  var finalObject = {}
  for(key in req.query){
    var field = req.query[key]
    //console.log(fullTextObjects[field][termo])

    for(key in fullTextObjects[field][termo]){
      if (key in finalObject){
        finalObject[key] += fullTextObjects[field][termo][key]
      }
      else{
        finalObject[key] = fullTextObjects[field][termo][key]
      }
    }
  }

  // Convert the object to an array of key-value pairs
  const entries = Object.entries(finalObject);

  // Sort the array based on the values
  entries.sort((a, b) => b[1] - a[1]);

  res.json(entries);
})


/**
 * GET all the courts
 */
router.get('/acordaos/tribunais', (req, res) => {
  Judgment.getTribunais()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(525).json({error: error, message: "Could not retreive the courts list"}))
})

/**
 * GET judgment given the ID
 */
router.get('/acordaos/:id', (req,res) => {
  Judgment.getAcordao(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(521).json({error: error, message: "Could not obtain the judgment"}))
})

router.get('/currentId', (req, res) => {
  Judgment.getCurrentId()
  .then(data => {
    res.status(200).json(data)
  })
  .catch(error => res.status(522).json({error: error, message: "Could not obtain the current id"}))
})

router.get('/postFile/:file_name', (req, res) => {
  Judgment.getCurrentId()
    .then(data => {
      Judgment.processFile(req.params.file_name, data._id)
        .then(data => {
          res.status(200).json(data);
        })
        .catch(error => {
          console.log(error);
          res.status(521).json({ error: error, message: "Could not post the file" });
        });
    })
    .catch(error => {
      console.log(error);
      res.status(521).json({ error: error, message: error });
    });
});

/**
 * POST a judgment
 */
router.post('/acordaos', (req,res) => {
  Judgment.addAcordao(req.body)
    .then(data => {
      res.status(201).json(data)
    })
    .catch(error => res.status(526).json({error: error, message: "Could not insert the judgment"}))
})

/**
 * PUT a judgment
 */
router.put('/acordaos/:id', (req,res) => {
  Judgment.updateAcordao(req.body, req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(527).json({error: error, message: "Could not update the judgment"}))
})

/**
 * DELETE a judgment
 */
router.delete('/acordaos/:id', (req,res) => {
  Judgment.deleteAcordao(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(528).json({error: error, message: "Could not delete the judgment"}))
})

module.exports = router;