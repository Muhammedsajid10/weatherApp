const mongoose = require('mongoose')
const uri = "mongodb+srv://MuhammadSajid:armino@cluster0.ga04rak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connection = async () => {
    try {
        const connect = await mongoose.connect(
            uri,{
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log("DataBase Connected Successfully..");
    } catch (error) {
        console.log(`DataBase Error is : ${error}`);
        process.exit();
    }
    
}

module.exports = connection;