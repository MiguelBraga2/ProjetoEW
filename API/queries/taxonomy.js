const fs = require('fs');

module.exports.lerFicheiro = (nomeFicheiro) => {
  try {
    const conteudo = fs.readFileSync(nomeFicheiro, 'utf8');
    const linhas = conteudo.split('\n');
    const tree = {};

    for (const linha of linhas) {
      if (linha.trim() !== '') {
        const [chave, valor] = linha.split(' - ');
        const valores = valor.slice(1, -1).split(',').map(Number);

        const trimmedLine = chave.trim();
        const words = trimmedLine.split(/\s+/);

        let currentLevel = tree;

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

    return tree;
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
    console.log(currentLevel)
    var novosProcessos = acumProcessosRecursivo(currentLevel)
    for(let novoProcesso in novosProcessos){
      processos.push(novosProcessos[novoProcesso])
    }
  }
  

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
