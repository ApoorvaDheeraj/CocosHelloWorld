import { CrowdinLangManifest } from "./CrowdinModels";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        this.label.string = this.text;
        const data = this.getData("https://distributions.crowdin.net/fb8fb0cf928df2131f4bfa9n010/content/fr-CA/stringEN.json?timestamp=1709654183").then(respon => {
            console.log(respon);
        });
        
    }
    

    async getData<T>(url:string):Promise<T>{
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            return data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}
