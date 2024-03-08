export interface CrowdinClientConfig {
    /**
     * Specify your own http client. Default uses axios
     */
    httpClient?: CrowdinHttpClient;
    /**
     * Disable cache of distribution manifest. Default is false
     */
    disableManifestCache?: boolean;
    /**
     * Default language code to be used if language was not passed as an input argument of the method
     */
    languageCode?: string;
    /**
     * Disable translation strings cache. Default is false
     */
    disableStringsCache?: boolean;
    /**
     * Disable Crowdin languages cache. Default is false
     */
    disableLanguagesCache?: boolean;
    /**
     * Disable deep merge and use shallow merge to merge translation strings from json file
     */
    disableJsonDeepMerge?: boolean;
    /**
     * The name of your Crowdin Enterprise organization
     * If provided, this will fetch languages from the Enterprise API instead of the Crowdin API v2. The name must be a valid Enterprise organization name.
     */
    enterpriseOrganizationDomain?: string;
}

export interface CrowdinHttpClient {
    /**
     * Executes HTTP GET request
     *
     * @param url http url
     */
    get<T>(url: string): Promise<T>;
}

export interface CrowdinLangManifest {
    files: string[];
    languages: string[];
    timestamp: number;
    // these next two arrays will always be empty if they are arrays, the never type just avoids an eslint error
    language_mapping: CrowdinLangMappings | never[];
    custom_languages: CrowdinCustomLanguages | never[];
    content: {
        [languageCode: string]: string[];
    };
    mapping: string[];
}

export interface CrowdinLangMappings {
    [languageCode: string]: CrowdinLangMapping;
}

export interface CrowdinCustomLanguages {
    [languageCode: string]: CrowdinCustomLanguage;
}

export interface CrowdinLangMapping {
    [placeholder: string]: string;
}

export interface CrowdinTranslations {
    [languageCode: string]: CrowdinLangTranslations[];
}

export interface CrowdinLangTranslations {
    file: string;
    content: string | any | null;
}

export interface CrowdinLangFiles {
    [languageCode: string]: string[];
}

export interface CrowdinLangStrings {
    [languageCode: string]: any;
}

export interface CrowdinCustomLanguage {
    name: string;
    two_letters_code: string;
    three_letters_code: string;
    locale: string;
    locale_with_underscore: string;
    android_code: string;
    osx_code: string;
    osx_locale: string;
}
