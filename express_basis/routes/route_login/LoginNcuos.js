var express = require('express')
var router = express.Router()
var request = require('request')

router.route('/').get((req, res, next) => {
  return res.render('login_page/login_ncuos', {
    title: '云家园登录'
  })
}).post((req, res) => {
  var user = {
    username: req.body.username,
    password: req.body.password
  }
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
