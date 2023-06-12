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