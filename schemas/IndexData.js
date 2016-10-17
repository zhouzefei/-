var mongoose = require('mongoose');
var IndexDataSchema=new mongoose.Schema({
	title:String,
	img:String,
	href:String,
	board_id:String,
	createAt:{
		type:Date,
		default:Date.now()
	}
});
IndexDataSchema.pre('save',function (next,data) {
	next();
});
IndexDataSchema.statics={
	fetch:function(cb){
		return this
			.find({})
			.exec(cb)
	}
}
module.exports=IndexDataSchema;