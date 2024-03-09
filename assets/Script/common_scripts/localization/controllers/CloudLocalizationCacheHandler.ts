import { CrowdinLangManifest, CrowdinLangStrings } from '../libs/Crowdin/CrowdinModels';
import { CloudLocsCacheKeys, LocalizationCachedData } from '../models/CloudLocalizationInterfaces';
import { LocStrings, LocStringsTable } from '../models/LocStringsData';

import CloudLocalizationController from './CloudLocalizationController';

class CloudLocCacheHelper {
    private cacheDir: string;
    private _localLocsManifestObject: CrowdinLangManifest = null;

    constructor() {
        this.localLocsManifestObject = JSON.parse(CloudLocalizationCacheHandler.GetStringByCCFile(CloudLocsCacheKeys.CacheLocsManifest));
    }

    // Getter method for localLocsManifestObject
    public get localLocsManifestObject(): CrowdinLangManifest | null {
        return this._localLocsManifestObject;
    }

    // Setter method for localLocsManifestObject
    public set localLocsManifestObject(value: CrowdinLangManifest) {
        if (value) {
            this._localLocsManifestObject = value;
            CloudLocalizationCacheHandler.SaveStringByCCFile(
                CloudLocsCacheKeys.CacheLocsManifest,
                JSON.stringify(this._localLocsManifestObject)
            );
            console.log(
                `${CloudLocalizationController.CL_LOG_KEY} : localLocsManifestObject : Set ${JSON.stringify(
                    this.localLocsManifestObject
                )}`
            );
        }
    }

    /**
     * Initializes the cache directory.
     * @param cacheDirName The name of the cache directory.
     * @returns A string indicating the result of the initialization.
     */
    initCache(cacheDirName: string, isRemoveCache?:boolean): string {
        // Check if the environment is native
        if (cc.sys.isNative) {
            // Construct the cache directory path
            this.cacheDir = `${jsb.fileUtils.getWritablePath()}` + cacheDirName;
            console.log(`${CloudLocalizationController.CL_LOG_KEY} Cached Dir = ${this.cacheDir}`);

            // Check if the cache directory already exists
            if (!jsb.fileUtils.isDirectoryExist(this.cacheDir)) {
                return jsb.fileUtils.createDirectory(this.cacheDir);
            }
            return 'Directory Already Exists';
        }
        return '';
    }

    /**
     * Removes the cached directory.
     * @returns A boolean indicating whether the removal was successful.
     */
    removeCachedDirectory(): boolean {
        // Check if the environment is native
        if (cc.sys.isNative) {
            // Check if the cache directory exists
            if (jsb.fileUtils.isDirectoryExist(this.cacheDir)) {
                console.log(
                    `${CloudLocalizationController.CL_LOG_KEY} removeCachedDirectory: File Found = ${this.cacheDir}`
                );
                return jsb.fileUtils.removeDirectory(this.cacheDir);
            }else{
                console.log(`${CloudLocalizationController.CL_LOG_KEY} removeCachedDirectory: File NOT Found = ${this.cacheDir}`)
            }
            return false;
        }
    }

