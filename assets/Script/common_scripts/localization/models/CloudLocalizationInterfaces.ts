import { CrowdinLangStrings } from "../libs/Crowdin/CrowdinModels";

export const enum CloudLocsCacheKeys {
    CachedDirName = "cloudLocalization",
    CacheManifestValuesKey = "cacheLocsManifest"
}

export interface CloudLocData {
    data: CrowdinLangStrings | null,
    isLiveData: boolean
}
