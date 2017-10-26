var express = require('express');
var router = express.Router();
const client = require('mongodb').MongoClient
const DB_CONN_STR = 'mongodb://localhost:27017/userinfo'
/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.locals.message = ''
    return res.redirect('/home')
  }
  res.render('index', { title: '欢迎' });
});

router.route('/login').all((req, res, next) => {
  if (req.session && req.session.user) {
    req.session.error = "你已经登录了"
    return res.redirect('/home')
  }
  next()
}).get((req, res) => {
  res.render('login', {title: '登录应用'})
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
          res.send(200)
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


router.route('/register').all((req, res, next) => {
  if (req.session.user) {
    req.session.error = '你已经登录了！'
    return res.redirect('/home')
  }
  next()
}).get((req, res) => {
  res.render('register', {title: '注册'})
  }).post((req, res) => {
  let newUser = { username: req.body.username, password: req.body.password, passwordSec: req.body.passwordSec }
  let addStr = [{ username: newUser.username, password: newUser.password }]
  client.connect(DB_CONN_STR, (err, db) => {
    db.collection('users').findOne({ username: newUser.username }, (err, result) => {
      if (!result) {
        if (newUser.password === newUser.passwordSec) {
          client.connect(DB_CONN_STR, (err, db) => {
            db.collection('users').insert(addStr)
            db.close()
            res.json({ status: 0, msg: '123'})
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
router.route('/home').all((req, res, next) => {
  if (!req.session.user) {
    req.session.error = "请先登录!"
    return res.redirect('/login')
  }
  next()
}).get((req, res) => {
  return res.render('home', {title: 'Home'})
})

router.get('/logout', (req, res) => {
  req.session.user = null
  return res.redirect('/')
})

module.exports = router;
