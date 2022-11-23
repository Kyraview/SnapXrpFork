export class SocketClient{
    constructor(url){
        this.socket = new WebSocket(url);
        this.open = false;
        
    }


    async waitForOpen(){
        const resolveFunc = (resolve)=>{
            
            const subFunction = ()=>{
                this.open = true;
                resolve(true)
            }
            this.socket.addEventListener('open', subFunction.bind(this));
            
            
        }
        return new Promise(resolveFunc.bind(this))

    }



    async send(json){
        json = JSON.stringify(json);
        if(!this.open){
            await this.waitForOpen()
        }
        const resolveFunc = (resolve) =>{
            let index = 0;
            this.socket.addEventListener('message', function (event){
                console.log("event is")
                console.log(event);
                console.log("event.data is ")
                console.log(event.data);
                if(index === 1){
                    resolve(event.data);
                }
                index +=1
            });
            this.socket.send(json)
        }
        return new Promise(resolveFunc.bind(this))
    }

    async getAccountInfo(address){
        const json = {
            "id": 2,
            "command": "account_info",
            "account": address,
            "strict": true,
            "ledger_index": "current",
            "queue": true
          }
        const response = await this.send(json)
        return response;
    }
    async getXRPBalance(address){
        const info = await this.getAccountInfo(address)
        return info.result.account_data.Balance
    }
}