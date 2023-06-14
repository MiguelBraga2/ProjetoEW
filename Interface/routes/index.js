var express = require('express');
var router = express.Router();
var env = require('../config/env');
var axios = require('axios');
var jwt = require('jsonwebtoken');
require('dotenv').config();

function verificaToken(req, res, next){
  if(req.cookies && req.cookies.token){
    next()
  }
  else{
    res.redirect('/login')
  }
}

/*--GET's---------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * GET home page. 
 * Apresenta todos os tribunais com acordãos
 */
router.get('/' || '/tribunais', function(req, res){
  axios.get(env.apiAccessPoint + '/acordaos/tribunais')
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
  res.render('acordaos', {lacordaos: []});
})

/**
 * GET página de pesquisa aprofundada
 */
router.get('/pesquisas', verificaToken, (req, res)=>{
   res.render('pesquisas', {lacordaos: []})
})

/**
 * GET página de um acordão 
 */
router.get('/acordaos/:id', verificaToken, (req, res) => {
  axios.get(env.apiAccessPoint + '/acordaos/' + req.params.id)
  .then(response => {
    jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
      if (err) {
        res.render('processo', {processo: response.data[0]});
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
  })
  .catch(err => {
    res.render('error', {error: err, message: err.message});
  })
})

/**
 * GET página com os acordãos de um tribunal 
 */
router.get('/tribunais/:tribunal', verificaToken, (req, res) => {
  axios.get(env.apiAccessPoint + '/acordaos/tribunais/' + req.params.tribunal)
  .then(response => {
    res.render('acordaos', {lacordaos: response.data.results})
  })
  .catch(err => {
    res.render('error', {error: err, message: err.message});
  })
})



module.exports = router;
