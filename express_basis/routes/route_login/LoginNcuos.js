var express = require('express')
var router = express.Router()
var request = require('request')

router.route('/').all((req, res, next) => {
  if (req.session && req.session.student) {
    req.session.error = '你已经登录，若要再次登录请注销'
    return res.redirect('/ncuos/home/')
  }
  next()
}).get((req, res, next) => {
  return res.render('login_page/login_ncuos', {
    title: '云家园登录'
  })
}).post((req, res) => {
  var user = {
    username: req.body.username,
    password: req.body.password
  }
  console.log(user)
  request({
    url: 'https://os.ncuos.com/api/user/token',
    method: "POST",
    json: true,
    headers: {
      "Content-Type": "application/json"
    },
    body: user
  }, function(err, resp, body) {
    if (!err && resp.statusCode == 200) {
      let student = {
        username: req.body.username,
        password: req.body.password,
        token: body.token
      }
      req.session.student = student
      console.log(student)
      res.json({
        status: 1,
        data: student
      })
    } else {
      console.log(err)
    }
  })
})

module.exports = router
