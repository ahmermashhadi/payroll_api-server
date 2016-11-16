var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Employee = new Schema({
  image : {
    type: String,
    default: ''
  },
  email : {
    type: String,
    default: '',
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
  designation: {
    type: String,
    default: ''
  },
  salary: {
    type: Number,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  timelog: [{
    date: {
      type: Date,
      default: Date.now
    },
    time: {
      type: Number,
      default: 0
    }
  }]
},{timestamps: true});


Employee.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employee', Employee);