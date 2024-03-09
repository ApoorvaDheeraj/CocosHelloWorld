import { LocalizationController } from "./common_scripts/localization/controllers/LocalizationController";
import { LANGUAGE_TYPE, Languages } from "./common_scripts/localization/models/CloudLocalizationInterfaces";

export class ConfigLoader{

    public static availableLanguages: LANGUAGE_TYPE[] = [        
        LANGUAGE_TYPE.en_US,
        LANGUAGE_TYPE.es_MX, 
        LANGUAGE_TYPE.fr_CA, 
        LANGUAGE_TYPE.pt_BR,
        LANGUAGE_TYPE.ja_JP,
        LANGUAGE_TYPE.vi_VN,
        LANGUAGE_TYPE.ko_KR,
        LANGUAGE_TYPE.th_PH
    ];

    public static loadStringsFromJson(){
        ConfigLoader.availableLanguages.forEach((langType: LANGUAGE_TYPE) => {

            LocalizationController.getInstance().loadLocStringsFromResources(langType, () => {
                let zhJson = { path: Languages[langType].i18nPath, type: "json" };
                console.log(`File Loaded from Json = ${zhJson.path}${zhJson.type}`);
            });
        }, this);
    }
}