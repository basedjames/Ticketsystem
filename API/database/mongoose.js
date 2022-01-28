// HANDLE CONNECTION TO DATABASE MONGODB
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TicketManager', {useNewUrlParser: true}).then(() => {
    console.log("connected to MongoDB successfully");
}).catch((e) => {
    console.log("error while attempting to connect to MongoDB");
    console.log(e);
});

module.exports = {
    mongoose
};