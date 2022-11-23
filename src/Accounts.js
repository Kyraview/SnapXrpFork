const xrpl = require("xrpl")
const bip39 = require('bip39')
import {getBIP44AddressKeyDeriver} from "@metamask/key-tree"
export default class Accounts{

    constructor(wallet){
        this.wallet = wallet;
    }

    static async generateAccount(path){
        const coinTypeNode = await wallet.request({
            method: 'snap_getBip44Entropy',
            params: {
                coinType: 144,
            },
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
          let mnemonic = bip39.entropyToMnemonic(entropy).toString()
          return xrpl.Wallet.fromMnemonic(mnemonic);
    }

    async createAccount(name, firstAccount=false){
        const state = {}
        let path;
        if(!firstAccount){
            const permaState = await this.wallet.request({
                method: 'snap_manageState',
                params: ['get'],
            });
            path = Object.keys(permaState.accounts).length;
            state.accounts = permaState.accounts;
        }
        else{
            path = 0;
            state.accounts = {}
        }
        const xrplWallet = await Accounts.generateAccount(path);
        const newAccount = {}
        newAccount.name = name;
        newAccount.address = xrplWallet.address;
        newAccount.path = path;
        newAccount.type = "generated";
        state.accounts[newAccount.address] = newAccount;
        state.currentAccount = newAccount;
        this.accounts = await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', state],
        });
        return xrplWallet;
    }

    async getCurrentAccount(){
        this.accounts = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
        if(this.accounts === null){
            //create first account
            return await this.createAccount("Account 1", true);
        }
        this.currentAccount = this.accounts.currentAccount;
        if(this.currentAccount.type === 'generated'){
            return await Accounts.generateAccount(this.currentAccount.path)
        }
        
    }


}