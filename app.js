var express=require('express')
var bodyParser = require('body-parser')
var path=require('path')
var mongoose=require('mongoose')
var _=require('underscore')
var port=process.env.PORT||3001
var app=express()
var IndexData=require('./models/IndexData')
var ListData=require('./models/ListData')
mongoose.connect('mongodb://localhost/huabanData')

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(require('body-parser').urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'bower_components')))
app.use(express.static(path.join(__dirname,'./views/css')))
app.listen(port)

//Index
app.get('/',function(req,res){
	IndexData.fetch(function(err,indexDatas){
		console.log(indexDatas)
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'花瓣首页',
			indexData:indexDatas
		});
	})	
});

//list
app.get('/list/:id',function(req,res){
	var id=req.params.id;
	if(id && id!="undefined"){
		ListData.findById(id,function(err,listData){
			res.render('list',{
				title:'列表页',
				listData:listData
			});
		});
	}else{
		res.writeHead(200, {'Content-type' : 'text/html'});
		res.write('<h1>很抱歉</h1>');
		res.end('<p>暂无列表数据</p>');
	}
	
})