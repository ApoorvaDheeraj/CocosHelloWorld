import { LocalizationController } from "./common_scripts/localization/controllers/LocalizationController";

export class ConfigLoader{



    public static loadStringsFromJson(){

        LocalizationController.getInstance().fetchLocStringsFromCloud();
    }
}