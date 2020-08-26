export default class TimeEntity {
	static TimeCode: number = 0;

	static emptyArr: any[] = []

	code: number = 0;
	delay: number = 0;
	oldTime: number = 0;
	maxCount: number = 0;
	callBack: Function = null;
	thisObject: any = null;
	isRemove: boolean = false;
	args: any[];

	constructor(delay: number, callBack: Function, thisObject: any, maxCount: number, args: any[]) {
		this.delay = delay;
		this.callBack = callBack;
		this.thisObject = thisObject;
		this.maxCount = maxCount;
		this.oldTime = Laya.timer.currTimer;
		this.args = args || TimeEntity.emptyArr;
	}
}
