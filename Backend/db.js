const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGOOSE,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected Successfully".cyan.bold);
    }
    catch(err){
        console.log(err);
        process.exit();
    }
}

module.exports = connectDB;
