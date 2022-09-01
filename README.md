# snapXRPL
## XRP on metamask
### [https://snapxrp.deatheye.repl.co/](https://snapxrp.deatheye.repl.co/)

<hr/>

## end useage
to use snapXRPL you need metamask flask, which is the developer version of metamask, and may require that you uninstall the consumer version of metamask. Once metamask flask is installed it's as simple as clicking connect and following the propts on the [demo](https://snapxrp.deatheye.repl.co/).

## developer useage
Dapp developers are able to access snapXRPL to proform wallet actions through the use of rpc methods, that can be called without install(provided that the dapp end user has metamask flask).
In the future we will create an SDK to make handling wallet functionality easy.
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
      method: 'getBalance'
   }]
})
```
### send xrp
```javascript
const response = await ethereum.request({
   method: 'wallet_invokeSnap',
   params: ['npm:snap-xrp', {
      method: 'transfer',
      params:{
      to: recepientAddress, //string
      amount: Amount //integer number of drops
      }
   }
   ]
})
```

## details
We hope to have this available on the consumer version of metamask before the end of the year, as well as many many more features.
At this time all of this only works on testnet but that can change.

