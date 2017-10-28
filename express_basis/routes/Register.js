var express = require('express')
var router = express.Router()
var client = require('mongodb').MongoClient
const DB_CONN_STR = 'mongodb://localhost:27017/userinfo'


router.route('/').all((req, res, next) => {
  if (req.session.user) {
    req.session.error = '你已经登录了！'
    return res.redirect('/home')
  }
  next()
}).get((req, res) => {
  res.render('register', {
    title: '注册'
  })
}).post((req, res) => {
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    passwordSec: req.body.passwordSec
  }
  let addStr = [{
    username: newUser.username,
    password: newUser.password
  }]
  client.connect(DB_CONN_STR, (err, db) => {
    db.collection('users').findOne({
      username: newUser.username
    }, (err, result) => {
      if (!result) {
        if (newUser.password === newUser.passwordSec) {
          client.connect(DB_CONN_STR, (err, db) => {
            db.collection('users').insert(addStr)
            db.close()
            res.json({
              status: 0,
              msg: '123'
            })
          })
        } else {
          req.session.error = '两次密码不一致！'
          res.send(500)
        }
      } else {
        req.session.error = '用户名已存在！'
        res.send(500)
      }
    })
    db.close()
  })
})

module.exports = router;