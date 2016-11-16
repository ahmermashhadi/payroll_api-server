var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var Employee = require('./employee.model');



exports.listAllEmployee = function(req, res) {
Employee.find({}, function (err, employee) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong.',
        data: err
      })
    }
    if (!employee || employee.length == 0) {
      return res.status(200).json({
        success: true,
        message: 'Employees not found',
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: 'All Employees fetched successfully.',
      data: employee
    });
  })
};

exports.addEmployee = function(req, res){

  log('ADD Employee');
  log(req.body);
  
  var employee = new Employee(req.body);

  employee.save(function (err, employee) {
    if(err){
      return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again.',
        data: err
      });
    }
    else{
      log(employee);
      res.status(200).json({
        success: true,
        message: 'Employee created successfully.',
        data: employee
      });
    }
  });
};

exports.getEmployee = function(req, res){
 log('GET EMPLOYEE BY ID');
  Employee.findById(req.params.eid, function (err, employee) {
    if(err){
      return res.status(500).json({
        success: false,
        message: 'Something went wrong.',
        data: err
      })
    }
    if(!employee || employee.deleted) {
      return res.status(200).json({
        success: true,
        message: 'Employee not found. Please check Employee ID.',
        data: null
      });
    }
    res.status(200).json({
      message: 'Employee Data',
      success: true,
      data : employee
    });
  })
}


exports.getEmployeeByEmail = function(req, res){
 log('GET EMPLOYEE BY Email');
  Employee.find({email: req.params.email}, function (err, employee) {
    if(err){
      return res.status(500).json({
        success: false,
        message: 'Something went wrong.',
        data: err
      })
    }
    if(!employee || employee.deleted) {
      return res.status(200).json({
        success: true,
        message: 'Employee not found. Please check Employee ID.',
        data: null
      });
    }
    res.status(200).json({
      message: 'Employee Data',
      success: true,
      data : employee
    });
  })
}


exports.updateEmployee = function(req, res){
log('UPDATE EMPLOYEE');
  Employee.findById(req.params.eid, function (err, employee) {
    if(err){
      return res.status(500).json({
        success: false,
        message: 'Something went wrong.',
        data: err
      })
    }
    if(!employee || employee.deleted) {
      return res.status(200).json({
        success: true,
        message: 'Employee not found. Please check Employee ID.',
        data: null
      });
    }
    employee.image = req.body.image || employee.image;
    employee.email = req.body.email || employee.email;
    employee.bio = req.body.bio || employee.bio;
    employee.firstname = req.body.firstname || employee.firstname;
    employee.lastname = req.body.lastname || employee.lastname;
    employee.location = req.body.location || employee.location;
    employee.designation = req.body.designation || employee.designation;
    employee.department = req.body.department || employee.department;
    employee.salary = req.body.salary || employee.salary;

    employee.save(function (err,updatedemployee) {
      if(err){
        return res.status(500).json({
          success: false,
          message: 'Something went wrong. Please try again.',
          data: err
        });
      }
      else{
        res.status(200).json({
          success: true,
          message: 'Employee updated successfully.',
          data: updatedemployee
        });
      }
    })
  })

}

exports.deleteEmployee = function(req, res){
	Employee.remove({_id: req.params.eid}, function (err) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Something went wrong.Please try again.",
                data: err
              });
            }

            return res.status(200).json({
              success: true,
              message: 'Employee removed successfully.'
            });
          });
}

exports.getDptEmployees = function(req, res){

Employee.find({department: req.params.dname}, function (err, employee) {
    if(err){
      return res.status(500).json({
        success: false,
        message: 'Something went wrong.',
        data: err
      })
    }
    log(employee);
    if(!employee || employee.deleted || employee.length == 0) {
      return res.status(200).json({
        success: true,
        message: 'Employee not found. Please check Department Name.',
        data: null
      });
    }
    res.status(200).json({
      message: 'Employee Data',
      success: true,
      data : employee
    });
  })

}

exports.getUniqueEmployee = function(req, res) {
  Employee.findOne({email: req.query.email}, function (err, employee) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong.',
        data: err
      })
    }
    if (!employee || employee.length == 0) {
      return res.status(200).json({
        success: true,
        message: 'Employees not found',
        data: err
      });
    }
    res.status(200).json({
      success: true,
      message: 'Got you successfully ' + req.query.firstname,
      data: employee
    });
  })
};


exports.postTimelog = function(req, res){
  log(req.body)

    Employee.findById(req.body.id, function (err, employee) {
    if(err){
      return res.status(500).json({
        success: false,
        message: 'Something went wrong.',
        data: err
      })
    }
    if(!employee || employee.deleted) {
      return res.status(200).json({
        success: true,
        message: 'Employee not found. Please check Employee ID.',
        data: null
      });
    }
    employee.image = req.body.image || employee.image;
    employee.email = req.body.email || employee.email;
    employee.bio = req.body.bio || employee.bio;
    employee.firstname = req.body.firstname || employee.firstname;
    employee.lastname = req.body.lastname || employee.lastname;
    employee.location = req.body.location || employee.location;
    employee.designation = req.body.designation || employee.designation;
    employee.department = req.body.department || employee.department;
    employee.salary = req.body.salary || employee.salary;
    if(employee.timelog){
      var obj = {
         date: Date.now(),
         time: req.body.time 
      }
      log(obj);
      employee.timelog.push(obj);
      log(employee.timelog);
    }

    log(employee);
    employee.save(function (err,updatedemployee) {
      if(err){
        return res.status(500).json({
          success: false,
          message: 'Something went wrong. Please try again.',
          data: err
        });
      }
      else{
        res.status(200).json({
          success: true,
          message: 'Employee updated successfully.',
          data: updatedemployee
        });
      }
    })
  })


}