const mongoose=require('mongoose')
const {MongoGridFS} = require('mongo-gridfs');
const Grid = require('gridfs-stream');

module.exports=()=>{
    // Connect to MongoDB
    const MONGODB_URI=`mongodb://127.0.0.1:27017/solairdrop`;
    mongoose.connect(MONGODB_URI, {});
    
    const db = mongoose.connection;
    require('../models');
    // Handle MongoDB connection events
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        global.gridfs = new MongoGridFS(mongoose.connections[0],"upload");
        // global.gridfs=Grid(mongoose.connection.db,mongoose.mongo);
        // global.gridfs.collection('uploads');
        console.log('Connected to MongoDB');
    });
}
