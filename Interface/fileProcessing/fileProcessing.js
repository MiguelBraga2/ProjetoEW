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
processDocument = (document) => {

}
