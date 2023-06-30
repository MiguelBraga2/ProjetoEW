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
  jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
    if (err) {
      res.render('error', {err: err, message: "Não possui acesso a este conteúdo..."});
    } else {
      res.render('pesquisas', {user: payload});
    }
  });
})

/**
 * GET página de criar um acordão 
 */
router.get('/acordaos/novo', verificaToken, (req, res) => {
  jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
    if (err) {
      res.render('error', {error: err, message: err.message});
    } else if (payload.level === 'producer' || payload.level === 'admin') {
      res.render('novoAcordao', {user: payload});
    } else {
      res.render('error', {error : {} , message : "Não possui acesso a este conteúdo..."});
    }
  });  
})

/**
 * GET página de um acordão 
 */
router.get('/acordaos/:id', verificaToken, (req, res) => {
  const token = '?token=' + req.cookies.token;
  axios.get(env.apiAccessPoint + '/acordaos/' + req.params.id)
    .then(response => { 
      jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
        if (err) {
          res.render('error', {error: err, message: "Error verifying the token."});
        } else {
          axios.put(env.authAcessPoint + '/' + payload.id + '/history', {process: req.params.id})
            .then(responseAuth => {
              axios.get(env.authAcessPoint + '/' + payload.id + '/favorites' + token)
              .then(response2 => {
                if (response.data[0].Processo){
                  axios.get(env.apiAccessPoint + '/acordaos/apensos/' + response.data[0].Processo.replace('/', ','))
                  .then(response3 => {
                    res.render('processo', {processo: response.data[0], user: payload, favoritos: response2.data.dados.favorites, apendices: response3.data});
                  })
                  .catch(err => {
                    res.render('error', {error: err, message: "Erro a buscar os apendices."});
                  })
                }
                else{
                  res.render('processo', {processo: response.data[0], user: payload, favoritos: response2.data.dados.favorites, apendices: []});
                }
                
              })
              .catch(err => {
                console.log(err)
                res.render('error', {error: err, message: "Erro a receber os favoritos."});
              })
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
 * GET acordãos produzidos por um produces
 */
router.get('/acordaosProducer/:id', verificaToken, (req, res)=>{
  jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
    if (err) {
      res.render('error', {error: err, message: "Não possui acesso a este conteúdo..."});
    } else if (payload.level === 'producer') {
      const queryParams = `?producerId=${req.params.id}`;
      var apiUrl = env.apiAccessPoint + '/acordaos' + queryParams;
      res.render('acordaos', {user: payload, url: apiUrl, editable: true});
    } else {
      res.render('error', {error : {} , message : "Não possui acesso a este conteúdo..."});
    }
  }); 
  
})

/**
 * GET página com os acordãos
 */
router.get('/acordaos', verificaToken, (req, res) => {
  var apiUrl = env.apiAccessPoint + '/acordaos';

  if (req.query && req.query.tribunal) {
    apiUrl += '?tribunal=' + req.query.tribunal;
  }

  
  jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
    if (err) {
      res.render('error', {error : err, message : err.message})
    } else {
      res.render('acordaos', {user: payload, url: apiUrl, editable: false});
    }
  });
  
})

router.get('/acordaos/delete/:id', verificaToken, (req, res) => {
  axios.delete(env.apiAccessPoint + '/acordaos/' + req.params.id)
    .then(response => {
      res.redirect('/acordaos')
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})

router.get('/acordaos/edit/:id', verificaToken, (req, res) => {
  let id = req.params.id
  axios.get(env.apiAccessPoint + '/acordaos/' + id)
    .then(response => {
      jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
        if (err) {
          res.render('error', {error: err, message: "Error verifying the token."});
        } else {
          res.render('editProcesso', {processo: response.data[0], user: payload});
        }
      })
    })
    .catch(err => {
      res.render('error', {error: err, message: err.message});
    })
})



/*--POST's---------------------------------------------------------------------------------------------------------------------------------------------- */

router.post('/files', verificaToken, upload.single('myFile'), (req, res) => {
  jwt.verify(req.cookies.token, process.env.SECRET_KEY, function(err, payload) {
    if (err) {
      res.render('error', {error : err, message : err.message})
    } else if (payload.level === 'admin'){
      let oldPath = __dirname + '/../' + req.file.path
      let newPath = __dirname + '/../fileProcessing/raw_files/' + req.file.originalname
      fs.rename(oldPath, newPath, erro => {
        if (erro){
          console.log(erro)
        }
      })
      axios.get(env.apiAccessPoint + '/postFile/' + req.file.originalname)
      .then(response => {        
      })
      .catch(err => {
        console.log(err)
        res.status(500).render('error', {error: err, message: err.message});
      })
      res.redirect('/')
    } else {
      res.render('error', {error : {} , message : "Não tem acesso a este conteúdo"});
    }
  });

})

router.post('/description/:user_id/:acordao_id', verificaToken, (req, res) => {
  req.body.id = req.params.acordao_id
  axios.put(env.authAcessPoint + '/' + req.params.user_id + '/favorites', req.body)
  .then(resp => {
    res.redirect('/acordaos/'+req.params.acordao_id)
  })
  .catch(error => {
    res.render('error', {error : {} , message : "Erro a atualizar os favoritos"});
  })
  
})

router.post('/acordaos/novo', verificaToken, (req, res) => {
  let modifiedBody = req.body;
  if (req.body) {
    modifiedBody = {
      ...req.body,
      Descritores: req.body.Descritores ? req.body.Descritores.split(',').map(item => item.trim()) : [],
      'Áreas Temáticas': req.body['Áreas Temáticas'] ? req.body['Áreas Temáticas'].split(',').map(item => item.trim()) : [],
      Recorridos: req.body.Recorridos ? req.body.Recorridos.split(',').map(item => item.trim()) : [],
      'Referências de Publicação': req.body['Referências de Publicação'] ? req.body['Referências de Publicação'].split(',').map(item => item.trim()) : [],
    }
  }
  
  axios.post(env.apiAccessPoint + '/acordaos', modifiedBody)
    .then(resp => {
      console.log(resp)
      res.redirect('/acordaos/' + resp.data._id);
    })
    .catch(error => {
      res.render('error', { error: error, message: "Erro ao inserir um novo acordão" });
    });
});

router.post('/acordaos/edit', verificaToken, (req, res) => {
  console.log(req.body.Processo)
  axios.put(env.apiAccessPoint + '/acordaos/' + req.body._id, req.body)
  .then(resp => {
    console.log(resp)
    res.redirect('/')
  })
  .catch(error => {
    res.render('error', {error : error , message : "Erro a atualizar o acordão"});
  })
})

module.exports = router;
