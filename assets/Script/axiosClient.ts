import { HttpClient } from './model';

export class AxiosHttpClient implements HttpClient {

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
        })
    }
}
