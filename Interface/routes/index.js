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
            return res.render('index', {ltribunais: response.data});
          } else {
            return res.render('index', {ltribunais: response.data, user: payload });
          }
        });
      } else {
        res.render('index', {ltribunais: response.data});
      }
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

// Login
router.get('/login', (req, res)=>{
  res.render('loginForm')
})

router.get('/facebook', (req, res)=>{
  res.redirect(env.authAcessPoint + '/facebook?returnUrl=http://localhost:8003/')
})

router.get('/google', (req, res)=>{
  res.redirect(env.authAcessPoint + '/google?returnUrl=http://localhost:8003/')
})

router.post('/login', (req, res) => {
  axios.post(env.authAcessPoint + '/login', req.body)
    .then(response => {
      // colocar o token num cookie e enviar para o cliente
      res.cookie('token', response.data.token)
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', {error: err})
    })
})

router.get('/logout', verificaToken, (req, res)=>{
  res.cookie('token', "revogado.revogado.revogado")
  res.redirect('/')
})

// Register

router.get('/register', (req, res)=>{
  res.render('register')
})

router.post('/register', (req, res)=>{
  axios.post(env.authAcessPoint + '/register', req.body)
    .then(response => {
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message})
    })
})


router.get('/resetPassword', (req, res)=>{
  res.render('resetPassword')
})

router.post('/resetPassword', (req, res)=>{
  axios.put(env.authAcessPoint + '/' + req.body._id + '/password', req.body)
    .then(response => { 
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message})
    })

})

module.exports = router;
