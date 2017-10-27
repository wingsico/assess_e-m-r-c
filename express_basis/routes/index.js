var express = require('express');
var router = express.Router();
var cherrio = require('cheerio')
var request = require('request')
const client = require('mongodb').MongoClient
const DB_CONN_STR = 'mongodb://localhost:27017/userinfo'
var book_url = 'http://opac.ncu.edu.cn/opac/openlink.php?'

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

router.route('/book').get((req, res, next) => {
  return res.render('book', {title: '图书查询'})
}).post((req, res) => {
  let strText = req.body.title
  let params = `strSearchType=title&match_flag=forward&historyCount=1&strText=${encodeURI(strText)}&doctype=ALL&with_ebook=on&displaypg=20&showmode=table&sort=CATA_DATE&orderby=desc&dept=ALL`
  request(book_url + params, (err, resp, body) => {
    if (!err && resp.statusCode == 200) {
      let $ = cherrio.load(body)
      let content = $('#result_content')
      let book_list = []
      content.find('tr').each((index, item) => {
        if (index !== 0) {
          let book = $(item)
          let book_name = $(book.find('td')[1]).find('a').text()
          let writter = $(book.find('td')[2]).text()
          let publish_arr = $(book.find('td')[3]).text().split(' ')
          let publisher = publish_arr[0]
          let publish_date = publish_arr[1]

          book_list.push({
            book_name: book_name,
            publish_date: publish_date,
            writter: writter,
            publisher: publisher
          })
        }
      })
      console.log(book_list)
      res.status(200).json({
        status: 1,
        data: book_list
      })
    } else {
      res.send(500)
    }
  })
})

router.route('/login_ncuos').get((req, res, next) => {
  return res.render('login_ncuos', {title: '云家园登录'})
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
  }, function (err, resp, body) {
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

module.exports = router;
