var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var data = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:7777/')
    .then(dados => {
      res.status(200).render('index', { clist : dados.data , d: data})
    })
    .catch(erro => {
      res.status(520).render('error', {error: erro, message: "Erro na obtenção da lista de acordãos"})
    })
});

module.exports = router;
