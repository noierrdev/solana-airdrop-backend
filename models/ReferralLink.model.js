const mongoose=require('mongoose')

const schema=mongoose.Schema;

const ReferralLinkSchema=new schema({
    link:{
        type:String
    },
    wallet:{
        type:String
    }
},{
    timestamps:true
})

const ReferralLink=mongoose.model("ReferralLink",ReferralLinkSchema);

module.exports=ReferralLink;