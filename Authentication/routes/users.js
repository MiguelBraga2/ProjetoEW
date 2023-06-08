const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const passport = require('passport')
const userModel = require('../models/user')
const User = require('../controllers/user')
const auth = require('../auth/auth')

router.get('/', auth.verificaAcesso, function (req, res) {
  User.list()
    .then(dados => res.status(200).jsonp({ dados: dados }))
    .catch(e => res.status(500).jsonp({ error: e }))
})

router.get('/:id', auth.verificaAcesso, function (req, res) {
  User.getUser(req.params.id)
    .then(dados => res.status(200).jsonp({ dados: dados }))
    .catch(e => res.status(500).jsonp({ error: e }))
})

router.post('/', auth.verificaAcesso, function (req, res) {
  User.addUser(req.body)
    .then(dados => res.status(201).jsonp({ dados: dados }))
    .catch(e => res.status(500).jsonp({ error: e }))
})

router.post('/register', function (req, res) {
  console.log("aqui")
  var d = new Date().toISOString().substring(0, 19)
  userModel.register(new userModel({
    username: req.body.username, name: req.body.name,
    email: req.body.email, level: req.body.level, 
    active: true, dateCreated: d, dateLastAccess: d
  }),
    req.body.password,
    (err, user) => {
      if (err)
        res.jsonp({ error: err, message: "Register error: " + err })
      else {
        passport.authenticate("local")(req, res, () => {
          jwt.sign({
            username: req.user.username, level: req.user.level,
            sub: 'ProjetoEW'
          },
            "ProjetoEW",
            { expiresIn: 3600 },
            function (e, token) {
              if (e) res.status(500).jsonp({ error: "Erro na geração do token: " + e })
              else res.status(201).jsonp({ token: token })
            });
        })
      }
    })
})

router.post('/login', passport.authenticate('local'), function (req, res) {
  jwt.sign({
    username: req.user.username, level: req.user.level,
    sub: 'ProjetoEW'
  },
    "ProjetoEW",
    { expiresIn: 3600 },
    function (e, token) {
      if (e) res.status(500).jsonp({ error: "Erro na geração do token: " + e })
      else res.status(201).jsonp({ token: token })
    });
})

router.put('/:id', auth.verificaAcesso, function (req, res) {
  User.updateUser(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.put('/:id/desativar', auth.verificaAcesso, function (req, res) {
  User.updateUserStatus(req.params.id, false)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.put('/:id/ativar', auth.verificaAcesso, function (req, res) {
  User.updateUserStatus(req.params.id, true)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.put('/:id/password', auth.verificaAcesso, function (req, res) {
  User.updateUserPassword(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.delete('/:id', auth.verificaAcesso, function (req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na remoção do utilizador" })
    })
})

module.exports = router;