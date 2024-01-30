const mongoose=require('mongoose')
const {Schema}=mongoose;
const UserSchema=new Schema({ //defination for db
    role:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},//unique:true
    password:{type:String,required:true},
    quote:{type:String}
},{
    collection:'user-data'
})

const UserModel=mongoose.model('UserData',UserSchema)

module.exports=UserModel;