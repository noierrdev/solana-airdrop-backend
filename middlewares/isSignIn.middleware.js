module.exports=(req,res,next)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    return next();
}