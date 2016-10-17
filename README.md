###爬虫练手
#### 第一步：启动mongo数据库服务
#### 第二步：启动数据抓取服务 node server.js  访问localhost:3000，将数据存入mongo中
#### 第三步：启动数组展示服务 npm start       访问localhost:3001，将数据中数据展示于界面

### 思路解析
- 依赖库使用：
  superagent：作为发起请求模块
  cheerio：解析dom操作（类似jq）
  eventproxy：模块控制并发（多线程发起请求）
  async：异步请求，控制并发数
  
- 这里我一花瓣网为主，经过源码查看，发现是通过数据动态渲染，根据对象的特点，将app.page["recommends"] =与app.page["explores"] = 
  中间数据部分进行解析。花瓣网为滚动动态加载，所以暂时无法发现其翻页总数，这里我们首页加载5屏。当然对着获取到到数据要进行去重，获取唯一数据。将title,   board_id,img,href作为抓取字段入库。在请求每一屏的过程同时发起相对应得列表数据，作为点击列表页数据展示。

- 为提高数据爬取效率，采用并发进行数据抓取，但是同时发起多个请求导致阻塞，这里定义为同时发起5个请求数。
  并发解析：异步操作中我们无法确定谁先完成，所以借助中间变量当数据抓取到修改中间变量根据中间变量值判断是否进入下一个操作。
  pageUrls.length*15 一页展示15条数据，一共75条数据进行爬取,
  存入数据，通过board_id作为key，进行查询相关列表数据。

### demo
- ![Set URL Schema in XCode](https://github.com/zhouzefei/pachong/blob/master/1.png)
- ![Set URL Schema in XCode](https://github.com/zhouzefei/pachong/blob/master/2.png)
- ![Set URL Schema in XCode](https://github.com/zhouzefei/pachong/blob/master/3.png)



学习资源http://www.tuicool.com/articles/MvUjMfB
