const models=require("../models")
const web3 =  require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

exports.saveLink=async (req,res)=>{
    
    const tweet=req.body.tweet;
    const telegram=req.body.telegram;
    const wallet=req.body.wallet;
    const referral=req.body.referral;
    if(!(String(tweet).startsWith('https://www.x.com')|String(tweet).startsWith('https://x.com'))) return res.json({status:"error",error:"NOT_VALID_TWEET_LINK"});
    if(!Number(telegram))  return res.json({status:"error",error:"NOT_VALID_TELEGRAM_ID"});
    // const user=await bot.getChatMember(`@${"solgold_airdrop_01"}`,Number(telegram))
    // console.log(user)
    const duplicated=await models.Link.find({$or:[{tweet:tweet},{telegram:telegram}]}).lean().exec();
    if(duplicated.length>0) return res.json({status:"error",error:"DUPLICATED_INPUT"});
    const newLink=new models.Link({
        tweet,
        telegram,
        wallet,
        ip:req.ip
    })
    newLink.save()
    .then(async (gotLink)=>{
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
        const walletKeyPair = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.SOLANA_PRIVATE_KEY)));
        var mint=new web3.PublicKey(process.env.SPL_TOKEN_MINT);
        var userWallet=new web3.PublicKey(wallet)
        const tokenAccount=await splToken.getOrCreateAssociatedTokenAccount(
            connection,
            walletKeyPair,
            mint,
            userWallet
        )
        if(!tokenAccount) return res.json({status:"error",error:"FAILED_TO_GET_TOKEN_ACCOUNT"})
        console.log(`Token account generated for ${userWallet.toString()} `)
        await setTimeout(() => {}, 1000);
        const mintData=await splToken.mintTo(
            connection,
            walletKeyPair,
            mint,
            tokenAccount.address,
            walletKeyPair.publicKey,
            100000000000
        )
        if(!mintData) return res.json({status:"error",error:"FAILEDTO_MINT"});
        console.log(`Mint 100 to ${userWallet.toString()}`)

        //If no referral, return
        if(!referral) return res.json({status:"success", data:mintData, referral:gotLink._id});

        //If refered, find in the links
        models.Link.findById(referral)
        .then(async gotReferral=>{
            if(!gotReferral) return res.json({status:"success", data:mintData, referral:gotLink._id})
            if(gotReferral.wallet==wallet) return res.json({status:"success", data:mintData, referral:gotLink._id});

            //Rewarding to referer
            const refererWallet=new web3.PublicKey(gotReferral.wallet);
            await setTimeout(() => {}, 1000);
            const refererAccount=await splToken.getOrCreateAssociatedTokenAccount(
                connection,
                walletKeyPair,
                mint,
                refererWallet
            )
            if(!refererAccount) return res.json({status:"success",data:mintData,referral:gotLink._id})
            console.log("Referere Account of  ", gotReferral.wallet )
            await setTimeout(() => {}, 1000);
            const rewardData=await splToken.mintTo(
                connection,
                walletKeyPair,
                mint,
                refererAccount.address,
                walletKeyPair.publicKey,
                10000000000
            )
            if(!rewardData) return res.json({status:"success",data:mintData,referral:gotLink._id})
            console.log("Referer rewarded : ",gotReferral.wallet)
            return res.json({status:"success", data:mintData, referral:gotLink._id});
        })
        .catch(e=>{
            console.log(e)
        })
    })
    .catch(e=>{
        console.log(e)
    })
}