export class CacheHelperWithCCLocalStorage {
    static RemoveStringByCCFile(kkey: string): void {
        cc.sys.localStorage.removeItem(kkey);
    }

    static SaveStringByCCFile(kkey: string, kValue: string) {
        cc.sys.localStorage.setItem(kkey, kValue);
    }

    static GetStringByCCFile(kkey: string): string {
        let kRet: string = cc.sys.localStorage.getItem(kkey);
        return kRet;
    }
}