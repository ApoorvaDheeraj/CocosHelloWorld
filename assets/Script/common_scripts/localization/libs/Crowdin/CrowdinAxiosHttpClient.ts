import { CrowdinHttpClient } from "./CrowdinModels";

export class CrowdinAxiosHttpClient implements CrowdinHttpClient {


    async get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject)=>{
            cc.assetManager.loadRemote(url, { reload: true, cacheAsset: false, cacheEnabled: false }, (err:Error, data:any) => {
                if (err) {
                    console.error("Error loading data:", err);
                    reject(err);
                    return;
                }
                console.log(`Data Loaded AxioClient ${JSON.stringify(data.json)}`);
                resolve(data.json);   
            });
        });
    }
}
