const mongoose=require('mongoose');

const bookingSchema=new mongoose.Schema({
    // service:{type:mongoose.Schema.Types.ObjectId,required:true},
     user:{type:mongoose.Schema.Types.ObjectId,required:true},
    
    owner:String,
    name:String,
    city:String,
    center:String,
    slot:String,
    services:String,
});

const BookingModel=mongoose.model('Booking',bookingSchema);

module.exports=BookingModel;