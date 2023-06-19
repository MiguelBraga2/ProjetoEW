var User = require('../models/user')

// Devolve a lista de Users
module.exports.list = () => {
    return User
        .find()
        .sort('name')
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getUser = id => {
    return User.findOne({ _id: id })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.addUser = u => {
    return User.create(u)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateUser = (id, info) => {
    return User.updateOne({ _id: id }, { $set: info })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateFavs = (id, fav) => {
    return User.updateOne({ _id: id }, { $push: { favorites: fav } })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateHistory = (id, process) => {
    return User.updateOne({ _id: id }, {$push: { history: process } })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateUserStatus = (id, status) => {
    return User.updateOne({ _id: id }, { $set: { active: status } })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateUserPassword = (id, pwd) => {
    return User.updateOne({ _id: id }, pwd)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.deleteUser = id => {
    return User.deleteOne({ _id: id })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

