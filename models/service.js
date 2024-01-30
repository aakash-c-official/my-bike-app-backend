const mongoose=require('mongoose');

const serviceSchema=new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    city:String,
    center:String,
    services:[String],
    price:Number
});

const ServiceModel=mongoose.model('Service',serviceSchema);
module.exports=ServiceModel;