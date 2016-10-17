var mongoose = require('mongoose');
var ListDataSchema=new mongoose.Schema({
	title:String,
	img:[],
	board_id:String,
	createAt:{
		type:Date,
		default:Date.now()
	}
});
ListDataSchema.pre('save',function (next,data) {
	next();
});
ListDataSchema.statics={
	findById:function(id,cb){
		console.log(id)
		return this
			.findOne({"board_id":id})
			.exec(cb)
	}
}
module.exports=ListDataSchema;