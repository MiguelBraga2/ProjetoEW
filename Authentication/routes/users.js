const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const passport = require('passport')
const userModel = require('../models/user')
const User = require('../controllers/user')
const auth = require('../auth/auth')
require('dotenv').config();

router.get('/', auth.verificaAcesso, function (req, res) {
  User.list()
    .then(dados => res.status(200).jsonp({ dados: dados }))
    .catch(e => res.status(500).jsonp({ error: e }))
})

// Rota para iniciar o processo de autenticação com o Facebook
router.get('/facebook', passport.authenticate('facebook'));

// Rota de callback para autenticação com o Facebook
router.get('/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      // Tratar o erro de autenticação
      return res.jsonp({ error: err.message });
    }
    if (!user) {
      // Tratar o cenário de autenticação falhada
      return res.jsonp({ error: 'Authentication failed.' });
    }
    // Autenticação bem-sucedida, gerar o token
    jwt.sign(
      { username: user.username, level: user.level, sub: 'User logged in' },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      function (error, token) {
        if (error) {
          // Tratar o erro de criar o token
          return res.jsonp({ error: error.message });
        } else {
          return res.jsonp({ token: token });
        }
      }
    );
  })(req, res, next);
});


// Rota para iniciar o processo de autenticação com o google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Rota de callback para autenticação com o Google
router.get('/google/callback', function(req, res, next) {
  passport.authenticate('google', function(err, user, info) {
    if (err) {
      // Tratar o erro de autenticação
      return res.jsonp({ error: err.message });
    }
    if (!user) {
      // Tratar o cenário de autenticação falhada
      return res.jsonp({ error: 'Authentication failed.' });
    }
    // Autenticação bem-sucedida, gerar o token
    jwt.sign({
      username: user.username,
      level: user.level,
      sub: 'User logged in'
    },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      function (e, token) {
        if (e) {
          // Tratar o erro de geração do token
          return res.jsonp({ error: e });
        }
        // Enviar o token como resposta
        return res.jsonp({ token: token });
      });
  })(req, res, next);
});

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
  var d = new Date().toISOString().substring(0, 19)
  userModel.register(new userModel({
    username: req.body.username, name: req.body.name, surname: req.body.surname,
    email: req.body.email, level: req.body.level, 
    active: true, dateCreated: d, dateLastAccess: d,
    providerId: '', provider: ''
  }),
    req.body.password,
    (err, user) => {
      if (err)
        res.jsonp({ error: err, message: "Register error: " + err })
      else {
        passport.authenticate("local")(req, res, () => {
          jwt.sign({
            username: req.user.username, level: req.user.level,
            sub: 'New User'
          },
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
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
    sub: 'User logged in'
  },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
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
      res.jsonp('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.put('/:id/desativar', auth.verificaAcesso, function (req, res) {
  User.updateUserStatus(req.params.id, false)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.jsonp('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.put('/:id/ativar', auth.verificaAcesso, function (req, res) {
  User.updateUserStatus(req.params.id, true)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.jsonp('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.put('/:id/password', auth.verificaAcesso, function (req, res) {
  User.updateUserPassword(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.jsonp('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.delete('/:id', auth.verificaAcesso, function (req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.jsonp('error', { error: erro, message: "Erro na remoção do utilizador" })
    })
})

module.exports = router;