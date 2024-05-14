const mongoose=require('mongoose')

const schema=mongoose.Schema;

const TelegramLinkSchema=new schema({
    link:{
        type:String
    },
    ip:{
        type:String
    }
},{
    timestamps:true
})

const TelegramLink=mongoose.model("TelegramLink",TelegramLinkSchema);

module.exports=TelegramLink;