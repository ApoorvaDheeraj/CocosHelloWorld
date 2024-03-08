
import OtaClient from "./OtaClient";
import { HttpClient } from "./model";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    private crowdinAxios:OtaClient = new OtaClient("fb8fb0cf928df2131f4bfa9n010");

    start () {
        // init logic
        this.label.string = this.text
        this.fetchData();

    }

    async fetchData() {
       if(this.crowdinAxios){
            this.crowdinAxios.getStrings().then(res => console.log(`Sucess Promise : ${JSON.stringify(res)}`)).catch(error => console.error(`Error Fetch : ${error}`))
       }else{
            console.error(`CrowdingAxio Object is Null`);
       }
    }
}
