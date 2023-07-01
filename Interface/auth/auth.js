var env = require('../config/env');
var jwt = require('jsonwebtoken');

// Ex: roles = {'admin': -1, 'producer': 1, 'consumer': -1}
exports.verificaToken = function(roles){
    return async(req, res, next) => {
      if (req.cookies){
        var myToken = req.cookies.token
        if(myToken){
          jwt.verify(myToken, process.env.SECRET_KEY, function(e, payload){
            if(e){
              res.status(401).jsonp({error: e})
            }
            else{
              let flag = false
              for(const role in roles){
                if(payload.level === role){
                  console.log(roles[role])
                  if (roles[role] === 1){
                    if (payload.id === req.params.id){
                      flag = true
                      break
                    }
                  }
                  else if (roles[role] === -1){
                    flag = true
                    break
                  }
                }
              }
  
              if(flag === true){
                next()
              }
              else{
                res.render('error', {error : "Acesso negado", message : "Acesso negado"})
              }
            }
          })
        }
        else{
          res.redirect('/login')
        }
      }
      else{
        res.redirect('/login')
      }
    }
  }