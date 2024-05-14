const models=require("../models")

exports.saveTweetLink=(req,res)=>{
    const link=req.body.link;
    const newLink=new models.TweetLink({
        link,
        ip:req.ip
    })
    newLink.save()
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch(e=>res.json({status:"error",error:e}))
}