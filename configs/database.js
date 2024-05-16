const mongoose=require('mongoose')
const {MongoGridFS} = require('mongo-gridfs');

module.exports=()=>{
    // Connect to MongoDB
    const MONGODB_URI=`mongodb+srv://noierrdev:noierrdev@vandermoleker.t28swgf.mongodb.net/solgold_airdrop?retryWrites=true&w=majority&appName=vandermoleker`;
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
