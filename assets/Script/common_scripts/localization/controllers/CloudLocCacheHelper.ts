
import { CloudLocalizationManifest} from "../libs/Crowdin/CrowdinModels";
import { CloudLocsCacheKeys } from "../models/CloudLocalizationInterfaces";

export class CloudLocCacheHelper {
    private cacheDir: string;

    /**
     * Initializes the cache directory.
     */
    initCache() {
        if (!cc.sys.isNative) {
            return;
        }

        this.cacheDir = jsb.fileUtils.getWritablePath() + CloudLocsCacheKeys.CachedDirName;

        if (!jsb.fileUtils.isDirectoryExist(this.cacheDir)) {
            jsb.fileUtils.createDirectory(this.cacheDir);
        }
    }

    getLocalManifestObject(): CloudLocalizationManifest | null {
        return this.getDataFromCacheFile(CloudLocsCacheKeys.CacheManifestValuesKey + ".json") as CloudLocalizationManifest;
    }

    updateLocalManifestObject(data: CloudLocalizationManifest) {
        this.writeDataToCacheFile(CloudLocsCacheKeys.CacheManifestValuesKey + ".json", data)
    }

    deleteLocalManifestObject() {
        this.deleteFileFromCache(CloudLocsCacheKeys.CacheManifestValuesKey + ".json");
    }

    /**
     * Deletes a file from the cache directory.
     * @param fileName The URL of the file to delete.
     */
    deleteFileFromCache(fileName: string) {
        try {
            if (cc.sys.isNative) {
                const cachedFileName = this.cacheDir + "/" + fileName;
                if (jsb.fileUtils.isFileExist(cachedFileName)) {
                    jsb.fileUtils.removeFile(cachedFileName);
                }
                return;
            } else {
                cc.sys.localStorage.removeItem(fileName);
            }
        } catch (err) {
            cc.error("CloudLocCacheHelper::deleteFileFromCache Error while deleting files from cache: "+JSON.stringify(err));
        }
    }

    /**
     * Writes data to a cache file.
     * @param fileName The name of the cache file.
     * @param fileContent The content to write to the cache file.
     */
    writeDataToCacheFile(fileName: string, fileContent: Object) {
        try {
            const fileContentStr = JSON.stringify(fileContent);
            console.log("Dheeraj:" + fileContentStr);
            if (cc.sys.isNative) {
                const cachedFileName = this.cacheDir + "/" + fileName;
                jsb.fileUtils.writeStringToFile(fileContentStr, cachedFileName);
            } else {
                cc.sys.localStorage.setItem(fileName, fileContentStr);
            }
        } catch (err) {
            cc.error("CloudLocCacheHelper::writeDataToCacheFile Error while writing files to cache: "+JSON.stringify(err));
        }
    }

    /**
     * Reads data from a cache file.
     * @param fileName The name of the cache file to read from.
     * @returns The content of the cache file as a string.
     */
    getDataFromCacheFile(fileName: string): Object {
        try {
            if (cc.sys.isNative) {
                const cachedFilename = this.cacheDir + "/" + fileName;
                if (jsb.fileUtils.isFileExist(cachedFilename)) {
                    return JSON.parse(jsb.fileUtils.getStringFromFile(cachedFilename));
                } else {
                    return null;
                }
            } else {
                return JSON.parse(cc.sys.localStorage.getItem(fileName));
            }
        } catch (err) {
            cc.error("CloudLocCacheHelper::getDataFromCacheFile Error while reading files from cache: "+JSON.stringify(err));
            return null;
        }
    }
}
