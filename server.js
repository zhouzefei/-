// 一些依赖库
var http = require("http"),
  url = require("url"),
  superagent = require("superagent"),//发起请求模块
  cheerio = require("cheerio"),//解析dom操作
  async = require("async"),
  eventproxy = require('eventproxy');//模块控制并发

// 连接并将数据存入mongodb
var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
var IndexData= require('./models/IndexData');
var ListData=require('./models/ListData');
mongoose.connect('mongodb://localhost/huabanData');

var ep = new eventproxy(), 
  urlsArray = [],	//存放爬取网址
  pageUrls = [],	//存放收集文章页面网站
  pageNum = 30,	//要爬取文章的页数
  startDate=new Date(),//开始时间
  endDate,//结束时间
  imgurl="http://hbimg.b0.upaiyun.com/",
  imgIndArray=[],//首页图片
  imgListArray=[],//列表页图片
  imgDetailArray=[],//详情页图片
  oldhtmlStr=[];
for(var i=1; i<=pageNum; i++){
  pageUrls.push('http://huaban.com?page='+i);
}
http.createServer(function (request, response) {
  pageUrls.forEach(function(pageUrl){
    superagent.get(pageUrl)
    .end(function(err,pres){
        var htmlStr=pres.text,flag='app.page["recommends"] = ',lastflag='app.page["explores"] = ';
        var str=htmlStr.substring(htmlStr.indexOf(flag)+flag.length,htmlStr.indexOf(lastflag)).replace(/\s/g,"");
        console.log(str)
        
        if(oldhtmlStr.indexOf(str)<0){
          oldhtmlStr.push(str);
          str=JSON.parse((str.substring(0,str.length-1)).replace(/\n/g, "\\n"));
          for(var i=0; i<str.length; i++){
             var articleUrl=str[i].url+'?limit=30';//每页取3000条数据
             urlsArray.push(articleUrl);
             var _indexData;
             if(str[i].avatar){
                _indexData=new IndexData({
                  title:str[i].title,
                  img:imgurl+str[i].avatar.key,
                  href:str[i].url,
                  board_id:str[i].board_id
                });
             }else if(str[i].cover){
                _indexData=new IndexData({
                  title:str[i].title,
                  img:imgurl+str[i].cover.key,
                  href:str[i].url,
                  board_id:str[i].board_id
                })
             }
             _indexData.save(function(err,index){
                if(err){
                  console.log(err)
                }
             })
             ep.emit('huabanHtml', articleUrl);
          }
        }
    });
  });
  ep.after('huabanHtml',pageUrls.length*4,function(articUrls){
      var curCount=0;
      var reptileMove=function(url,callback){
        var delay=parseInt((Math.random()*30000000)%1000,10);
        curCount++;
        // console.log('现在并发数',curCount,',正在抓取的是',url,'，耗时'+delay+'毫秒');
        superagent.get(url)
          .end(function(err,sres){
              var childStr=sres.text,childFlag='',childLastflag='app._csr = true';
              if(childStr.indexOf('app.page["user"] = ')>-1){
                childFlag='app.page["user"] = ';
              }else if(childStr.indexOf('app.page["board"] = ')>-1){
                childFlag='app.page["board"] = ';
              }
              var cstr=childStr.substring(childStr.indexOf(childFlag)+childFlag.length,childStr.indexOf(childLastflag)).replace(/\s/g,"");
              cstr=JSON.parse((cstr.substring(0,cstr.length-1)).replace(/\n/g, "\\n"));
              var _listData,itemImgArr=[];
              if(cstr.pins){
                for(var j=0; j<(cstr.pins).length; j++){
                  itemImgArr.push(imgurl+cstr.pins[j].file.key)
                  // console.log("http://huaban.com/pins/"+cstr.pins[j].pin_id);
                }
              }else if(cstr.boards){
                for(l=0; l<cstr.boards.length; l++){
                  var board=cstr.boards[l];
                  if(board){
                    for(var k=0; k<(board.pins).length; k++){
                      itemImgArr.push(imgurl+board.pins[k].file.key)
                      console.log("http://huaban.com/pins/"+board.pins[k].pin_id);
                    }
                  }
                }
              }
              _listData=new ListData({
                'title':cstr.title,
                'img':itemImgArr,
                'board_id':cstr.board_id
              });
              console.log(_listData);
              _listData.save(function(err,index){
                if(err){
                  console.log(err)
                }
                //console.log(index);
             })
          });
          //完成一个释放并新启用一个线程
          setTimeout(function() {
              curCount--;
              callback(null,url +'Call back content');
          }, delay);  
      };
      async.mapLimit(articUrls,5,function(url,callback){
        reptileMove(url,callback);
      },function(err,result){
        endDate = new Date();
        // console.log('1、爬虫开始时间：'+ startDate +'<br/>');
        // console.log('2、爬虫结束时间：'+ endDate +'<br/>');
        // console.log('3、耗时：'+ (endDate - startDate) +'ms' +' --> '+ (Math.round((endDate - startDate)/1000/60*100)/100) +'min <br/>');
      })
  });
}).listen(3000);













