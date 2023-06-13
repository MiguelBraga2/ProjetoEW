const fs = require('fs');

function readDictionaryFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const dictionary = JSON.parse(data);
    
    return dictionary
}


module.exports.fullTextObjects = {'Relator': readDictionaryFromFile('./search/Full-Text-Search/Relator.json'), 
                                  'Requerente': readDictionaryFromFile('./search/Full-Text-Search/Requerente.json'), 
                                  'Sumário': readDictionaryFromFile('./search/Full-Text-Search/Sumário.json'), 
                                  'Votação': readDictionaryFromFile('./search/Full-Text-Search/Votação.json'), 
                                  'Área Temática 1':  readDictionaryFromFile('./search/Full-Text-Search/Área Temática 1.json')};
