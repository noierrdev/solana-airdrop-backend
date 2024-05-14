const router=require('express').Router()
const tweetlinksController=require("../controllers/tweetlinks.controller")

router.post("/",tweetlinksController.saveTweetLink)

module.exports=router;