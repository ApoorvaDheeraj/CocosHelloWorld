import { CrowdinHttpClient } from './CrowdinModels';

export class CrowdinAssetFetcher implements CrowdinHttpClient {
    /**
     * Asynchronously fetches data from the specified URL using cc.assetManager.loadRemote,
     * Not using cc.loader.load because it is deprecated
     * @param url The URL to fetch data from.
     * @returns A Promise that resolves with the fetched data.
     */
    async get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            cc.assetManager.loadRemote(url, { reload: true, cacheAsset: false, cacheEnabled: false }, (err, data: any) => {
                if (err) {
                    console.error('Error loading data:', err);
                    reject(err);
                    return;
                }
                resolve(data.json);
            });
        });
    }
}
