export class CrowdinStringUtils{

    static isObject(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }
    
    static isJsonFile(file: string): boolean {
        const extension = (file ?? '').split('.').pop();
        return extension?.toLocaleLowerCase() === 'json';
    }

    static mergeDeep(targetObj: any, sourceObj: any): any {
        const target = targetObj ?? {};
        const source = sourceObj ?? {};
        Object.keys(source).forEach((key) => {
            if (CrowdinStringUtils.isObject(source[key])) {
                if (!(key in target)) {
                    target[key] = source[key];
                } else {
                    target[key] = CrowdinStringUtils.mergeDeep(target[key], source[key]);
                }
            } else {
                target[key] = source[key];
            }
        });
        return target;
    }
     
}