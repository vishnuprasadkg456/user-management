const mongoose = require("mongoose");

const connectDataBase = async ()=>{
    try{
        const connect= await mongoose.connect( 'mongodb://localhost:27017/userAuth',{});
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    }catch (error){
        console.error("Not connected");
        process.exit(1);
    }
    
};

module.exports = connectDataBase;