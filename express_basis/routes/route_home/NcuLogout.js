var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  req.session.student = null
  return res.redirect('/ncuos/login')
})

module.exports = router