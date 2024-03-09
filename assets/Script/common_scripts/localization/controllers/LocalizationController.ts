import {LocStringsTable} from "../models/LocStringsData";
import { LocalizationObserver } from "./LocalizationObserver";
import { StringUtils } from "../../utils/StringUtils";
import CloudLocalizationController from "./CloudLocalizationController";
import { LANGUAGE_TYPE, Languages } from "../models/CloudLocalizationInterfaces";

export class LocalizationController {
    private static instance: LocalizationController;
    private static observer: LocalizationObserver;

    private stringsTable: LocStringsTable; // Key: Language, Value: {[key: string]: text | text[]}

    private cloudLocalizationController: CloudLocalizationController;

    static getObserver(): LocalizationObserver {
        if (!LocalizationController.observer) {
            LocalizationController.observer = new LocalizationObserver();
        }

        return LocalizationController.observer;
    }

    static getInstance(): LocalizationController {
        if (!LocalizationController.instance) {
            LocalizationController.instance = new LocalizationController();
        }
        return LocalizationController.instance;
    }

    private constructor() {
        this.stringsTable = {};
        this.cloudLocalizationController = new CloudLocalizationController();
        this.cloudLocalizationController.fetchCloudLocalizationData().then(crowdinStrings => {
            // Update the string table with cached | Crowdin Strigns
            if(crowdinStrings && Object.keys(crowdinStrings).length > 0){
                for (const languageCode in crowdinStrings) {
                    if (crowdinStrings.hasOwnProperty(languageCode)) {
                        this.stringsTable[languageCode] = crowdinStrings[languageCode];
                    }
                }
                console.log(`${CloudLocalizationController.CL_LOG_KEY} stringTable is Populated with Crowdin Data ${JSON.stringify(crowdinStrings)}`);
            }else{
                console.log(`${CloudLocalizationController.CL_LOG_KEY} crowdinStrings is undefined || NULL || Empty ${JSON.stringify(crowdinStrings)}`);
            }
        }).catch(error => console.error(`${CloudLocalizationController.CL_LOG_KEY} fetchCloudLocalizationData Error: ${error}`));
    }

    getTranslatedString(key: string, language: string): string {
        language = this.cloudLocalizationController.getLanguageAccToCrowdinLangCode(language);
        const stringObj = this.stringsTable[language];

        if (!stringObj) {
            return key;
        }

        try {
            const valueObj = stringObj[key];
            if (Array.isArray(valueObj)) {
                return valueObj.join("");
            } else {
                return StringUtils.toString(valueObj);
            }
        } catch(e) {
            cc.error("LocalizationController::getTranslatedString Error: " + e);
            return key;
        }
    }

    loadLocStringsFromResources(lang: string, successCallback?: Function, failureCallback?: Function) {

        const crowdinLocLangCode = this.cloudLocalizationController.getLanguageAccToCrowdinLangCode(lang);
        console.log(`${CloudLocalizationController.CL_LOG_KEY} WPTG Lang code ${lang} crowdinCode ${crowdinLocLangCode}`);

        const filePath = Languages[lang].i18nPath;

        cc.resources.load(filePath, cc.JsonAsset, (error, asset: cc.JsonAsset) => {
            if (error) {
                cc.error(error.message || error);
                failureCallback?.();
                return;
            }

            // Check if stringsTable already has data for the crowdinLocLangCode
            if (this.stringsTable[crowdinLocLangCode] && Object.keys(this.stringsTable[crowdinLocLangCode]).length > 0) {
                console.log(`${CloudLocalizationController.CL_LOG_KEY} Strings already loaded for language: ${crowdinLocLangCode}`);
                successCallback?.();
                return;
            }

            if (!this.stringsTable[crowdinLocLangCode]) {
                this.stringsTable[crowdinLocLangCode] = {};
            }

            console.log(`${CloudLocalizationController.CL_LOG_KEY} loadLocStringsFromResources cc.resource.load: For File = ${crowdinLocLangCode}`);

            let locData: Object = asset.json["string"];
            for (let locKey of Object.keys(locData)) {
                if (typeof locData[locKey] == "string" || Array.isArray(locData[locKey])) {
                    this.stringsTable[crowdinLocLangCode][locKey] = locData[locKey];
                } else {
                    this.stringsTable[crowdinLocLangCode][locKey] = locData[locKey]["-value"];
                }
            }
            successCallback?.();
        });
    }
}
