const ContractAddress = "dempire.testnet";
const aureusContractAddress = "aureus.dempire.testnet";
const wallet = new NearWallet(ContractAddress);

window.alert = function(text) { console.error(text) };

const is_game_started = async () => {
  let result = await wallet.viewMethod({
    contractId:ContractAddress, 
    method:"get_holding", 
    args:{
      id: wallet.accountId
    }
  })
  if(result.length>0){
    return true;
  }
  return false;
};

window.connect = async function () {
  let isSignedIn = await wallet.startUp()
  if(!isSignedIn){
    wallet.signIn()
    return;
  }
  window.accounts = wallet.accountId;

  myGameInstance.SendMessage("RTS_Camera", "onConnect");
  is_game_started()
  if (await is_game_started()) {
    window.userdata()
  } else {
    myGameInstance.SendMessage('RTS_Camera','onNewUser');
  }
};

window.openMarketPlace = () => {
  window.open("https://market.dempire.space/");
};

window.startgame = async () => {
  wallet.callMethod({
    contractId: ContractAddress, 
    method:"startgame"
  })
};

let graphkey = {
  0: "townhall",
  1: "miner",
  2: "cannon",
  3: "xbow",
  4: "tesla",
  5: "archer",
  6: "robot",
  7: "valkyriee",
};
const keys = Object.keys(graphkey);
keys.forEach((item, i) => {
  window[graphkey[item]] = 0;
});

window.collectwin = async function (buildingamount) {
  //Button_AD
  //showData
  //changeScene
  setTimeout(async ()=>{
    if(buildingamount<=0){
      myGameInstance.SendMessage("Button_AD", "showData");
      return
    }
    myGameInstance.SendMessage("Button_AD", "showData");
  },6500)
};

let reverse_map = {
  0:2,
  1:0,
  2:4,
  3:3,
  4:1
}

window.savegame = async (str) => {
  let building_data = JSON.parse(str);
  let lock_data = [0,0,0,0,0];
  for(let x of building_data['buil']){
    if(x['buildingIndex']==4){
      return;
    }
    lock_data[reverse_map[x['buildingIndex']]]+=1;
  }
  wallet.callMethod({
    contractId: ContractAddress, 
    method:"lock",
    args:{
      map: str,
      lock:lock_data
    }
  })
  //myGameInstance.SendMessage("syncButton", "onSave");
};

let index_map = {
  0: 4,
  1: 0,
  2: 1,
  3: 2,
  4: 3
}

window.fetchWar = async function () {
  myGameInstance.SendMessage("WarManager", "onWarData", JSON.stringify(building_data));
}

window.userdata = async function () {

  let result = await wallet.viewMethod({
    contractId:ContractAddress, 
    method:"get_holding", 
    args:{
      id: wallet.accountId
    }
  })
  
  window.townhall = result[1];
  window.miner = result[0];
  
  for(let i= 2; i<result.length; i++){
    window[graphkey[i]] = result[i];
  }
  
  let result1 = await wallet.viewMethod({
    contractId:aureusContractAddress, 
    method:"ft_balance_of", 
    args:{
      account_id: wallet.accountId
    }
  })
  window.aureus = result1;
  let building_data = { address: "", buil: [] }
  let result2 = await wallet.viewMethod({
    contractId:ContractAddress, 
    method:"get_map", 
    args:{
      id: wallet.accountId
    }
  })
  if(result2==""){
    window.building_data = JSON.stringify(building_data)
  }else{
    window.building_data = result2;
  }
  myGameInstance.SendMessage("RTS_Camera", "onDone");
};
