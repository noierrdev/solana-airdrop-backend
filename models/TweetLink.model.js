const mongoose=require('mongoose')

const schema=mongoose.Schema;

const TweetLinkSchema=new schema({
    link:{
        type:String
    },
    ip:{
        type:String
    }
},{
    timestamps:true
})

const TweetLink=mongoose.model("TweetLink",TweetLinkSchema);

module.exports=TweetLink;