
import { HttpClient } from "./model";
import { AxiosHttpClient } from "./axiosClient";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private URL:string = "https://distributions.crowdin.net/fb8fb0cf928df2131f4bfa9n010/manifest.json";
    private testURL = 'http://quotes.toscrape.com/random'
    private crowdinAxios:HttpClient = new AxiosHttpClient();

    start () {
        // init logic
        this.label.string = this.text
        this.fetchData(this.URL);

    }

    async fetchData(url: string, options?: RequestInit) {
       if(this.crowdinAxios){
            this.crowdinAxios.get(url).then(res => console.log(`Sucess Promise : ${JSON.stringify(res)}`)).catch(error => console.error(`Error Fetch : ${error}`))
       }else{
            console.error(`CrowdingAxio Object is Null`);
       }
    }
}
