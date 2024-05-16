const models=require("../models")
const web3 =  require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const bs58=require('bs58')
exports.saveLink=async (req,res)=>{
    
    const tweet=req.body.tweet;
    const telegram=req.body.telegram;
    const wallet=req.body.wallet;
    const twitterPostRegex = /^(?:https?:\/\/)?(?:www\.)?x\.com\/\w+\/status\/\d+$/i;
    if(!twitterPostRegex.test(tweet)) return res.json({status:"error",error:"NOT_VALID_TWEET_LINK"});
    if(!Number(telegram))  return res.json({status:"error",error:"NOT_VALID_TELEGRAM_ID"});
    const newLink=new models.Link({
        tweet,
        telegram,
        wallet,
        ip:req.ip
    })
    newLink.save()
    .then(()=>{
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
        const walletKeyPair = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.SOLANA_PRIVATE_KEY)));
        var mint=new web3.PublicKey("G2cxHJdPRbCYmpLvVSJiViQM3D43hRBkb5DivepvNWgy");
        var userWallet=new web3.PublicKey(wallet)
        splToken.getOrCreateAssociatedTokenAccount(
            connection,
            walletKeyPair,
            mint,
            userWallet
        )
        .then(tokenAccount=>{
            splToken.mintTo(
                connection,
                walletKeyPair,
                mint,
                tokenAccount.address,
                walletKeyPair.publicKey,
                100000000000
            )
            .then((mintData)=>{
                return res.json({status:"success",data:mintData})
            })
            .catch(e=>{
                throw e;
            })
            
        })
        .catch(e=>{
            throw e;
        })
    })
    .catch(e=>{
        throw e;
    })
}