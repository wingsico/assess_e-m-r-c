var express = require('express');
var router = express.Router();
var client = require('mongodb').MongoClient
const DB_CONN_STR = 'mongodb://localhost:27017/userinfo'

router.route('/').all((req, res, next) => {
  if (req.session && req.session.user) {
    req.session.error = "你已经登录了"
    return res.redirect('/me_io/home/' + req.session.user.username)
  }
  next()
}).get((req, res) => {
  res.render('login_page/login', { title: '登录应用' })
}).post((req, res) => {
  let user = {
    username: req.body.username,
    password: req.body.password
  }
  // 假数据
  client.connect(DB_CONN_STR, (err, db) => {
    if (err) {
      console.log(err)
      return
    }
    db.collection('users').find({ 'username': user.username }).toArray((err, result) => {
      if (err) {
        console.log(err)
        return
      }
      if (result.length) {
        if (result[0].password == user.password) {
          req.session.user = user
          res.json({
            status: 1,
            data: user.username
          })
        } else {
          req.session.error = '用户名或密码错误!'
          res.send(500);
        }
      } else {
        req.session.error = '账号不存在！'
        res.send(500);
      }
    })
    db.close()
  })
})

module.exports = router;