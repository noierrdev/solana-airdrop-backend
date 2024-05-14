const models=require("../models")

exports.saveTelegramLink=(req,res)=>{
    const link=req.body.link;
    const newLink=new models.TelegramLink({
        link,
        ip:req.ip
    })
    newLink.save()
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch(e=>res.json({status:"error",error:e}))
}