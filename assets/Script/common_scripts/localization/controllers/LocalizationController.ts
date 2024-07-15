import { CloudLocData } from "../models/CloudLocalizationInterfaces";
import { CloudLocalizationController } from "./CloudLocalizationController";
import { LocalizationObserver } from "./LocalizationObserver";

export class LocalizationController {
    private static instance: LocalizationController;
    private static observer: LocalizationObserver;

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
        this.cloudLocalizationController = new CloudLocalizationController();
    }



    public fetchLocStringsFromCloud() {
        if (!this.cloudLocalizationController) {
            return;
        }

        this.cloudLocalizationController.getLocalizationData().then((cloudLocData: CloudLocData) => {
            if (!cloudLocData?.isLiveData) {
                return;
            }

            for (const lang of Object.keys(cloudLocData.data)) {
                console.log(`Lang Data ${cloudLocData.data[lang]}`);
            }
        });
    }
}
