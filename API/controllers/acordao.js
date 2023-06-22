var Judgment = require('../models/acordao')
var Algolia = require('./algolia.js')
const fs = require('fs');
const JSONStream = require('JSONStream');

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
            return {_id: resp[0]._id+1}
          }
        })
        .catch(error => {
          console.log(error.message)
          return error
        })
}

/**
 * Creates a new judgment in the BD
 * CREATE
 * @param {judgment} judgment 
 * @returns the created judgment or an error
 */
module.exports.addAcordao = (judgment) => {
  return Judgment
            .create(judgment)
            .then(resp => {   
              // Se correu bem, enviar para a base de dados da algolia              
              Algolia.add(judgment)
              .then(response => {
                return resp
              })
              .catch(error => {
                console.log(error)
                return error
              })
              
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
module.exports.updateAcordao = (judgment, id) => {
  return Judgment
                 .updateOne({_id: id}, judgment)
                 .then(resp => {
                  judgment._id = id
                   Algolia.update(judgment)
                    .then(response => {
                      return resp
                    })
                    .catch(error => {
                      return error
                    })
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
          // Se correu bem, remover da base de dados do algolia
          Algolia.remove(id)
          .then(response => {
            return resp
          })
          .catch(error => {
            return error
          })
          
        })
        .catch(error => {
          return error
        })
} 

var postDocuments = (documents) => {
  return Judgment
  .insertMany(documents)
  .then(resp => {   
    // Se correu bem, enviar para a base de dados da algolia              
    Algolia.add(documents)
    .then(response => {
      return resp
    })
    .catch(error => {
      console.log(error)
      return error
    })
    
  })
  .catch(error => {
    console.log(error)
    return error
  })
}

let synonyms = {
  'Processo': 'Processo',
  'url': 'url',
  'tribunal': 'tribunal',
  'Data do Acordão': 'Data do Acordão',
  'Descritores': 'Descritores',
  'Relator': 'Relator',
  'Votação': 'Votação',
  'Texto Integral': 'Texto Integral',
  'Decisão': 'Decisão',
  'Meio Processual': 'Meio Processual',
  'Nº do Documento': 'Nº do Documento',
  'Nº Convencional': 'Nº Convencional',
  'Sumário': 'Sumário',
  'Privacidade': 'Privacidade',
  'Legislação Nacional': 'Legislação Nacional',
  'Decisão Texto Integral': 'Decisão Texto Integral',
  'Área Temática': 'Área Temática',
  'Tribunal': 'Tribunal',
  'Recorrente': 'Recorrente',
  'Recorrido 1': 'Recorrido 1',
  'Data de Entrada': 'Data de Entrada',
  'Jurisprudência Nacional': 'Jurisprudência Nacional',
  'Área Temática 1': 'Área Temática 1',
  'Objecto': 'Objecto',
  'Reclamações': 'Reclamações',
  'Ano da Publicação': 'Ano da Publicação',
  'Indicações Eventuais': 'Indicações Eventuais',
  'Tribunal Recurso': 'Tribunal Recurso',
  'Data': 'Data',
  'Secção': 'Juízo ou Secção',
  'Tribunal Recorrido': 'Tribunal Recorrido',
  'Processo no Tribunal Recurso': 'Processo no Tribunal Recurso',
  '1ª Pág. de Publicação do Acordão': '1ª Pág. de Publicação do Acordão',
  'Apêndice': 'Apêndice',
  'Data do Apêndice': 'Data do Apêndice',
  'Processo no Tribunal Recorrido': 'Processo no Tribunal Recorrido',
  'Referência a Doutrina': 'Referência a Doutrina',
  'Área Temática 2': 'Área Temática 2',
  'Data Dec. Recorrida': 'Data Dec. Recorrida',
  'Página': 'Página',
  'Referência de Publicação': 'Referência de Publicação',
  'Texto Parcial': 'Texto Parcial',
  'Parecer Ministério Público': 'Parecer Ministério Público',
  'Referência Publicação 1': 'Referência Publicação 1',
  'Doutrina': 'Referência a Doutrina',
  'Espécie': 'Espécie',
  'Acordão': 'Acordão',
  'Requerente': 'Requerente',
  'Requerido': 'Requerido',
  'Nº do Volume': 'Nº do Volume',
  'Magistrado': 'Magistrado',
  'Contencioso': 'Contencioso',
  'Nº Processo/TAF': 'Nº Processo/TAF',
  'Sub-Secção': 'Sub-Secção',
  'Normas Apreciadas': 'Normas Apreciadas',
  'Constituição': 'Constituição',
  'Nº do Diário da República': 'Nº do Diário da República',
  'Série do Diário da República': 'Série do Diário da República',
  'Data do Diário da República': 'Data do Diário da República',
  'Página do Diário da República': 'Página do Diário da República',
  'Referência a Pareceres': 'Referência a Pareceres',
  'Disponível na JTCA': 'Disponível na JTCA',
  'Legislação Comunitária': 'Legislação Comunitária',
  'Referências Internacionais': 'Referências Internacionais',
  'Normas Julgadas Inconst.': 'Normas Declaradas Inconst.',
  'Recorrido 2': 'Recorrido 2',
  'Normas Suscitadas': 'Normas Suscitadas',
  'Voto Vencido': 'Voto Vencido',
  'Apenso': 'Apenso',
  'Jurisprudência Internacional': 'Jurisprudência Internacional',
  'Legislação Estrangeira': 'Legislação Estrangeira',
  'Recusa Aplicação': 'Recusa Aplicação',
  'Declaração de Voto': 'Declaração de Voto',
  'Tribunal 1ª Instância': 'Tribunal 1ª Instância',
  'Data da Decisão': 'Data da Decisão',
  'Texto das Cláusulas Abusivas': 'Texto das Cláusulas Abusivas',
  'Recursos': 'Recurso',
  'Autor': 'Autor',
  'Réu': 'Réu',
  'Juízo ou Secção': 'Juízo ou Secção',
  'Tipo de Contrato': 'Tipo de Contrato',
  'Tipo de Ação': 'Tipo de Ação',
  'Volume dos Acordãos do T.C.': 'Volume dos Acordãos do T.C.',
  'Página do Volume': 'Página do Volume',
  'Página do Boletim do M.J.': 'Página do Boletim do M.J.',
  'Nº do Boletim do M.J.': 'Nº do Boletim do M.J.',
  'Jurisprudência Constitucional': 'Jurisprudência Constitucional',
  'Normas Declaradas Inconst.': 'Normas Declaradas Inconst.',
  'Nº Único do Processo': 'Nº Único do Processo',
  'Data do Acórdão': 'Data do Acordão',
  'Recurso': 'Recurso',
  'Observações': 'Observações',
  'Data da Decisão Sumária': 'Data da Decisão Sumária',
  'Jurisprudência Estrangeira': 'Jurisprudência Estrangeira',
  'Outras Publicações': 'Outras Publicações',
  'Referência Processo': 'Referência Processo',
  'Outra Jurisprudência': 'Outra Jurisprudência',
  'Referência Publicação 2': 'Referência Publicação 2',
  'Data da Reclamação': 'Data da Reclamação',
  'Peça Processual': 'Peça Processual',
  'Tema': 'Tema',
  'Data da Decisão Singular': 'Data da Decisão Singular',
}

exports.processFile = (file_name, current_id) => {
  const StreamArray = require('stream-json/streamers/StreamArray');
  const stream = fs.createReadStream('../Interface/fileProcessing/raw_files/' + file_name).pipe(StreamArray.withParser());
  let chunks = [];

  stream
    .on('data', ({ value }) => {
      processDocument(value)
      value._id = current_id;
      current_id++;
      chunks.push(value);
      if (chunks.length === 10000) {
        stream.pause();
        postDocuments(chunks)
          .then(() => {
            chunks = [];
            stream.resume();
          })
          .catch(error => {
            console.log(error);
            stream.resume();
          });
      }
    })
    .on('end', () => {
      if (chunks.length) {
        postDocuments(chunks)
          .catch(error => console.log(error));
      }
    });
};


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
        continue;
      }
      if (key.startsWith('Data')){
        const d = new Date(value)
        try{
          document[key] = d.toISOString();
        }
        catch(err){
          delete document[key]
        }
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
      if (key.startsWith('Área Temática') && typeof document[key] === 'string'){
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