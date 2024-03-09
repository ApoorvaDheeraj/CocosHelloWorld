/**
 * CloudLocalizationController to retrieve data from Crowdin and manage localization cache.
 */
import CrowdinOtaClient from '../libs/Crowdin/CrowdinOtaClient';
import { CloudLocalizationCacheHandler } from './CloudLocalizationCacheHandler';
import { CrowdinLangManifest, CrowdinLangStrings } from '../libs/Crowdin/CrowdinModels';
import { CloudLocsCacheKeys, CrowdinLangCode, LANGUAGE_TYPE } from '../models/CloudLocalizationInterfaces';
import { LocStringsTable } from '../models/LocStringsData';

export default class CloudLocalizationController {
    private crowdinOtaClient: CrowdinOtaClient;
    private cloudLocCacheHandler: CloudLocalizationCacheHandler;
    private cloudLocsManifestObj: CrowdinLangManifest = null;
    private fetchedLocStrings: CrowdinLangStrings = {};
    private cloudLocsLastModifiedTime: number = 0;
    private cacheDirectory: string;

    // For Log Purpose
    public static CL_LOG_KEY: string = 'CCL';

    constructor(cacheDirectory?: string) {
        // Set the cache directory or use the default value
        this.cacheDirectory = cacheDirectory || CloudLocsCacheKeys.CachedDirName;
        // Initialize CloudLocalizationCacheHandler with the cache directory
        this.cloudLocCacheHandler = new CloudLocalizationCacheHandler(this.cacheDirectory);
        // Initialize CrowdinOtaClient
        this.crowdinOtaClient = new CrowdinOtaClient("fb8fb0cf928df2131f4bfa9n010");
    }

    /**
     * Fetches cloud localization data from Crowdin.
     * Checks if the data needs to be updated based on timestamps.
     */
    public async fetchCloudLocalizationData(): Promise<CrowdinLangStrings | null> {
        if (this.crowdinOtaClient) {
            return await this.fetchAndIterateCloudLocalizationData();
        } else {
            console.error('Unable to get Crowdin OTA Client');
            return null;
        }
    }

    /**
     * Fetches cloud localization data from Crowdin and returns it.
     * Checks if the data needs to be updated based on timestamps.
     * If the timestamp is not updated, returns the cached data.
     * If the cache is empty, fetches new data from Crowdin.
     * @returns A promise resolving to the cloud localization data.
     */
    private async fetchAndIterateCloudLocalizationData(): Promise<CrowdinLangStrings> {
        // Fetch the timestamp of cloud localization files
        await this.fetchManifestAndTimeStamp();

        // Check if cloud localization files need to be updated
        if (this.cloudLocsLastModifiedTime > this.cloudLocCacheHandler.getLastModifiedTimeOfCacheDir()) {
            // If manifest is not updated, fetch new Crowdin data and return
            console.log(
                `${CloudLocalizationController.CL_LOG_KEY} Manifest Not Updated: Fetching Crowdin Data and returning`
            );
            this.cloudLocCacheHandler.clearUnusedLocFiles();
            this.getManifestContent();
            return this.getLocalizationContent();
        } else {
            // If manifest is already updated, return cached data
            console.log(`${CloudLocalizationController.CL_LOG_KEY} Manifest Already Updated: Returning Cached Data`);

            // Get cached localization content from CloudLocalizationCacheHandler
            const cachedLocsTable = this.cloudLocCacheHandler.getSavedLocalizationStringTable();

            // If cached data is available and not empty, return it
            if (cachedLocsTable && Object.keys(cachedLocsTable).length > 0) {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} getSavedLocalizationStringTable:Cached Data is returned`)
                return cachedLocsTable;
            }

            // If cached data is empty, fetch new data from Cloud and return it
            return this.getLocalizationContent();
        }
    }

    /**
     * Fetches the manifest from Crowdin and updates the last modified timestamp of cloud localization files.
     */
    private async fetchManifestAndTimeStamp() {
        // Fetch the manifest and update last modified timestamp of cloud localization files
        this.cloudLocsManifestObj = await this.crowdinOtaClient.manifest;
        this.cloudLocsLastModifiedTime = this.cloudLocsManifestObj?.timestamp || 0;
    }

    /**
     * Fetches the manifest content and updates the cache with the last modified timestamp.
     */
    private async getManifestContent() {
        if (this.cloudLocsManifestObj) {
            this.cloudLocsManifestObj = await this.crowdinOtaClient.manifest;
        }
        const manifestContent = this.cloudLocsManifestObj.content;
        if (manifestContent) {
            for (const contentFile in manifestContent) {
                this.cloudLocCacheHandler.updateLastModifiedTime(contentFile, this.cloudLocsLastModifiedTime);
            }
        }
        this.cloudLocCacheHandler.setLocalLocalizationManifestObj(this.cloudLocsManifestObj);
    }

    /**
     * Fetches localization content from Crowdin and saves it in the cache.
     * @returns A promise resolving to the fetched localization strings.
     */
    private async getLocalizationContent(): Promise<CrowdinLangStrings> {
        // Fetch localization content from Crowdin and save it in the cache
        try {
            console.log(`${CloudLocalizationController.CL_LOG_KEY} getLocalizationContent:fetch Localization Content from Crowdin`)
            this.fetchedLocStrings = await this.crowdinOtaClient.getStrings();
            this.cloudLocCacheHandler.assignCrowdinStringsToLocStrings(this.fetchedLocStrings);
            return this.fetchedLocStrings;
        } catch (error) {
            console.error(error);
        }
    }

    getLanguageAccToCrowdinLangCode(languageType: string): CrowdinLangCode {
        switch (languageType) {
            case LANGUAGE_TYPE.zh_CN:
                return CrowdinLangCode.Chinese;
            case LANGUAGE_TYPE.en_US:
                return CrowdinLangCode.English;
            case LANGUAGE_TYPE.vi_VN:
                return CrowdinLangCode.Vietnamese;
            case LANGUAGE_TYPE.th_PH:
                return CrowdinLangCode.Thai;
            case LANGUAGE_TYPE.pt_BR:
                return CrowdinLangCode.Portuguese_BR;
            case LANGUAGE_TYPE.fr_CA:
                return CrowdinLangCode.Canada_FR;
            case LANGUAGE_TYPE.es_MX:
                return CrowdinLangCode.Spanish_MX;
            case LANGUAGE_TYPE.ja_JP:
                return CrowdinLangCode.Japanese;
            case LANGUAGE_TYPE.ko_KR:
                return CrowdinLangCode.Korean;
            default:
                return CrowdinLangCode.English;
        }
    }
}
