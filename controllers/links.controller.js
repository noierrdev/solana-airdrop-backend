const models=require("../models")
const web3 =  require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const bs58=require('bs58')
exports.saveLink=async (req,res)=>{
    
    const tweet=req.body.tweet;
    const telegram=req.body.telegram;
    const wallet=req.body.wallet;
    if(!(String(tweet).startsWith('https://www.x.com')|String(tweet).startsWith('https://x.com'))) return res.json({status:"error",error:"NOT_VALID_TWEET_LINK"});
    if(!Number(telegram))  return res.json({status:"error",error:"NOT_VALID_TELEGRAM_ID"});
    const duplicated=await models.Link.find({$or:[{tweet:tweet},{telegram:telegram}]}).lean().exec();
    if(duplicated.length>0) return res.json({status:"error",error:"DUPLICATED_INPUT"});
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
            console.log(`Token account generated for ${userWallet.toString()} `)
            splToken.mintTo(
                connection,
                walletKeyPair,
                mint,
                tokenAccount.address,
                walletKeyPair.publicKey,
                100
            )
            .then((mintData)=>{
                console.log(`Mint 100 to ${userWallet.toString()}`)
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