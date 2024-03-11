import { CrowdinLangManifest, CrowdinLangStrings } from "../libs/Crowdin/CrowdinModels";
import { CloudLocsCacheKeys, LocalizationCachedData } from "../models/CloudLocalizationInterfaces";
import { LocStrings, LocStringsTable } from "../models/LocStringsData";
import { CacheHelperWithCCLocalStorage } from "./CacheHelperWithCCLocalStorage";
import { CloudLocCacheHelper } from "./CloudLocCacheHelper";

import CloudLocalizationController from "./CloudLocalizationController";
/**
 * CloudLocalizationCacheHandler to cache LocalizationData of Crowdin translation data
 */

export class CloudLocalizationCacheHandler {
    private cacheTimeStampsOfLocFiles: LocalizationCachedData = {};
    private localizationStrings: LocStringsTable = {};

    private cacheHelper = new CloudLocCacheHelper();

    constructor(cacheDir: string) {
        // Initialize cache directory and load cache timestamps
        let initDire = this.cacheHelper.initCache(cacheDir);
        this.cacheHelper.initCacheProperties();
        this.cacheTimeStampsOfLocFiles = JSON.parse(this.getCachedTimeStampsForFile()) ?? "{}";

        console.log(`${CloudLocalizationController.CL_LOG_KEY} CCHandler : construtor: initDir = ${initDire}`);
     

        this.readLocalCachedData();
    }
    private getCachedTimeStampsForFile(): string {
        if (cc.sys.isNative) {
            return this.cacheHelper.getDataFromCacheFile(`${CloudLocsCacheKeys.LocsTime}.json`);
        } else {
            return CacheHelperWithCCLocalStorage.GetStringByCCFile(CloudLocsCacheKeys.LocsTime);
        }
    }

    private updateCacheTimestamps() {
        if (cc.sys.isNative) {
            const fileName = `${CloudLocsCacheKeys.LocsTime}.json`;
            const fileContent = JSON.stringify(this.cacheTimeStampsOfLocFiles);
            let isWriteSucced = this.cacheHelper.writeDataToCacheFile(fileName, fileContent);
        } else {
            CacheHelperWithCCLocalStorage.SaveStringByCCFile(CloudLocsCacheKeys.LocsTime, JSON.stringify(this.cacheTimeStampsOfLocFiles));
        }
    }

    /**
     * Save localization strings to cache
     */
    private saveLocalizationStrings() {
        for (const langCode in this.localizationStrings) {
            if (this.localizationStrings.hasOwnProperty(langCode)) {
                const fileName = `${langCode}.json`;
                const fileContent = JSON.stringify(this.localizationStrings[langCode]);
                let isWriteSucced = this.cacheHelper.writeDataToCacheFile(fileName, fileContent);
                console.log(`${CloudLocalizationController.CL_LOG_KEY} writeDataToCacheFile: ${isWriteSucced} fileName = ${fileName} content = ${fileContent}`);
            }
        }
    }

    private readLocalCachedData() {
        console.log(`${CloudLocalizationController.CL_LOG_KEY} CCHandler : CacheTimesStamp = ${JSON.stringify(this.cacheTimeStampsOfLocFiles)}`);
        for (const langCode in this.cacheTimeStampsOfLocFiles) {
            if (this.cacheTimeStampsOfLocFiles.hasOwnProperty(langCode)) {
                // console.log(`${CloudLocalizationController.CL_LOG_KEY} readLocalCachedData = In If Condition ${langCode}`);
                const fileName = `${langCode}.json`;
                let fileContent = this.cacheHelper.getDataFromCacheFile(fileName);
                if (fileContent) {
                    const parsedContent: LocStrings = JSON.parse(fileContent);
                    this.localizationStrings[langCode] = parsedContent;
                } else {
                    console.log(`${CloudLocalizationController.CL_LOG_KEY} readLocalCachedData: File Content Not Found = ${fileName}`);
                }
            }else{
                // console.log(`${CloudLocalizationController.CL_LOG_KEY} readLocalCachedData = In Else Condition ${langCode}`);
            }
        }
        // console.log(`${CloudLocalizationController.CL_LOG_KEY} readLocalCachedData: localizationStrings = ${JSON.stringify(this.localizationStrings)}`);
    }

