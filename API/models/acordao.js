const mongoose = require('mongoose')

var acordaoSchema = new mongoose.Schema({
    _id: Number,
    Processo: String,
    url: String,
    tribunal: String,
    'Data do Acordão': String,
    Descritores: String,
    Relator: String,
    Votação: String,
    'Meio Processual': String,
    'Nº do Documento': String,
    'Nº Convencional': String,
    'Sumário': String, 
    'Texto Integral': String, 
    'Texto Parcial': String,
    'Decisão Texto Integral': String, 
    'Decisão': String, 
    'Privacidade': String,
    'Legislação Nacional': String,
    'Tribunal': String,
    'Recorrente': String,
    'Recorridos': [String],
    'Áreas Temáticas': [String],
    'Data de Entrada': String,
    'Objecto': String,
    'Jurisprudência Nacional': String,
    'Tribunal Recurso': String,
    'Data': String,
    'Processo no Tribunal Recurso': String,
    'Indicações Eventuais': String,
    '1ª Pág. de Publicação do Acordão': String,
    'Apêndice': String,
    'Data do Apêndice': String,
    'Referência a Doutrina': String,
    'Página': String,
    'Referência de Publicação': String,
    'Parecer Ministério Publico': String,
    'Espécie': String,
    'Acordão': String,
    'Requerente': String,
    'Requerido': String,
    'Nº do Volume': String,
    'Magistrado': String,
    'Contencioso': String,
    'Nº Processo/TAF': String,
    'Sub-Secção': String,
    'Normas Apreciadas': String,
    'Constituição': String,
    'Nº do Diário da República': String,
    'Série do Diário da República': String,
    'Data do Diário da República': String,
    'Página do Diário da República': String,
    'Referência a Pareceres': String,
    'Disponível na JTCA': String,
    'Legislação Comunitária': String,
    'Normas Julgadas Inconst.': String,
    'Referências Internacionais': String,
    'Normas Suscitadas': String,
    'Voto Vencido': String,
    'Jurisprudência Internacional': String,
    'Legislação Estrangeira': String,
    'Apenso': String,
    'Recusa Aplicação': String,
    'Declaração de Voto': String,
    'Tribunal 1ª instância': String,
    'Texto das Cláusulas Abusivas': String,
    'Recursos': String,
    'Autor': String,
    'Réu': String,
    'Juízo ou Secção': String,
    'Tipo de Contrato': String,
    'Tipo de Ação': String,
    'Volume dos Acordãos do T.C.': String,
    'Página do Boletim do M.J.': String,
    'Nº do Boletim do M.J.': String,
    'Jurisprudência Constitucional': String,
    'Normas Declaradas Inconst.': String,
    'Observações': String,
    'Jurisprudência Estrangeira': String,
    'Outras Publicações': String,
    'Processo no Tribunal Recorrido': String,
    'Reclamações': String,
    'Outra Jurisprudência': String,
    'Nº Único do Processo': String,
    'Referência Publicação 2': String, // Deve ser removido na BD
    'Referência Processo': String,
    'Data da Reclamação': String,
    'Peça Processual': String
});

module.exports = mongoose.model('acordao', acordaoSchema);