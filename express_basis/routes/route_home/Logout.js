var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  req.session.user = null
  return res.redirect('/me_io/login')
})

module.exports = router