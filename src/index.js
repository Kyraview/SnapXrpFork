const xrpl = require("xrpl")
import Accounts from './Accounts';
import { SocketClient } from './socketClient';
import Utils from './Utils';

module.exports.onRpcRequest = async ({ origin, request }) => {
  let client;
  let simpleClient;
  if(request.params && request.params.testnet){
    console.log("here");
    client = new xrpl.Client("wss://xrplcluster.com/")
    simpleClient = new SocketClient("wss://s.altnet.rippletest.net/")
    console.log("terminated")
  }
  else{
    client = new xrpl.Client("wss://s.altnet.rippletest.net/");
    simpleClient = new SocketClient("wss://xrplcluster.com/")
  }
  const accounts = new Accounts(wallet);
  const xrpWallet = await accounts.getCurrentAccount();
  console.log(`request ${request.method}`)
  
  switch (request.method) {
    case "getAddress":
      
      return xrpWallet.address;
    case "getBalance":
      
      //const balance = await simpleClient.getXRPBalance(xrpWallet.address)
      console.log("here");
      await client.connect()
      const response = await client.request({
        "command": "account_info",
        "account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
        "ledger_index": "validated"
      })
      return response;
        
      
    case "createAccount":
      return (await accounts.createAccount(request.params.name)).address;
    case "getTransactions":
      return ""
    case "transfer":
      await client.connect()
      const address = xrpWallet.address
      const amount = String(request.params.amount)
      const to = String(request.params.to)
      const confirmation = await Utils.sendConfirmation("Send Funds?", "confirm to send XRP", "would you like to send "+xrpl.dropsToXrp(amount));
      if(!confirmation){
        throw "user Rejected Request"
      }
      console.log("about to prepair");
      const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": address,
        "Amount": amount,
        "Destination": to,
      })
      console.log("prepaired");
      

      const signed = xrpWallet.sign(prepared);
      const txn = await client.submitAndWait(signed.tx_blob).then(
        async(tx)=>{
          Utils.notify("transaction submitted"); 
          return tx
        }
      ).catch(
        async(err)=>{
          Utils.notify("transaction failure"); 
          return err;
        }
      )
      return txn
      
    case 'hello':
      return 'world'
    default:
      throw new Error('Method not found.');
  }
};
