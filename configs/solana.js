module.exports=()=>{
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
    return connection
}

