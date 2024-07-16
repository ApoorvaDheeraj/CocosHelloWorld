import { CloudLocalizationManifest, CrowdinLangStrings } from "../libs/Crowdin/CrowdinModels";
import { LocStrings, LocStringsTable } from "../models/LocStringsData";
import { CloudLocCacheHelper } from "./CloudLocCacheHelper";

/**
 * CloudLocalizationCacheHandler to cache LocalizationData of Crowdin translation data
 */
export class CloudLocalizationCacheHandler {
    private localizationStrings: LocStringsTable = {};
    private cacheHelper: CloudLocCacheHelper;
    private _localLocsManifestObject: CloudLocalizationManifest = null;

    constructor() {
        this.cacheHelper = new CloudLocCacheHelper();
        this.cacheHelper.initCache();
        this._localLocsManifestObject = this.cacheHelper.getLocalManifestObject();
        this._localLocsManifestObject = cc.js.isEmptyObject(this._localLocsManifestObject) ? null : this._localLocsManifestObject;
        if(!this._localLocsManifestObject){
            console.log("Dheeraj: LocalManifest Null : CacheHandler Const");
        }
    }

    isCacheAvailable(): boolean {
        return this.localLocsManifestObject != null;
    }

    get localLocsManifestObject(): CloudLocalizationManifest | null {
        return this._localLocsManifestObject;
    }

    set localLocsManifestObject(value: CloudLocalizationManifest) {
        this._localLocsManifestObject = value;
        this.cacheHelper.updateLocalManifestObject(value);
    }

    getSavedLocalizationStringTable(langCode: string): LocStringsTable {
        if (cc.js.isEmptyObject(this.localizationStrings)) {
            this.readLocalCachedData("en_US");
        } else if (langCode != null && !this.localizationStrings.hasOwnProperty(langCode)) {
            this.readLocalCachedData(langCode);
        }

        return this.localizationStrings;
    }

    /**
     * Save localization strings to cache
     */
    saveLocalizationStrings(locData: CrowdinLangStrings) {
        for (let langCode of Object.keys(locData)) {
            this.localizationStrings[langCode] = locData[langCode];
            this.cacheHelper.writeDataToCacheFile(langCode + ".json", locData[langCode]);
        }
    }

    private readLocalCachedData(langCode: string) {
        const fileName = langCode + ".json";
        let fileContent = this.cacheHelper.getDataFromCacheFile(fileName);
        if (fileContent && !cc.js.isEmptyObject(fileContent)) {
            this.localizationStrings[langCode] = fileContent as LocStrings;
        } else {
            cc.error(`CloudLocalizationCacheHandler::readLocalCachedData Error while reading cache file ${fileName}`);
            console.log("Dheeraj: CloudLocalizationCacheHandler::readLocalCachedData Error while reading cache file empty" + fileName);
        }
    }
}
