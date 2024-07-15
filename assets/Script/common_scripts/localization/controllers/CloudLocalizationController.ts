import CrowdinOtaClient from '../libs/Crowdin/CrowdinOtaClient';
import { CloudLocalizationCacheHandler } from './CloudLocalizationCacheHandler';
import { CrowdinLangStrings } from '../libs/Crowdin/CrowdinModels';
import { CloudLocData } from "../models/CloudLocalizationInterfaces";

/**
 * CloudLocalizationController to retrieve data from Crowdin and manage localization cache.
 */
export class CloudLocalizationController {
    private crowdinOtaClient: CrowdinOtaClient;
    private cloudLocCacheHandler: CloudLocalizationCacheHandler;

    constructor() {
        // Initialize CloudLocalizationCacheHandler with the cache directory
        this.cloudLocCacheHandler = new CloudLocalizationCacheHandler();

        // Initialize CrowdinOtaClient
        this.crowdinOtaClient = new CrowdinOtaClient("32d445f380c11cae042efa9n010");
    }

    isCacheAvailable(): boolean {
        return this.cloudLocCacheHandler.isCacheAvailable();
    }

    /**
     * Fetches cloud localization data from Crowdin.
     * @returns A promise that resolves with the fetched localization data, or null if the Crowdin OTA Client is unavailable.
     */
    async getLocalizationData(): Promise<CloudLocData | null> {
        const manifestUpdated = await this.isManifestUpdated();

        if (manifestUpdated) {
            console.log("Dheeraj: From Crowdin");
            const locData = await this.getLocalizationContent();
            return {
                data: locData,
                isLiveData: true
            }
        } else {
            console.log("Dheeraj: From Cache");
            const cachedData = this.getCachedLocalizationData();

            if (cachedData != null) {
                return {
                    data: cachedData,
                    isLiveData: false
                };
            }

            const locData = await this.getLocalizationContent();
            return {
                data: locData,
                isLiveData: true
            }
        }
    }

    getCachedLocalizationData(langCode?: string): CrowdinLangStrings | null {
        const cachedLocsTable = this.cloudLocCacheHandler.getSavedLocalizationStringTable(langCode);

        if (cachedLocsTable != null) {
            return cachedLocsTable;
        }

        return null;
    }

    isLanguageCached(langCode: string): boolean {
        const localManifest = this.cloudLocCacheHandler.localLocsManifestObject;

        if (!localManifest) {
            return false;
        }

        for (let mapping of Object.values(localManifest.language_mapping)) {
            if (mapping.name == langCode) {
                return true;
            }
        }

        return false;
    }

    private async isManifestUpdated(): Promise<boolean> {
        const cloudLocsManifestObj = await this.crowdinOtaClient.manifest;
        const currManifestTimestamp = cloudLocsManifestObj?.timestamp ?? 0;
        const localManifestTimestamp = this.cloudLocCacheHandler.localLocsManifestObject?.timestamp ?? 0;
        if (currManifestTimestamp > localManifestTimestamp) {
            this.cloudLocCacheHandler.localLocsManifestObject = cloudLocsManifestObj;
            return true;
        }
        return false;
    }

    /**
     * Fetches localization content from Crowdin and saves it in the cache.
     * @returns A promise resolving to the fetched localization strings.
     */
    private async getLocalizationContent(): Promise<CrowdinLangStrings | null> {
        try {
            let locStrings = await this.crowdinOtaClient.getStrings();
            const mappingSuccess  = this.updateLangCodeForLocContent(locStrings);
            if (!mappingSuccess) {
                return null;
            }
            this.cloudLocCacheHandler.saveLocalizationStrings(locStrings);
            return locStrings;
        } catch (error) {
           console.error("load_crowdin_loc_failed", { error: error });
        }
    }

    private updateLangCodeForLocContent(locStrings: CrowdinLangStrings): boolean {
        const allLangCodes = [...Object.keys(locStrings)];
        let missingMappingCode: Array<string> = [];
        for (let langCode of allLangCodes) {
            const langMap = this.cloudLocCacheHandler.localLocsManifestObject.language_mapping;
            if (!langMap.hasOwnProperty(langCode)) {
                missingMappingCode.push(langCode);
                continue;
            }
            const mappingCode = langMap[langCode].name;
            delete Object.assign(locStrings, {[mappingCode]: locStrings[langCode]})[langCode];
        }

        if (missingMappingCode.length > 0) {
            console.error("crowdin_mapping_failed", {langCodes: JSON.stringify(missingMappingCode)});
            return false;
        }

        return true;
    }
}
