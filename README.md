# SnapXRPL
## XRP on MetaMask
### [https://snapxrp.deatheye.repl.co/](https://snapxrp.deatheye.repl.co/)

<hr/>

## end useage
to use SnapXRPL you need MetaMask Flask, which is the developer version of MetaMask, and may require that you uninstall the consumer version of MetaMask. Once MetaMask Flask is installed it's as simple as clicking connect and following the prompts on the [demo](https://snapxrp.deatheye.repl.co/).

## developer useage
Dapp developers are able to access SnapXRPL to perform wallet actions through the use of RPC methods, that can be called without install (provided that the Dapp end user has MetaMask Flask).
before any snap-xrp methods are called snap xrp must first be initalized.
This is done by calling the below code. This will enable the snap, and install the snap if it isn't already installed.
```javascript
   ethereum.request({
      method: 'wallet_enable',
      params: [{
         wallet_snap: { ['npm:snap-xrp']: {} },
      }]
   })

```
In the future we will create an SDK to make handling wallet functionality easy.
These all take the form. 
```javascript
ethereum.request({ //etherem is a global value injected by metamask
   method: 'wallet_invokeSnap', //this tells metamask flask that you want to call a snap
   params: [ 
      'npm:snap-xrp', //this tells metamask which snap to invoke
      { //request object to be sent to snap
         method: 'method name' // tells snap-xrp which method to call
         testnet?: true||false // optional parameter to use testnet if ommited mainnet is assumed
         params: { //some methods require additional params that serve as arguments for a given method

         }
      }
   ]
})
```
<hr/>

### get wallet address
```javascript
ethereum.request({
   method: 'wallet_invokeSnap',
   params: ['npm:snap-xrp', {
      method: 'getAddress'
   }]
})
```
### get wallet balance
```javascript
const response = await ethereum.request({
   method: 'wallet_invokeSnap',
   params: ['npm:snap-xrp', {
      method: 'getBalance',
      testnet?:true||false
   }]
})
```
### send xrp
```javascript
const response = await ethereum.request({
   method: 'wallet_invokeSnap',
   params: ['npm:snap-xrp', {
      method: 'transfer',
      testnet?:true||false,
      params:{
      to: recepientAddress, //string
      amount: Amount //integer number of drops
      }
   }
   ]
})
```

## details
We hope to have this available on the consumer version of MetaMask before the end of the year, as well as many many more features.
At this time all of this only works on testnet but that can change.

