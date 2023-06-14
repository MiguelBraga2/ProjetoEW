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

/* GET home page. */
router.get('/', function(req, res){
  axios.get(env.apiAccessPoint + '/acordaos/tribunais')
    .then(response => {
      if (req.cookies && req.cookies.token) {
        jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
          if (err) {
            return res.render('index', {tribunais: response.data});
          } else {
            return res.render('index', {tribunais: response.data, user: payload });
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

// pesquisas

router.get('/pesquisa', (req, res)=>{

  axios.get(env.apiAccessPoint)
})

router.get('/pesquisas', (req, res)=>{
   res.render('pesquisas', {lacordaos: []})
})

router.get('/:id', (req, res) => {
  axios.get(env.apiAccessPoint + '/acordaos/' + req.params.id)
  .then(response => {
    if (req.cookies && req.cookies.token) {
      jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
        if (err) {
          return res.render('processo', {processo: response.data[0]})
        } else {
          axios.put(env.authAcessPoint + '/' + payload.id + '/history', {process: req.params.id})
          .then(responseAuth => {
            return res.render('processo', {processo: response.data[0], user: payload })
          })
          .catch(err => {
            res.render('error', {error: err, message: err.message});
          })
        }
      }); 
    } else {
      return res.render('processo', {processo: response.data[0]})
    }
  })
  .catch(err => {
    res.render('error', {error: err, message: err.message});
  })
})


router.get('/tribunais/:tribunal', (req, res) => {
  axios.get(env.apiAccessPoint + '/acordaos/tribunais/' + req.params.tribunal)
  .then(response => {
    res.render('acordaos', {lacordaos: response.data.results})
  })
  .catch(err => {
    res.render('error', {error: err, message: err.message});
  })
})



module.exports = router;
