var User = require('./user.model');
var passport = require('passport');
var auth = require('../server/auth.js');
var Verify = require('../server/verify.js');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var config = require('../config/config');
var request = require('request');


exports.listAll = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) throw err;
    res.json(users);
  });
};

exports.register = function(req,res){
  User.register(new User({
      username: req.body.username
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save(function (err, user) {
        passport.authenticate('local')(req, res, function () {
          return res.status(200).json({
            message: 'User registered',
            success: true,
            data : null
          });
        });
      });
    });
};

exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          message: 'Could not log in user',
          success: true,
          data : null
        });
      }
      var userJson = user._doc;
      delete userJson.hash;
      delete userJson.salt;
      var token = Verify.getToken(userJson);
      res.status(200).json({
        message: 'Login successful!',
        success: true,
        data: {token : token,
               user: userJson}
      });
    });
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  req._user = null;
  res.status(200).json({
    message: 'logout',
    success: true,
    data : null
  });
};

exports.verifyUser = function (req,res) {

  log(req._user);
  User.findById(req._user._id, function (err, user) {
    if (err) {
      return res.status(500).json({
        message: 'Something went wrong while finding user',
        success: false,
        data: null
      });
    }
    else{
      log(user);
      return res.status(200).json({
          message: 'Successfully Got the User',
          success: false,
          data: user
        });
    }
  });
};


exports.facebookTokenLogin = function (req, res) {

  log(req.body);

  var accessTokenUrl = config.facebook.accessTokenUrl;
  var graphApiUrl = config.facebook.graphApiUrl;
  var accessToken = {
    access_token: req.body.token
  };

  // Graph API call with the token from user body :A
  request.get({
    url: graphApiUrl + "?fields=id,email,gender,first_name,last_name,name",
    qs: accessToken,
    json: true
  }, function (err, response, profile) {
    log("_______________________FB USER PROFILE_______________________");
    log(profile)
    if (response.statusCode !== 200) {
      return res.status(500).send({
        message: profile.error.message,
        success: false,
        data: null

      });
    }
    // Find user with OuthId from facebook (profile.id) :A
    User.findOne({"OauthId": profile.id}, function (err, existingUser) {
      if (err) {
        return res.status(500).json({
          message: 'Something went wrong while getting user',
          success: false,
          data: null
        });
      }
      log('_______________________FB USER FOUND_______________________');
      log(existingUser);
      if (existingUser !== null) {
            return res.status(200).json({
              message: 'User found and logged in',
              success: true,
              data: { user:existingUser,
                      token: accessToken
                    }
            });
          }
      else {
        log('_______________________FB USER CREATED_______________________');
        var user = new User();
        user.firstname = profile.first_name;
        user.lastname = profile.last_name;
        user.email = profile.email;
        user.OauthId = profile.id;
        user.image = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        user.save(function (err, userInfo) {
          if (err) {
            return res.status(500).json({
              message: 'Something went wrong while saving new user',
              success: false,
              data: null
            });
          }
          log(userInfo);
          if (err) {
            res.send(err);
          }
          auth.getLoginData(userInfo).then(
            function (data) {
              console.log(data);
              return res.status(200).json({
                message: 'User created and logged in',
                success: true,
                data: data
              });
            },
            function (err) {
              console.log(err);
              return res.status(400).json({
                message: 'Something went wrong while login',
                success: false,
                data: null
              });
            }
          );
        });
      }
    });

  });


};