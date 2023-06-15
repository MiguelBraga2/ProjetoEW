var express = require('express');
var router = express.Router();
var env = require('../config/env');
var axios = require('axios');
var jwt = require('jsonwebtoken');
require('dotenv').config();

var multer = require('multer')
var upload = multer({dest: 'uploads'})
var fs = require('fs')

function verificaToken(req, res, next){
  if(req.cookies && req.cookies.token){
    next()
  }
  else{
    res.redirect('/users/login')
  }
}

/*--GET's---------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * GET home page. 
 * Apresenta todos os tribunais com acordãos
 */
router.get('/' || '/tribunais', function(req, res){
  var query = ''
  if (req.query.limit) {
    if (query.length == 0) {
      query = '?limit=' + req.query.limit
    }
  }
  if (req.query.page) {
      if (query.length > 1) {
        query += '&page=' + req.query.page
      } 
      else {
        query += '?page=' + req.query.page
      }
  }

  axios.get(env.apiAccessPoint + '/acordaos/tribunais' + query)
    .then(response => {
      if (req.cookies && req.cookies.token) {
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
          if (err) {
            res.render('index', {tribunais: response.data});
          } else {
            res.render('index', {tribunais: response.data, user: payload });
          }
        });
      } else {
        res.render('index', {tribunais: response.data});
      }
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

/**
 * GET pesquisa da nav bar
 */
router.get('/pesquisa', verificaToken, (req, res)=>{
  var query = ''
  if (req.query.limit) {
    if (query.length == 0) {
      query = '?limit=' + req.query.limit
    }
  }
  if (req.query.page) {
      if (query.length > 1) {
        query += '&page=' + req.query.page
      } 
      else {
        query += '?page=' + req.query.page
      }
  }
  res.render('acordaos', {lacordaos: []});
})

/**
 * GET página de pesquisa aprofundada
 */
router.get('/pesquisas', verificaToken, (req, res)=>{
  var query = ''
  if (req.query.limit) {
    if (query.length == 0) {
      query = '?limit=' + req.query.limit
    }
  }
  if (req.query.page) {
      if (query.length > 1) {
        query += '&page=' + req.query.page
      } 
      else {
        query += '?page=' + req.query.page
      }
  }
  res.render('pesquisas', {lacordaos: []})
})

/**
 * GET página de um acordão 
 */
router.get('/acordaos/:id', verificaToken, (req, res) => {
  axios.get(env.apiAccessPoint + '/acordaos/' + req.params.id)
  .then(response => {
    console.log(Object.entries(response.data[0]))
    if (req.cookies && req.cookies.token) {
      jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
        if (err) {
          return res.render('processo', {processo: response.data[0]})
        } else {
          axios.put(env.authAcessPoint + '/' + payload.id + '/history', {process: req.params.id})
          .then(responseAuth => {
            res.render('processo', {processo: response.data[0], user: payload });
          })
          .catch(err => {
            res.render('error', {error: err, message: err.message});
          })
        }
      })
    }
  })
  .catch(err => {
    res.render('error', {error: err, message: err.message});
  })
})

/**
 * GET página com os acordãos de um tribunal 
 */
router.get('/tribunais/:tribunal', verificaToken, (req, res) => {
  var query = ''
  if (req.query.limit) {
    if (query.length == 0) {
      query = '?limit=' + req.query.limit
    }
  }
  if (req.query.page) {
      if (query.length > 1) {
        query += '&page=' + req.query.page
      } 
      else {
        query += '?page=' + req.query.page
      }
  }
  axios.get(env.apiAccessPoint + '/acordaos/tribunais/' + req.params.tribunal + query)
    .then(response => {
      jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
        if (err) {
          res.render('Error', {error : err, message : err.message})
        } else {
          console.log(response.data)
          res.render('acordaos', {lacordaos: response.data.results, user: payload, next: response.data.next, previous: response.data.previous, url: '/tribunais/' + req.params.tribunal});
        }
      });
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

/*--POST's---------------------------------------------------------------------------------------------------------------------------------------------- */

const fileProcessing = require('../fileProcessing/fileProcessing.js')

router.post('/files', upload.single('myFile'), (req, res) => {
  let oldPath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../fileProcessing/raw_files/' + req.file.originalname

  fs.rename(oldPath, newPath, erro => {
    if (erro){
      console.log(erro)
    }
  })
  axios.get(env.apiAccessPoint + '/currentId')
  .then(response => {
    fileProcessing.processFile(req.file.originalname, response.data._id)
  })
  .catch(err => {
    res.render('error', {error: err, message: err.message});
  })



  var data = new Date().toISOString().substring(0, 19)
  res.redirect('/')
})

module.exports = router;
