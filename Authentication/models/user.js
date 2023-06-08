const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  password: String,
  username: String,
  name: String,
  email: String,
  level: String,
  active: Boolean,
  dateCreated: String,
  dateLastAccess: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);