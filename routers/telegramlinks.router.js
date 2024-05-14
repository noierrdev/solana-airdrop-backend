const router=require('express').Router()
const telegramlinksController=require("../controllers/telegramlinks.controller")

router.post("/",telegramlinksController.saveTelegramLink)

module.exports=router;