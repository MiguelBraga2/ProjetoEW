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

module.exports.lerFicheiro
