var express = require('express')
var router = express.Router()

router.get('/logout', (req, res) => {
  req.session.user = null
  return res.redirect('/')
})

module.exports = router