var http = require('http')
var cheerio = require('cheerio')
const client = require('mongodb').MongoClient
const DB_CONN_STR = 'mongodb://localhost:27017/imagesinfo'

var url = "http://www.ziroom.com/"

http.get(url, function(res) {
  var html = ''

  res.on('data', function(data) {
    html += data
  })

  res.on('end', function () {
    var slideListData = filterSlideList(html)
    client.connect(DB_CONN_STR, (err, db) => {
      db.collection('images').insertMany(slideListData)
      db.close()
    })
    printInfo(slideListData)
  })
}).on('error', function(err) {
  console.log('爬取数据失败')
})

function filterSlideList(html) {
  if (html) {
    var $ = cheerio.load(html)

    var sliderList = $('#foucsSlideList')
    var sliderListData = []

    sliderList.find('li').each(function (index, item) {
      let pic = $(item)

      let pic_href = pic.find('a').attr('href')

      let pic_src = pic.find('a').children('img').attr('_src')

      let pic_message = pic.find('a').children('img').attr('alt')

      sliderListData.push({
        pic_href: pic_href,
        pic_src: pic_src,
        pic_message: pic_message
      })
    })

    return sliderListData
  }
}


function printInfo(slideListData) {
  var count = 0
  slideListData.forEach(function (item) {
    var pic_src = item.pic_src;
    // 获取图片对应的链接地址
    var pic_href = item.pic_href;
    // 获取图片信息
    var pic_message = item.pic_message;
    // 打印信息
    console.log(`第${++count}张轮播图`);
    console.log(pic_message);
    console.log(pic_href);
    console.log(pic_src);
    console.log('\n');

  })
}