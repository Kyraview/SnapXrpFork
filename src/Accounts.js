const xrpl = require("xrpl")
const bip39 = require('bip39')
import {getBIP44AddressKeyDeriver} from "@metamask/key-tree"
export default class Accounts{

    static async getBip39Mnemonic(path){
        console.log("here in generate Account")
        const coinTypeNode = await wallet.request({
            method: 'snap_getBip44Entropy_144',
          });
        
          //dirive private key using metamask key tree
          // Get an address key deriver for the coin_type node.
          // In this case, its path will be: m / 44' / 60' / 0' / 0 / address_index
          // Alternatively you can use an extended key (`xprv`) as well.
          const addressKeyDeriver = await getBIP44AddressKeyDeriver(coinTypeNode);
  
          //createKeyPair        
          const keypair = (await addressKeyDeriver(path));
          //create Entropy from private key so we can create a mnemonic
          const entropy = keypair.privateKeyBuffer.toString('hex')
          let xrpMnemonic = bip39.entropyToMnemonic(entropy)
          return xrpMnemonic.toString();
    }
}