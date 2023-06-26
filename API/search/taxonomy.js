const fs = require('fs');
var Judgment = require('../controllers/acordao')

module.exports.createDescriptorMap = async () => {
  let descriptorMap = {}
  let fullTextObject = {}
  return Judgment.list()
  .then(acordaos => {
    for(const acordao of acordaos) {
      const descritores = acordao.Descritores;
      const relator = acordao.Relator;
      if (relator){
        const relatorWords = relator.split(/\s+/);
        for(const word of relatorWords){
          const treatedWord = word.trim().toLowerCase();

          if (fullTextObject[treatedWord]) {
            fullTextObject[treatedWord].push(acordao._id)
          } else {
            fullTextObject[treatedWord] = [acordao._id]
          }
        }
      }
      /*const filePath = 'reverse.json'; // Specify the file path where you want to write the object

// Convert the object to a JSON string
const jsonData = JSON.stringify(fullTextObject, null, 2);

// Write the JSON string to a file
fs.writeFile(filePath, jsonData, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('Object written to file successfully.');
  }
});*/
      
      for (const descritor of descritores) {
        if (descritor in descriptorMap) {
          descriptorMap[descritor].push(acordao._id)
        } else {
          descriptorMap[descritor] = [acordao._id]
        }
      }
    }
    return [descriptorMap, fullTextObject]
  })
  .catch(error => {
    console.log("Erro a obter os acordãos para a taxonomia: " + error.message)
  })
}

module.exports.createTaxonomyTree = (descriptorMap) => {
  let taxonomyTree = {}
  try {
    for (const descritor of Object.keys(descriptorMap)) {
      let linha = descritor;
      if (linha.trim() !== '') {
        const [chave, valores] = [linha, descriptorMap[linha]]

        const trimmedLine = chave.trim();
        const words = trimmedLine.split(/\s+/);

        let currentLevel = taxonomyTree;

        for (let i = 0; i < words.length; i++) {
          const word = words[i];

          // Verificar palavras a serem ignoradas
          if (
            word === '-' ||
            /^([Àà]s?|[aAoO]s|[Aa]nte|[Aa]pós|[Aa]té|[Cc]om|[Cc]ontra|[Dd][eoa]s?|[Dd]esde|[Ee]m?|[Nn][oa]s?|[Ee]ntre|[Pp]ara|[Pp]erante|[Pp](or|el[oa])|[Ss]egundo|[Ss]em|[Ss]ob|[Ss]obre|[Tt]rás)$/.test(word)
          ) {
            continue;
          }

          const pretext = words.slice(0, i + 1).join(' ');

          if (!currentLevel[pretext]) {
            currentLevel[pretext] = {};
          }

          if (i === words.length - 1) {
            // Folha
            currentLevel[pretext]['processos'] = [...valores];
          } else {
            // Nodo intermédio
            if (!currentLevel[pretext].subarvores) {
              currentLevel[pretext].subarvores = {};
            }
            currentLevel = currentLevel[pretext].subarvores;
          }
        }
      }
    }

    /*const filePath = 'output.json'; // Specify the file path where you want to write the object

// Convert the object to a JSON string
const jsonData = JSON.stringify(taxonomyTree, null, 2);

// Write the JSON string to a file
fs.writeFile(filePath, jsonData, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('Object written to file successfully.');
  }
});*/

    return taxonomyTree;
  } catch (error) {
    console.error(`Erro ao ler o ficheiro: ${error}`);
    return null;
  }
}

module.exports.getProcessos = (termo, tree) => {
  const trimmedLine = termo.trim();
  const words = trimmedLine.split(/\s+/);
  let processos = []

  let currentLevel = tree;

  for (let i = 0; i < words.length; i++) {
    const pretext = words.slice(0, i + 1).join(' ');
    if (currentLevel[pretext]){
      if(currentLevel[pretext].subarvores) 
        currentLevel = currentLevel[pretext].subarvores;
      else if (currentLevel[pretext].processos) 
      currentLevel = currentLevel[pretext].processos;
    }
    else{
      return []
    }
  }

  if (Array.isArray(currentLevel)){
    return currentLevel
  } else{
    var novosProcessos = acumProcessosRecursivo(currentLevel)
    for(let novoProcesso in novosProcessos){
      processos.push(novosProcessos[novoProcesso])
    }
  }

  console.log(processos)
  return processos
}

var acumProcessosRecursivo = (tree) => {
  var processos = []
  for(let key in tree){
    if (tree[key]['processos']){
      for(let processo in tree[key]['processos']){
        processos.push(tree[key]['processos'][processo])
      }
    }
    if (tree[key]['subarvores']){
      var novosProcessos = acumProcessosRecursivo(tree[key]['subarvores'])
      for (let novoProcesso in novosProcessos){
        processos.push(novosProcessos[novoProcesso])
      }
    }
  }
  return processos
}

module.exports.lerFicheiro
