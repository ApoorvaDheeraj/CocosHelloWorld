import { CrowdinLangManifest } from "../libs/Crowdin/CrowdinModels";
import { CloudLocsCacheKeys } from "../models/CloudLocalizationInterfaces";
import { CacheHelperWithCCLocalStorage } from "./CacheHelperWithCCLocalStorage";
import CloudLocalizationController from "./CloudLocalizationController";

export class CloudLocCacheHelper {
    private cacheDir: string;
    private _localLocsManifestObject: CrowdinLangManifest = null;

    private getLocalCachedManifestValues(): string {
        if (cc.sys.isNative) {
            return this.getDataFromCacheFile(`${CloudLocsCacheKeys.CacheManifestValuesKey}.json`);
        } else {
            return CacheHelperWithCCLocalStorage.GetStringByCCFile(CloudLocsCacheKeys.CacheManifestValuesKey);
        }
    }

    // Getter method for localLocsManifestObject
    public get localLocsManifestObject(): CrowdinLangManifest | null {
        return this._localLocsManifestObject;
    }

    // Setter method for localLocsManifestObject
    public set localLocsManifestObject(value: CrowdinLangManifest) {
        if (value) {
            this._localLocsManifestObject = value;
            const fileContent = JSON.stringify(this._localLocsManifestObject);
            if (cc.sys.isNative) {
                this.writeDataToCacheFile(`${CloudLocsCacheKeys.CacheManifestValuesKey}.json`, fileContent);
            } else {
                CacheHelperWithCCLocalStorage.SaveStringByCCFile(CloudLocsCacheKeys.CacheManifestValuesKey, fileContent);
            }
            console.log(`${CloudLocalizationController.CL_LOG_KEY} : localLocsManifestObject : Set ${JSON.stringify(this.localLocsManifestObject)}`);
        }
    }

    /**
     * Initializes the cache directory.
     * @param cacheDirName The name of the cache directory.
     * @returns A string indicating the result of the initialization.
     */
    initCache(cacheDirName: string): string {
        // Check if the environment is native
        if (cc.sys.isNative) {
            // Construct the cache directory path
            this.cacheDir = `${jsb.fileUtils.getWritablePath()}` + cacheDirName;
            console.log(`${CloudLocalizationController.CL_LOG_KEY} Cached Dir = ${this.cacheDir}`);

            // Check if the cache directory already exists
            if (!jsb.fileUtils.isDirectoryExist(this.cacheDir)) {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} Creating Dir = ${this.cacheDir}`);
                return jsb.fileUtils.createDirectory(this.cacheDir);
            }
            return "Directory Already Exists";
        }
    }

    initCacheProperties() {
        // Read | Initilize value from local cache
        this._localLocsManifestObject = JSON.parse(this.getLocalCachedManifestValues());
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
                console.log(`${CloudLocalizationController.CL_LOG_KEY} removeCachedDirectory: File Found = ${this.cacheDir}`);
                return jsb.fileUtils.removeDirectory(this.cacheDir);
            } else {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} removeCachedDirectory: File NOT Found = ${this.cacheDir}`);
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
                console.log(`${CloudLocalizationController.CL_LOG_KEY} deleteFileFromCache: File Found = ${filePath}`);
                return jsb.fileUtils.removeFile(filePath);
            } else {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} deleteFileFromCache: File NOT Found = ${filePath}`);
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
        if (cc.sys.isNative) {
            const cachedFileName = this.cacheDir + `/${fileName}`;
            console.log(`${CloudLocalizationController.CL_LOG_KEY} writeDataToCacheFile: cacheFilePath = ${cachedFileName}`);
            return jsb.fileUtils.writeStringToFile(fileContent, cachedFileName);
        } else {
            CacheHelperWithCCLocalStorage.SaveStringByCCFile(fileName, fileContent);
        }
    }

    /**
     * Reads data from a cache file.
     * @param fileName The name of the cache file to read from.
     * @returns The content of the cache file as a string.
     */
    getDataFromCacheFile(fileName: string): string {
        if (cc.sys.isNative) {
            const cachedFilename = this.cacheDir + `/${fileName}`;
            console.log(`${CloudLocalizationController.CL_LOG_KEY} getDataFromCacheFile = File Path ${cachedFilename}`);
            if (jsb.fileUtils.isFileExist(cachedFilename)) {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} getDataFromCacheFile: File Found = ${cachedFilename}`);

                return jsb.fileUtils.getStringFromFile(cachedFilename);
            } else {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} getDataFromCacheFile: FileNotExist = ${cachedFilename}`);
            }
        } else {
            CacheHelperWithCCLocalStorage.GetStringByCCFile(fileName);
        }
        return "{}";
    }

    /**
     * Retrieves the last modified time of the cached directory from local storage.
     * @returns The last modified time of the cached directory.
     */
    getLastModifiedTimeOfCacheDir(): number {
        return this.localLocsManifestObject?.timestamp || 0;
    }
}