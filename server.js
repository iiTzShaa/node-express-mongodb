const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app  = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
  

const DB = process.env.DATABASE;
mongoose.connect(DB).then(()=>{console.log('DB connection successful');})


const port =process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is running on port 3000');
});


process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });