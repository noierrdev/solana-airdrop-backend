const mongoose=require('mongoose')

const schema=mongoose.Schema;

const LinkSchema=new schema({
    tweet:{
        type:String
    },
    telegram:{
        type:String
    },
    wallet:{
        type:String
    },
    ip:{
        type:String
    }
},{
    timestamps:true
})

const Link=mongoose.model("Link",LinkSchema);

module.exports=Link;