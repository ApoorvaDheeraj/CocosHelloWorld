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
                    console.error('Error loading data:', err);
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

                if (xhr.readyState != 4) {
                    return;
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log("Dheeraj: onreadystatechange" + xhr.response);
                    resolve(xhr.response);
                    return;
                } else {
                    console.error("Dheeraj: onreadystatechange Error loading data: "+ xhr.statusText);
                    reject(new Error(xhr.statusText));
                    return;
                }
            }
    
            xhr.onerror = () => {
                console.error('Network error');
                reject(new Error('Network error'));
            };

            xhr.responseType = 'json';
            xhr.open("GET", url, true);
            xhr.send();
        });
    }
}
