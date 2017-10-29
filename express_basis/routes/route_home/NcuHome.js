var express = require('express')
var request = require('request')
var router = express.Router()
var index_url = 'http://www.ncuos.com/api/user/profile/index'

router.route('/').all((req, res, next) => {
  console.log(res.session)
  if (!req.session.student) {
    req.session.error = "请先登录!"
    return res.redirect('/ncuos/login')
  }
  next()
}).get((req, res) => {
  request({
    url: index_url,
    method: 'get',
    headers: {
      authorization: 'passport ' + req.session.student.token
    }
  }, function(err, resp, body) {
    if (!err) {
      body = JSON.parse(body)
      req.session.student.class = body.department
      req.session.student.name = body.name
      req.session.student.avator = body.head_pic_url
      return res.render('home_page/home_ncuos', {
        title: 'Home - ' + body.name
      })
    }
  })
})


module.exports = router
