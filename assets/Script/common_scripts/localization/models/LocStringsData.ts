export interface LocStrings {
    [locKey: string]: string | Array<string>;
}

export interface LocStringsTable {
    [language: string]: LocStrings;
}
