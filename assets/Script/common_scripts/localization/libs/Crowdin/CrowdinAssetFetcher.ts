import { CrowdinHttpClient } from './CrowdinModels';

export class CrowdinAssetFetcher implements CrowdinHttpClient {
    /**
     * Asynchronously fetches data from the specified URL using cc.assetManager.loadRemote,
     * Not using cc.loader.load because it is deprecated
     * @param url The URL to fetch data from.
     * @returns A Promise that resolves with the fetched data.
     * cc.assetManager.loadRemote('http://www.cloud.com/test3', { ext: '.png' }, (err, texture) => console.log(err));
     */
    async get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            cc.assetManager.loadRemote(url, {ext:'.json'}, (err : Error, data:any) => {
                if (err) {
                    console.error("CL: Error loading data:" + JSON.stringify(err));
                    reject(err);
                    return;
                }
                resolve(data.json);
            });
        });
    }

    async getFileUsingXMLHttpRequest<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onreadystatechange = ()=> {
                console.debug("CL: Status Code = " + xhr.status + " Response readyState" + xhr.readyState)
                if (xhr.readyState != 4) {
                    return;
                }
                console.debug("CL: Status Code = " + xhr.status + " Response readyState" + xhr.readyState );
                console.debug("Response Json " + JSON.stringify(xhr.response));
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.debug("Dheeraj: onreadystatechange" + xhr.response);
                    resolve(xhr.response);
                    return;
                } else {
                    console.error("CL: Dheeraj: onreadystatechange Error loading data: "+ xhr.statusText);
                    reject(new Error(xhr.statusText));
                    return;
                }
            }
    
            xhr.onerror = () => {
                console.error('CL: Network error');
                reject(new Error('CL: Network error'));
            };

            xhr.responseType = 'json';
            xhr.open("GET", url, true);
            xhr.send();
        });
    }
}
