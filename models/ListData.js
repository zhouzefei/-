var mongoose=require('mongoose')
var ListDataSchema=require('../schemas/ListData')
var ListData=mongoose.model('ListData',ListDataSchema)

module.exports=ListData;