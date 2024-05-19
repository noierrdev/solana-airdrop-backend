const router=require('express').Router()
const linksController=require("../controllers/links.controller")

router.post("/",linksController.saveLink)

router.get('/captcha',linksController.captcha)
router.post('/captcha',linksController.verify)

module.exports=router;