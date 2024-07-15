export enum StringFormatFlag {
	Default,
	Uppercase_First_Letter,
	Uppercase_All,
	Lowercase_All,
	Uppercase_Words_First_Letter
}

export class StringUtils {

	/**
	 * Converts passed value to a string
	 * @param value the value to be converted
	 * @return {string} the stringified value
	 */
	static toString(value: any): string {
		return (value ?? "").toString();
	}

	/**
	 * Converts passed value to a number if possible, else returns 0
	 * @param value the value to be converted
	 * @return {number} the number value
	 */
	static toNumber(value: any): number {
		if (!StringUtils.isNumber(value)) {
			return 0;
		}

		return parseFloat(value);
	}

	/**
	 * Checks whether the passed value is a valid number
	 * @param value the value to be checked
	 * @return {boolean} whether the passed value is a number
	 */
	static isNumber(value: any): boolean {
		const numberValue: number = parseFloat(value);
		return !isNaN(numberValue) && isFinite(numberValue);
	}

	/**
	 * Formats the given string based on the flag value passed
	 * @param text the string to be converted
	 * @param formatFlag the flag determining what type of formatting to use
	 * @return {string} the converted string value
	 */
	static formatString(text: string, formatFlag: StringFormatFlag): string {
		if (!text || text.length == 0 || StringUtils.isNumber(text)) {
			return text;
		}

		switch (formatFlag)
		{
			case StringFormatFlag.Uppercase_First_Letter:
				text = StringUtils.capitalizeFirstLetter(text);
				break;
			case StringFormatFlag.Uppercase_All:
				text = text.toLocaleUpperCase();
				break;
			case StringFormatFlag.Lowercase_All:
				text = text.toLocaleLowerCase();
				break;
			case StringFormatFlag.Uppercase_Words_First_Letter:
				text = StringUtils.capitalizeTheFirstLetterOfEachWord(text);
				break;
		}

		return text;
	}

	/**
	 * Format the given string, so that the first letter of the string is capitalized
	 * @param text the string to be formatted
	 * @return {string} returns the string with the first letter capitalized
	 */
	static capitalizeFirstLetter(text: string): string {
		const sRet: string = StringUtils.toString(text);

		if (sRet.length <= 0) {
			return "";
		}

		return sRet.charAt(0).toLocaleUpperCase() + sRet.slice(1).toLocaleLowerCase();
	}

	/**
	 * Format the given string, so that the first letter of each word in the string is capitalized
	 * @param text the string to be formatted
	 * @return {string} returns the string with the first letter of each word capitalized
	 */
	static capitalizeTheFirstLetterOfEachWord(text: string): string  {
		return text.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
	}

	/**
	* Checks if the given value is an object.
	* @param {any} value - The value to check.
	* @returns {boolean} - True if the value is an object and not an array, false otherwise.
	*/
	static isObject(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

	/**
	 * Checks if the given file name has a .json extension.
	 * @param {string} file - The file name to check.
	 * @returns {boolean} - True if the file has a .json extension, false otherwise.
	 */
    static isJsonFile(file: string): boolean {
        const extension = (file ?? '').split('.').pop();
        return extension?.toLocaleLowerCase() === 'json';
    }

	/**
	 * Deeply merges two objects. Properties from the source object
	 * are merged into the target object. 
	 * @param {any} targetObj - The target object to merge properties into.
	 * @param {any} sourceObj - The source object to merge properties from.
	 * @returns {any} - The merged target object.
	 */
    static mergeDeep(targetObj: any, sourceObj: any): any {
        const target = targetObj ?? {};
        const source = sourceObj ?? {};
        Object.keys(source).forEach((key) => {
            if (StringUtils.isObject(source[key])) {
                if (!(key in target)) {
                    target[key] = source[key];
                } else {
                    target[key] = StringUtils.mergeDeep(target[key], source[key]);
                }
            } else {
                target[key] = source[key];
            }
        });
        return target;
    }
}
