const fs = require('fs')

const env = require('../config/env');
const axios = require('axios');

var postDocument = (document) => {
    axios.post(env.apiAccessPoint + '/acordaos', document)
    .then(response => {
    })
    .catch(err =>{
        console.log("Erro")
        res.render('error', {error: err, message: err.message});
    })
}

/**
 * Reads the file and processes it
 * @param {} file_name 
 * @param {The current id count in the database} current_id 
 */
exports.processFile = (file_name, current_id) => {
    fs.readFile('./fileProcessing/raw_files/' + file_name, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
    
        try {
          // Parse the JSON data
          const documents = JSON.parse(data);
    
          // Add _id field to each document with incremental count
          documents.forEach((document, index) => {
            document._id = current_id + index; // Index is being incremented

            processDocument(document)

            postDocument(document)
          });
    
          // Convert the modified data back to JSON
          const modifiedData = JSON.stringify(documents, null, 2);
    
          // Write the modified data back to the file
          fs.writeFile('./fileProcessing/processed_files/' + file_name, modifiedData, 'utf8', (err) => {
            if (err) {
              console.error('Error writing file:', err);
            } else {
              console.log('Successfully added _id field to documents.');
            }
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });
      
}

/**
 * Processes a document, adding new fields, removing other, formatting, etc
 */
let processDocument = (document) => {
  // Iterate over the keys of the document
  const entries = Object.entries(document);
  // Campos unificados para listas
  document['Recorridos'] = []
  document['Áreas Temáticas'] = []
  document['Referências de Publicação'] = []
  let descritores = []

  for (let [key, value] of entries){
    // Quando há unificação de um campo para outro
    if (key in synonyms){
      if (key != synonyms[key]){
        document[synonyms[key]] = value
        delete document[key]
      }
      if (value == ""){ // Remover os valores nulos
        delete document[key]
      }
      // Parsing de cada descritor (Separar por ;)
      if (key === 'Descritores'){
        for(desc in document['Descritores']){
          let novosDescritores = document['Descritores'][desc].split(';')
          for(descritor in novosDescritores){
            descritores.push(novosDescritores[descritor].trim())
          }
        }
        document['Descritores'] = descritores
      }
      if (key.startsWith('Recorrido')){
        document['Recorridos'].push(value)
        delete document[key]
      }
      if (key.startsWith('Área Temática')){
        let novasAreasTematicas = document[key].split(';')
        for(novaAreaTematica in novasAreasTematicas){
          document['Áreas Temáticas'].push(novasAreasTematicas[novaAreaTematica].trim())
        }
        delete document[key]
      }
      if (key.startsWith('Referência de Publicação') || key.startsWith('Referência Publicação')){
        document['Referências de Publicação'].push(value)
        delete document[key]
      }
      // Casos em que a "Data da Decisão Sumária" é igual à "Data do Acordão" e o "Nº Único do Processo" é igual ao "Processo
      if (key === 'Data da Decisão Sumária'){
        if (value === document['Data do Acordão']){
          delete document[key]
        }
      }
      // Casos em que o "Nº Único do Processo" é igual ao "Processo"
      if (key === 'Nº Único do Processo'){
        if (value === document['Processo']){
          delete document[key]
        }
      }
    } // Caso essa chave não conste da lista
    else {
      delete document[key]
    }
  }
}
