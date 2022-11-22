const wallet = new NearWallet("dempire.testnet");
const contract = "dempire.testnet"



async function check(){
    if (window.location.href.includes("transactionHashes") && !window.location.href.includes("errorMessage") ){
        alert("Transaction success");
        
    }
    else if (window.location.href.includes("errorMessage")){
        alert("Failed")
    }

}

check()

async function buy(id,amount) {
    
console.log(amount);
    await window.connect();
    
    wallet.callMethod({

        contractId: contract, 
        method:"mint",
        args :{"asset_id":id},
        deposit:NearUtils.format.parseNearAmount(String(amount))

      })

}
window.connect = async function () {
    let isSignedIn = await wallet.startUp()
    if(!isSignedIn){
      wallet.signIn()
      return;
    }
    window.accounts = wallet.accountId;
}  