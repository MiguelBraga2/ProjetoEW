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
            return resp[0]+1
          }
        })
        .catch(error => {
          return error
        })
}

const algoliasearch = require('algoliasearch');

let breakUpObject = (object, maxBytes) => {
  const smallerObjects = [];
  let id = object['_id']
  let currentSize = 0;
  let currentObject = {};
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      if (typeof object[key] === 'string'){
          const propertySize = object[key].length;
          for(let i=0; i<propertySize; i++){
              if (currentSize == maxBytes){
                  currentObject._id = id
                  smallerObjects.push(currentObject);
                  console.log(currentObject)
                  let newObject = {}
                  newObject[key] = ''

                  currentObject = newObject
                  currentSize = 0;
              }
              else{
                  if (!currentObject.hasOwnProperty(key)){
                      currentObject[key] = ''
                  }  
                  currentObject[key] += object[key][i]
                  currentSize++;
              }
              
          }
      } else {
          currentObject[key] = object[key]
      }
    }
      
  }

  smallerObjects.push(currentObject);
  currentObject['_id'] = id
  return smallerObjects
}

/**
 * Creates a new judgment in the BD
 * CREATE
 * @param {judgment} judgment 
 * @returns the created judgment or an error
 */
module.exports.addAcordao = judgment => {
  return Judgment
            .create(judgment)
            .then(resp => {    
              // Se correu bem, enviar para a base de dados da algolia              
              const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
              const index = client.initIndex('Acordaos')

              // Só se podem guardar até 10000 carateres
              let smallerObjects = breakUpObject(judgment, 9000) // Max size of object is 9000 bytes
            
              index.saveObjects(smallerObjects, {
                autoGenerateObjectIDIfNotExist: true
              }).then(({ objectIDs }) => {
                console.log(objectIDs);
              })
              .catch(err => {
               console.log(err)
              });
              
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