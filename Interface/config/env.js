if (process.env.API_URL){
    module.exports.apiAccessPoint = process.env.API_URL
}
else{
    module.exports.apiAccessPoint = "http://localhost:8001/api"    
}

if (process.env.AUTH_URL){
    module.exports.authAcessPoint = process.env.AUTH_URL
}
else{
    module.exports.authAcessPoint = "http://localhost:8002/users"
}


