const router=require('express').Router()
const linksController=require("../controllers/links.controller")

router.post("/",linksController.saveLink)

module.exports=router;