    /**
     * Get the last modified time of a file
     * @param locFileName The name of the file
     * @returns The last modified time of the file
     */
    getLastModifiedTimeOfFile(locFileName: string): number {
        return this.cacheTimeStampsOfLocFiles[locFileName] || 0;
    }

    /**
     * @returns The last modified time of the cached Dir
     */
    getLastModifiedTimeOfCacheDir(): number {
        return this.cacheHelper.getLastModifiedTimeOfCacheDir();
    }

    /**
     * Update the last modified time of localization file if CrowdIn timestamp is greater than the local saved time
     * @param fileName The loc file
     * @param crowdinTimestamp The timestamp from CrowdIn
     * @returns True if the timestamp is updated, false otherwise
     */
    updateLastModifiedTime(fileName: string, crowdinTimestamp: number): boolean {
        if (crowdinTimestamp > (this.cacheTimeStampsOfLocFiles[fileName] || 0)) {
            this.cacheTimeStampsOfLocFiles[fileName] = crowdinTimestamp;
            this.updateCacheTimestamps();
            return true;
        }
        return false;
    }

    /**
     * Assign CrowdIn strings to localization strings
     * @param crowdinStrings The localization strings from CrowdIn
     */
    assignCrowdinStringsToLocStrings(crowdinStrings: CrowdinLangStrings) {
        this.localizationStrings = {};
        for (const languageCode in crowdinStrings) {
            if (crowdinStrings.hasOwnProperty(languageCode)) {
                this.localizationStrings[languageCode] = crowdinStrings[languageCode];
            }
        }
        this.saveLocalizationStrings();
    }

    setLocalLocalizationManifestObj(manifestObj: CrowdinLangManifest) {
        this.cacheHelper.localLocsManifestObject = manifestObj;
        console.log(`${CloudLocalizationController.CL_LOG_KEY} CCHandler : setLocalLocalizationManifestObj: Update = ${JSON.stringify(this.cacheHelper.localLocsManifestObject)}`);
    }

    getLocalLocalizationManifestObj(): CrowdinLangManifest | null {
        return this.cacheHelper.localLocsManifestObject;
    }

    getSavedLocalizationStringTable(): LocStringsTable {
        if (this.localizationStrings && Object.keys(this.localizationStrings).length > 0) {
            console.log(`${CloudLocalizationController.CL_LOG_KEY} getSavedLocalizationStringTable: ${Object.keys(this.localizationStrings).length}`);
            return this.localizationStrings;
        }
        return {};
    }

    /**
     * Clears the unused localization files from cache
     * Clears the cached manifest or last modified time from cache
     */
    clearUnusedLocFiles() {
        // Implementation to clear unused localization files
        if (cc.sys.isNative) {
            for (const langCode in this.cacheTimeStampsOfLocFiles) {
                if (this.cacheTimeStampsOfLocFiles.hasOwnProperty(langCode)) {
                    const fileName = `${langCode}.json`;
                    if (cc.sys.isNative) {
                        this.cacheHelper.deleteFileFromCache(fileName);
                    } else {
                        CacheHelperWithCCLocalStorage.RemoveStringByCCFile(fileName);
                    }
                }
            }
            this.cacheHelper.deleteFileFromCache(`${CloudLocsCacheKeys.CacheManifestValuesKey}.json`);
            this.cacheHelper.removeCachedDirectory();
        } else {
            console.log(`Cloud Localization File Removed From Cache`);
            CacheHelperWithCCLocalStorage.RemoveStringByCCFile(CloudLocsCacheKeys.LocsTime);
            CacheHelperWithCCLocalStorage.RemoveStringByCCFile(CloudLocsCacheKeys.CacheManifestValuesKey);
        }
    }
}
