//  const mongoose = require('mongoose');
//  const mongoURI ="mongodb+srv://arpittripathi:tripathi1997@cluster0.tklwunh.mongodb.net/"
 
//  const connectToMongo =()=>{
//     mongoose.connect(mongoURI,()=>{
//         console.log("connected to mongo successfully");
//     })
//  }
const mongoose = require('mongoose');

async function connectToMongo() {
  try {
    await mongoose.connect('mongodb+srv://arpittripathi:tripathi1997@cluster0.tklwunh.mongodb.net/mynotebook');
    // Additional code after successful connection
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

 module.exports = connectToMongo; 
