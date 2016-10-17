var mongoose=require('mongoose')
var IndexDataSchema=require('../schemas/IndexData')
var IndexData=mongoose.model('IndexData',IndexDataSchema)

module.exports=IndexData;