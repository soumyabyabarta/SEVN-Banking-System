/* const mongoose = require("mongoose")

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:")
        process.exit(1)
    })       
}   

module.exports = connectToDB
*/

const mongoose = require("mongoose");

function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        // এখানে err.message যোগ করা হয়েছে আসল এরর দেখার জন্য
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    });       
}   

module.exports = connectToDB;