    /**
     * Deletes a file from the cache directory.
     * @param fileName The URL of the file to delete.
     * @returns A boolean indicating whether the deletion was successful.
     */
    deleteFileFromCache(fileName: string): boolean {
        // Check if the environment is native
        const filePath = this.cacheDir + `/${fileName}`;
        if (cc.sys.isNative) {
            // Check if the file exists in the cache directory
            if (jsb.fileUtils.isFileExist(filePath)) {
                console.log(
                    `${CloudLocalizationController.CL_LOG_KEY} deleteFileFromCache: File Found = ${filePath}`
                );
                return jsb.fileUtils.removeFile(filePath);
            }else {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} deleteFileFromCache: File NOT Found = ${filePath}`)
            }
            return false;
        }
    }

    /**
     * Writes data to a cache file.
     * @param fileName The name of the cache file.
     * @param fileContent The content to write to the cache file.
     * @returns A boolean indicating whether the writing was successful.
     */
    writeDataToCacheFile(fileName: string, fileContent: string): boolean {
        const cachedFileName = this.cacheDir + `/${fileName}`;

        // For testing in browser Using cv.tool
        // CloudLocalizationCacheHandler.SaveStringByCCFile(cachedFileName, fileContent);

        if (cc.sys.isNative) {
            console.log(
                `${CloudLocalizationController.CL_LOG_KEY} writeDataToCacheFile: cacheFilePath = ${cachedFileName}`
            );
            return jsb.fileUtils.writeStringToFile(fileContent, cachedFileName);
        }
    }

    /**
     * Reads data from a cache file.
     * @param fileName The name of the cache file to read from.
     * @returns The content of the cache file as a string.
     */
    getDataFromCacheFile(fileName: string): string {
        const cachedFilename = this.cacheDir + `/${fileName}`;

        // For testing in browser Using cv.tool
        // return CloudLocalizationCacheHandler.GetStringByCCFile(cachedFilename);

        // Check if the environment is native
        if (cc.sys.isNative) {
            if (jsb.fileUtils.isFileExist(cachedFilename)) {
                console.log(
                    `${CloudLocalizationController.CL_LOG_KEY} getDataFromCacheFile: File Found = ${cachedFilename}`
                );
                return jsb.fileUtils.getStringFromFile(cachedFilename);
            } else {
                console.log(
                    `${CloudLocalizationController.CL_LOG_KEY} getDataFromCacheFile: FileNotExist = ${cachedFilename}`
                );
            }
        }
    }

    /**
     * Retrieves the last modified time of the cached directory from local storage.
     * @returns The last modified time of the cached directory.
     */
    getLastModifiedTimeOfCacheDir(): number {
        return this.localLocsManifestObject?.timestamp || 0;
    }
}

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
        this.cacheTimeStampsOfLocFiles = JSON.parse(CloudLocalizationCacheHandler.GetStringByCCFile(CloudLocsCacheKeys.LocsTime) ?? '{}');
		console.log(`${CloudLocalizationController.CL_LOG_KEY} CCHandler : construtor: initDir = ${initDire}`);
		console.log(`${CloudLocalizationController.CL_LOG_KEY} CCHandler : CacheTimesStamp = ${JSON.stringify(this.cacheTimeStampsOfLocFiles)}`);
		this.readLocalCachedData();
    }

    private updateCacheTimestamps() {
        CloudLocalizationCacheHandler.SaveStringByCCFile(CloudLocsCacheKeys.LocsTime, JSON.stringify(this.cacheTimeStampsOfLocFiles));
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
				// console.log(`${CloudLocalizationController.CL_LOG_KEY} writeDataToCacheFile: ${isWriteSucced} fileName = ${fileName} content = ${fileContent}`);
            }
        }
    }

	private readLocalCachedData(){
		for(const langCode in this.cacheTimeStampsOfLocFiles){
			if (this.cacheTimeStampsOfLocFiles.hasOwnProperty(langCode)) {
                const fileName = `${langCode}.json`;
                let fileContent = this.cacheHelper.getDataFromCacheFile(fileName);
				if(fileContent){
					const parsedContent: LocStrings = JSON.parse(fileContent);
					this.localizationStrings[langCode] = parsedContent;
				}else{
					console.log(`${CloudLocalizationController.CL_LOG_KEY} readLocalCachedData: File Content Not Found = ${fileName}`);
				}
				
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
     * @param fileName The name/id of the file
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
		console.log(`${CloudLocalizationController.CL_LOG_KEY} CCHandler : setLocalLocalizationManifestObj: Update = ${JSON.stringify(this.cacheHelper.localLocsManifestObject)}`)
    }

    getLocalLocalizationManifestObj(): CrowdinLangManifest | null {
        return this.cacheHelper.localLocsManifestObject;
    }

	getSavedLocalizationStringTable(): LocStringsTable{
		if (this.localizationStrings && Object.keys(this.localizationStrings).length > 0) {
            console.log(`${CloudLocalizationController.CL_LOG_KEY} getSavedLocalizationStringTable: ${Object.keys(this.localizationStrings).length}`)
			return this.localizationStrings;
		}
		return {};
	}

    /**
     * Clears the unused localization files from cache
     */
    clearUnusedLocFiles() {
        // Implementation to clear unused localization files
		for(const langCode in this.cacheTimeStampsOfLocFiles){
			if (this.cacheTimeStampsOfLocFiles.hasOwnProperty(langCode)) {
                const fileName = `${langCode}.json`;
                if(cc.sys.isNative){
                    this.cacheHelper.deleteFileFromCache(fileName);
                }else{
                this.RemoveStringByCCFile(fileName);		
                }
               	
            }
		}
        this.RemoveStringByCCFile(CloudLocsCacheKeys.CachedDirName);
        this.RemoveStringByCCFile(CloudLocsCacheKeys.CacheLocsManifest);
        this.clearLastModifiedTimeCache();
    }

    /**
     * Clears the cached manifest or last modified time from cache
     * GA- 7009 Removes the cached manifest | LMT from cache, if the last accessed time or used in the past X days
     * Check for Saved Manifest Object also
     */
    clearLastModifiedTimeCache() {
        this.cacheTimeStampsOfLocFiles = {};
        this.updateCacheTimestamps();
    }

    RemoveStringByCCFile(kkey: string): void {
        cc.sys.localStorage.removeItem(kkey);
    }

    public static SaveStringByCCFile(kkey: string, kValue: string) {
        cc.sys.localStorage.setItem(kkey, kValue);
    }

    public static GetStringByCCFile(kkey: string): string {
        let kRet: string = cc.sys.localStorage.getItem(kkey);
        return kRet;
    }

}
