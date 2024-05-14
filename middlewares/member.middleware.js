const models=require('../models')

module.exports=(req,res,next)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"})
    models.Member.findOne({user:req.userId})
    .then(gotMember=>{
        if(!gotMember) return res.json({status:"error",error:"NOT_MEMBER"})
        const now=Date.now();
        if(gotMember.expired<now) return res.json({status:"error",error:"EXPIRED"});
        req.member=gotMember.toJSON();
        return next();
    })
    .catch(e=>res.json({status:"error",error:e}))
}