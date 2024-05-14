const router=require('express').Router()

router.get('/',(req,res)=> res.json({status:"success"}));
router.use('/links',require("./links.router"));
router.use('/telegramlinks',require("./telegramlinks.router"));
router.use('/tweetlinks',require("./tweetlinks.router"));

module.exports=router;