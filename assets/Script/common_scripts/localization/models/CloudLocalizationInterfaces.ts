/**
 * {@link https://developer.crowdin.com/language-codes Language Code}
 * Used if you want to get Translation data based on Locale with - CrowdinOtaClient.getStringsByLocale() 
 */
export const enum CrowdinLangCode {
    English = 'en-US',
    Japanese = 'ja',
    Chinese = 'zh-CN',
    Indonesian = 'id',
    Canada_EN = 'en-CA',
    Canada_FR = 'fr-CA',
    Korean = 'ko',
    Portuguese_BR = 'pt-BR',
    Spanish_MX = 'es-MX',
    Thai = 'th',
    Vietnamese = 'vi'
}

export const enum CloudLocsCacheKeys {
    LocsTime = 'locsCacheTime',
    CachedDirName = "cloudLocalization",
    CacheManifestValuesKey = "cacheLocsManifest"
}

export type Language = {
    type: LANGUAGE_TYPE,
    /** used for i18n to construct keys, like LanguageView_{$code}_button_text and LanguageView_{$code}_flag_text */
    code: string,
    i18nPath: string,
}


export interface LocalizationCachedData {
    [lastModifiedFileName: string]: number; // Mapping from file name to last modified timestamp
}

export enum LANGUAGE_TYPE {
    /** Hindi, Traditional Chinese - Chinese (S) */
    zh_CN = "zh_CN",

    /** English (US) */
    en_US = "en_US",

    /** Vietnamese */
    vi_VN = "vi_VN",

    /** Thai (Thailand) */
    th_PH = "th_PH",

    /** Arabic (Saudi Arabia) */
    ar_SA = "ar_SA",

    /** Hindi (India) */
    hi_IN = "hi_IN",

    /** Portuguese (Brazil) */
    pt_BR = "pt_BR",

    /** French (Canada) */
    fr_CA = "fr_CA",

    /** Spanish (Mexico) */
    es_MX = "es_MX",

    /** Nihongo (Japan) */
    ja_JP = "ja_JP",

    /** Korean */
    ko_KR = "ko_KR",

}
type LanguagesType = {
    [type in LANGUAGE_TYPE]: Language;
}

export var Languages: Partial<LanguagesType> = {
    [LANGUAGE_TYPE.en_US]: {
        type: LANGUAGE_TYPE.en_US,
        code: "en",
        i18nPath: "stringEN",
    },
    [LANGUAGE_TYPE.zh_CN]: {
        type: LANGUAGE_TYPE.zh_CN,
        code: "zh",
        i18nPath: "zh_CN/text/stringCH",
    },
    [LANGUAGE_TYPE.vi_VN]: {
        type: LANGUAGE_TYPE.vi_VN,
        code: "vi",
        i18nPath: "stringVN",
    },
    [LANGUAGE_TYPE.pt_BR]: {
        type: LANGUAGE_TYPE.pt_BR,
        code: "pt",
        i18nPath: "stringPT",
    },
    [LANGUAGE_TYPE.fr_CA]: {
        type: LANGUAGE_TYPE.fr_CA,
        code: "fr",
        i18nPath: "stringFR",
    },
    [LANGUAGE_TYPE.es_MX]: {
        type: LANGUAGE_TYPE.es_MX,
        code: "es",
        i18nPath: "stringES",
    },
    [LANGUAGE_TYPE.th_PH]: {
        type: LANGUAGE_TYPE.th_PH,
        code: "th",
        i18nPath: "stringTH",
    },
    [LANGUAGE_TYPE.ja_JP]: {
        type: LANGUAGE_TYPE.ja_JP,
        code: "ja",
        i18nPath: "stringJP",
    },
    [LANGUAGE_TYPE.ko_KR]: {
        type: LANGUAGE_TYPE.ko_KR,
        code: "ko",
        i18nPath: "stringKO",
    },
}

