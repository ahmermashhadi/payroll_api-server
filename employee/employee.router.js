var express = require('express');
var router = express.Router();
var empCtrl = require('./employee.controller');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var verify = require('../server/verify');

//GET all serials
router.route('/')
 .get(empCtrl.listAllEmployee)
 .post(empCtrl.addEmployee);

router.route('/me')
 .get(empCtrl.getUniqueEmployee)
 .post(empCtrl.postTimelog)
//GET serials
router.route('/unique/:eid')
 .get(empCtrl.getEmployee)
 .put(verify.user, empCtrl.updateEmployee)
 .delete(verify.user, empCtrl.deleteEmployee)
 
router.route('/:dname')
	.get(empCtrl.getDptEmployees);



module.exports = router;