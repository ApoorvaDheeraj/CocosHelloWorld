export class LocalizationObserver {
	private eventTarget: cc.EventTarget;

	constructor() {
		this.eventTarget = new cc.EventTarget();
	}

	subscribe(eventName: string, callback: Function, target: any) {
		this.eventTarget.on(eventName, callback, target);
	}

	subscribeOnce(eventName: string, callback: Function, target: any) {
		this.eventTarget.on(eventName, callback, target);
	}

	unsubscribe(eventName: string, callback: Function, target: any) {
		this.eventTarget.off(eventName, callback, target);
	}

	unsubscribeAll(target: any) {
		this.eventTarget.targetOff(target);
	}

	notify(eventName: string, data?: any) {
		this.eventTarget.emit(eventName, data);
	}
}
