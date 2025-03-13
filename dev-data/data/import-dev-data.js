const dotenv = require('dotenv');
dotenv.config({path: './../../config.env'});
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

const DB = process.env.DATABASE;
mongoose.connect(DB).then(()=>{console.log('DB connection successful');})

//read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

//import data into db
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded');    
    }
    catch(err){
        console.log(err);
    }
    process.exit();
    }

//delete data
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted');    
    }
    catch(err){
        console.log(err);
    }
    process.exit();
    }
    
if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deleteData();
}