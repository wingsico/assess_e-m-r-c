##考核
内容 express + request + cheerio
完成功能：
1. 登录注册
2. 爬取图书馆图书信息（标题搜索）
3. 模拟登录（拿到token）

## 说明
<code>/node_spider</code>是练手爬虫，不用管，用于简单爬取网站的轮播图相关信息
<code>/express_basis</code>为主要内容
由于<code>.gitignore</code>没写好有一些文件传上来了，暂时不用管
##使用方法
<pre><code>> git clone git@github.com:wingsico/> assess_e-m-r-c.git
> cd assess_e-m-r-c
> npm install
> sudo mongo // 由于是本地数据库，需要一些额外操作，在下面介绍
> supervisor ./bin/www  // or npm start
</code></pre>

##数据库操作
<pre><code>> brew install mongodb -g
> cd /usr/local/bin
> nano mongodb.conf // 以下目录自行更改
port=27017
dbpath=/Users/wingsico/mongoDatabase/data
logpath=/Users/wingsico/mongoDatabase/log/mongodb.log
fork = true 
> sudo ./mongod -f mongodb.conf
> ./mongo
> use userinfo
> db.createCollection({ username: 'admin', password: '123'})</code></pre>
##待补充
评论功能