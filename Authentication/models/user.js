const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  _id: ObjectId,
  password: String,
  username: String,
  name: String,
  email: String,
  level: String,
  active: Boolean,
  dateCreated: String,
  dateLastAccess: String,
  providerId: String,
  provider: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);