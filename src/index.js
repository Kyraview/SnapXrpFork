const xrpl = require("xrpl")
import Accounts from './Accounts';
import Utils from './Utils';
module.exports.onRpcRequest = async ({ origin, request }) => {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  const mnemonic = await Accounts.getBip39Mnemonic(3);
  const xrpWallet = xrpl.Wallet.fromMnemonic(mnemonic);
  
  switch (request.method) {
    case "getAddress":
      return xrpWallet.address;
    case "getBalance":
      await client.connect()
      const info = await client.getBalances(xrpWallet.address)
      return info;
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
