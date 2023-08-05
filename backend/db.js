const mongoose=require('mongoose');
const mongoUri="mongodb://0.0.0.0:27017/inotebook"
const connectToMongoose=()=>{
  mongoose.connect(mongoUri)
  .then(()=>console.log("Mongodb Connected Successfully"),
  err=>{console.log(err);});
}
module.exports=connectToMongoose;