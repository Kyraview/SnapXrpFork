const xrpl = require("xrpl")
import Accounts from './Accounts';
import Utils from './Utils';
module.exports.onRpcRequest = async ({ origin, request }) => {
  let client;
  if(request.testnet){
    client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  }
  else{
    client = new xrpl.Client("wss://xrplcluster.com/");
  }
  const accounts = new Accounts(wallet);
  const xrpWallet = await accounts.getCurrentAccount();
  
  switch (request.method) {
    case "getAddress":
      
      return xrpWallet.address;
    case "getBalance":
      await client.connect()
      try{
        return await client.getBalances(xrpWallet.address)
      }
      catch{
        return [{currency: 'XRP', value: '0'}]
      }
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
      
      const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": address,
        "Amount": amount,
        "Destination": to,
      })

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
