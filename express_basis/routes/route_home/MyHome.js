var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  req.session.error = "请先登录！"
  return res.redirect('/me_io/login')
})

router.route('/:user').all((req, res, next) => {
  console.log(req.session)
  if (!req.session.user) {
    req.session.error = "请先登录!"
    return res.redirect('/me_io/login')
  }
  next()
}).get((req, res) => {
  return res.render('home_page/home', { title: 'Home - ' + req.params.user })
})

module.exports = router