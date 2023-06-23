var express = require('express');
var router = express.Router();
var env = require('../config/env');
var axios = require('axios');
var jwt = require('jsonwebtoken');
const { query } = require('express');
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
 * GET /login página de login
 */
router.get('/login', (req, res)=>{
  res.render('loginForm')
})


/**
 * GET página de login/registo com facebook
 */
router.get('/facebook', (req, res)=>{
  res.redirect(env.authAcessPoint + '/facebook?returnUrl=http://localhost:8003/')
})

/**
 * GET página de login/registo com o google
 */
router.get('/google', (req, res)=>{
  res.redirect(env.authAcessPoint + '/google?returnUrl=http://localhost:8003/')
})

/**
 * GET página de logout
 */
router.get('/logout', verificaToken, (req, res)=>{
  res.cookie('token', "revogado.revogado.revogado")
  res.redirect('/')
})

/**
 * GET página de registo
 */
router.get('/register', (req, res)=>{
  res.render('register')
})

/**
 * GET página de repor palavra passe 
 */
router.get('/resetPassword', verificaToken, (req, res)=>{
  res.render('resetPassword')
})

/**
 * GET página de um utilizador
 */
router.get('/:id', verificaToken, (req, res)=>{ 
  const token = '?token=' + req.cookies.token;

  const changed = req.query?.changed ? req.query.changed : false;

  axios.get(env.authAcessPoint + '/' + req.params.id + token)
    .then(response => { 
      console.log(response.data.dados)
      res.render('user', {user: response.data.dados, change: changed});
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

/**
 * GET histórico de um utilizador
 */
router.get('/history/:id', verificaToken, (req, res)=>{
  const token = '?token=' + req.cookies.token;
  axios.get(env.authAcessPoint + '/' + req.params.id + '/history' + token)
    .then(response => { 
      const processIds = response.data.dados.history;
      // Construir a URL da API com os parâmetros da query string
      const queryParams = `?ids=${processIds.join(',')}`;
      var apiUrl = env.apiAccessPoint + '/acordaos' + queryParams;
      res.render('historico', {user: response.data.dados, url: apiUrl});
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

/**
 * GET favoritos de um utilizador
 */
router.get('/favorites/:id', verificaToken, (req, res)=>{
  const token = '?token=' + req.cookies.token;
  axios.get(env.authAcessPoint + '/' + req.params.id + token)
    .then(response => { 
      const processIds = response.data.dados.favorites.map(fav => fav.id);
      console.log(processIds)
      // Construir a URL da API com os parâmetros da query string
      const queryParams = `?ids=${processIds.join(',')}`;
      var apiUrl = env.apiAccessPoint + '/acordaos' + queryParams;
      //console.log(response.data.dados )
      res.render('favoritos', {user: response.data.dados, url: apiUrl});
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

/*--POST's---------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * POST /login 
 * Envia pedido ao serviço de autenticação para fazer login e gerar token jwt em caso de sucesso
 */
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

/**
 * POST /register 
 * Envia pedido ao serviço de autenticação para fazer o registo de um novo utilizador
 */
router.post('/register', (req, res)=>{
  axios.post(env.authAcessPoint + '/register', req.body)
    .then(response => {
      res.redirect('/users/login')
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message})
    })
})


/**
 * POST /resetPassword 
 * Envia pedido ao serviço de autenticação para mudar palavra passe
 */
router.post('/resetPassword', verificaToken, (req, res)=>{
  axios.put(env.authAcessPoint + '/' + req.body._id + '/password', req.body)
    .then(response => { 
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message})
    })

})

/**
 * POST /:id 
 * Envia pedido ao serviço de autenticação para guardar alterações do utilizador
 */
router.post('/:id', verificaToken, (req, res)=>{ 
  const token = '?token=' + req.cookies.token;

  axios.put(env.authAcessPoint + '/' + req.params.id + token, req.body)
    .then(response => { 
      res.redirect('/users/' + req.params.id + "?changed=true");
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

module.exports = router;
