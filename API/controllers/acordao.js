var Judgment = require('../models/acordao')

/**
 * Retrieve all judgment from the BD
 * RETRIEVE
 * @returns The judgments or an error
 */
module.exports.list = () => {
    return Judgment
                   .find()
                   .then(resp => {
                     return resp
                   })
                   .catch(error => {
                     return error
                   })
}

module.exports.getAcordaos = (filter, projection) => {
  return Judgment
                 .find(filter, projection)
                 .then(resp => {
                   return resp
                 })
                 .catch(error => {
                   return error
                 })
}

/**
 * Retrieve a judgment from the BD given its id
 * RETRIEVE
 * @param {id} id the id of the judgment
 * @returns The judgment or an error
 */
module.exports.getAcordao = id => {
    return Judgment
                   .find({_id: id})
                   .then(resp => {
                     return resp
                   })
                   .catch(error => {
                     return error
                   })
}

var nomesTribunais = {
  'atco1': 'Tribunal Constitucional',
  'jcon': 'Tribunal dos Conflitos',
  'jdgpj': 'Cláusulas Abusivas julgadas pelos Tribunais',
  'jsta': 'Supremo Tribunal Administrativo',
  'jstj': 'Supremo Tribunal de Justiça',
  'jtca': 'Tribunal Central Administrativo Sul',
  'jtcampca': 'Pareceres do MP do Tribunal Central Administrativo Sul - Contencioso Administrativo',
  'jtcampct': 'Pareceres do MP do Tribunal Central Administrativo Sul - Contencioso Tributário',
  'jtcn': 'Tribunal Central Administrativo Norte',
  'jtrc': 'Tribunal da Relação de Coimbra',
  'jtre': 'Tribunal da Relação de Évora',
  'jtrg': 'Tribunal da Relação de Guimarães',
  'jtrl': 'Tribunal da Relação de Lisboa',
  'jtrp': 'Tribunal da Relação do Porto'
}

module.exports.getTribunais = () => {
  return Judgment
        .distinct('tribunal')
        .then(resp => {
          var tribunais = {}    

          for(var i = 0; i < resp.length; i++) {
            tribunais[resp[i]] = nomesTribunais[resp[i]]
          }
          return tribunais
        })
        .catch(error => {
          return error
        })
}

module.exports.getAcordaosDoTribunal = tribunal => {
  return Judgment
        .find({tribunal: tribunal})
        .then(resp => {
          return resp
        })
        .catch(error => {
          return error
        })
}

module.exports.getCurrentId = () => {
  return Judgment
        .find({}, {_id: 1})
        .sort({_id: -1})
        .limit(1)
        .then(resp => {
          if (resp.length == 0){
            return {_id: 0}
          }
          else{
            return resp[0]
          }
        })
        .catch(error => {
          return error
        })
}

/**
 * Creates a new judgment in the BD
 * CREATE
 * @param {judgment} judgment 
 * @returns the created judgment or an error
 */
module.exports.addAcordao = judgment => {
  console.log(judgment)
  return Judgment
                 .create(judgment)
                 .then(resp => {
                   return resp
                 })
                 .catch(error => {
                   return error
                 })
}

/**
 * Updates a judgment in the BD
 * UPDATE
 * @param {judgment} judgment 
 * @returns the updated judgment(Verificar) or an error
 */
module.exports.updateAcordao = judgment => {
  return Judgment
                 .updateOne({_id: judgment._id}, judgment)
                 .then(resp => {
                   return resp
                 })
                  .catch(error => {
                   return error
                 })
                
}

/**
 * Deletes a judgment from the BD
 * DELETE
 * @param {id} id 
 * @returns the deleted judgment(Verificar) or an error
 */
module.exports.deleteAcordao = id => {
  return Judgment
                 .deleteOne({_id: id})
                 .then(resp => {
                   return resp
                 })
                 .catch(error => {
                   return error
                 })
} 