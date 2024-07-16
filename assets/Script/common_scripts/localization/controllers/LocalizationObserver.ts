import { LocalizationEvents } from "../models/LocalizationEvents";

export class LocalizationObserver {
	private eventTarget: cc.EventTarget;

	constructor() {
		this.eventTarget = new cc.EventTarget();
	}

	subscribe(eventName: LocalizationEvents, callback: Function, target: any) {
		this.eventTarget.on(eventName, callback, target);
	}

	subscribeOnce(eventName: LocalizationEvents, callback: Function, target: any) {
		this.eventTarget.once(eventName, callback as any, target);
	}

	unsubscribe(eventName: LocalizationEvents, callback: Function, target: any) {
		this.eventTarget.off(eventName, callback, target);
	}

	unsubscribeAll(target: any) {
		this.eventTarget.targetOff(target);
	}

	notify(eventName: LocalizationEvents, data?: any) {
		this.eventTarget.emit(eventName, data);
	}
}
