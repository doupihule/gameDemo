import UserInfo from "../../../framework/common/UserInfo";

export class FrameRateManager {
	private static _instance: FrameRateManager;
	private num = 0;
	private lowFrameFPS = 30;
	private highFrameFPS = 60;
	private readRate = 10;
	private mulplite = 1.5;
	private _lastTime: number;

	constructor() {

	};

	static get instance(): FrameRateManager {
		if (!this._instance) {
			this._instance = new FrameRateManager();
		}
		return this._instance;
	}

	//动态设置帧率
	updateFrame() {
		if (Laya.stage.frameRate == Laya.Stage.FRAME_SLOW) return;
		this.num++;
		if (this.num % (this.highFrameFPS * this.readRate) == 0) {
			var nowTime = Laya.Browser.now();
			var disTime = nowTime - this._lastTime;
			if (disTime > this.readRate * 10 * this.mulplite) {
				//判断是慢设备
				UserInfo.platform.setGameFrame();
			} else {
				this._lastTime = Laya.Browser.now();
			}
		}
	}

	initData() {
		this.num = 0;
		this._lastTime = Laya.Browser.now();
	}
}
