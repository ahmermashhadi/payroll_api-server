var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: {
    type : String,
    lowercase : true
  },
  password: String,
  OauthId: String,
  OauthToken: String,
  image : {
    type: String,
    default: ''
  },
  email : {
    type: String,
    default: '',
    lowercase : true,
    unique : true
  },
  bio : {
    type: String,
    default: ''
  },
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  occupation: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  },
  resetToken : {
    type: String,
    default: ''
  }
},{timestamps: true});

User.methods.getName = function () {
  return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);