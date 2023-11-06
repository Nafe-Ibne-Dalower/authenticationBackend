const mongoose = require('mongoose');
const connectToMongo = async function main(){
  try{
    await mongoose.connect('mongodb://127.0.0.1:27017/inotebook');
  }catch{
    console.log(err)
  }
}

module.exports = connectToMongo