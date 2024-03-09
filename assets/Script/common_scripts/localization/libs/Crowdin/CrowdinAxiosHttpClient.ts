import { CrowdinHttpClient } from "./CrowdinModels";

export class CrowdinAxiosHttpClient implements CrowdinHttpClient {


    async get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject)=>{
            cc.assetManager.loadRemote(url, (err, data:any) => {
                if (err) {
                    console.error("Error loading data:", err);
                    reject(err);
                    return;
                }
                resolve(data.json);   
            });
        });
    }
}
