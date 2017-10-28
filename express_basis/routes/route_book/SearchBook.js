var express = require('express')
var router = express.Router()

router.route('/book').get((req, res, next) => {
  return res.render('book', { title: '图书查询' })
}).post((req, res) => {
  let strText = req.body.title
  let params = `strSearchType=title&match_flag=forward&historyCount=1&strText=${encodeURI(strText)}&doctype=ALL&with_ebook=on&displaypg=20&showmode=table&sort=CATA_DATE&orderby=desc&dept=ALL`
  request({
    method: 'get',
    url: book_url + params,
    timeout: 3000
  }, (err, resp, body) => {
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

module.exports = router