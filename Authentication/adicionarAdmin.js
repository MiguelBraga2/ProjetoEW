const userModel = require('./models/user')

userModel.register(new userModel({
    username: 'admin',
    surname: 'admin',
    level: 'admin', 
  }),
    'admin',
    (err, user) => {if (err) console.log(err)})