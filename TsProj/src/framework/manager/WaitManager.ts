import WaitEntity from "../entity/WaitEntity";
import WindowManager from "./WindowManager";
import ReqLoadingUI from "../../game/sys/view/loading/ReqLoadingUI";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import TimerManager from "./TimerManager";
import Client from "../common/kakura/Client";


export default class WaitManager {
	private static _instance: WaitManager;
	//等待数组
	private waitList: WaitEntity[];
	//缓存数组
	private waitPool: WaitEntity[];
	// //时钟
	// private waitTimer:egret.Timer;

	private _waitView: ReqLoadingUI;

	constructor() {
		this.waitList = [];
		this.waitPool = [];
		// this.waitTimer = new egret.Timer(1000);
		// this.waitTimer.addEventListener(egret.TimerEvent.TIMER, this.timeCallBack, this);
		this._waitView = new ReqLoadingUI();
		this._waitView.setSize(ScreenAdapterTools.width,ScreenAdapterTools.height);
		TimerManager.instance.add(this.timeCallBack,this,1000);

	}

	static get instance(): WaitManager {
		if (!this._instance) {
			this._instance = new WaitManager();
		}
		return this._instance;
	}

	/**
	 * 添加等待命令
	 * @param cmd
	 */
	add(cmd: any): void {
		var wait: WaitEntity;
		if (this.waitPool.length > 0) {
			wait = this.waitPool.shift();
		} else {
			wait = new WaitEntity();
		}
		wait.cmd = cmd;
		wait.time = Client.instance.miniserverTime;
		this.waitList.push(wait);
		// WindowManager.OpenUI(WindowCfgs.ReqLoadingUI);
		this.showOrHideWaitView(true);
		TimerManager.instance.add(this.timeCallBack,this,1000);
		// if (!this.waitTimer.running) {
		//     this.waitTimer.start();
		// }
	}

	/**
	 * 移除等待命令
	 * @param cmd
	 */
	remove(cmd: any): void {
		var len: number = this.waitList.length;
		for (var i = 0; i < len; i++) {
			if (cmd == this.waitList[i].cmd) {
				this.waitPool.push(this.waitList.splice(i, 1)[0]);
				break;
			}
		}
		this.checkWait();
	}

	/**
	 * 清理等待命令
	 */
	clear(): void {
		while (this.waitList.length > 0) {
			this.waitPool.push(this.waitList.shift());
		}
		this.checkWait();
	}

	/**
	 * 检测等待命令
	 */
	private checkWait(): void {
		if (this.waitList.length <= 0) {
			// WindowManager.CloseUI(WindowCfgs.ReqLoadingUI);
			this.showOrHideWaitView(false);
			TimerManager.instance.removeByCallBack(this,this.timeCallBack);
		}
	}

	/**
	 * 时钟回调
	 */
	private timeCallBack(): void {
		var len: number = this.waitList.length;
		var nowTime: number = Client.instance.miniserverTime;
		for (var i = 0; i < len;) {
			if (nowTime - this.waitList[i].time > 20000) {
				console.log("cmd=" + this.waitList[i].cmd + " request timeout...");
				this.waitPool.push(this.waitList.splice(i, 1)[0]);
				len--;
				continue;
			}
			i++;
		}
		this.checkWait();
	}

	/*判断是否处理waiting中,true是在等待中 false表示没有waiting*/
	public checkIsWaiting() {
		return this.waitList.length != 0;
	}

	//显示或者隐藏waitview
	private showOrHideWaitView(value) {
		if (value) {
			if (!this._waitView.parent) {
				WindowManager.topUILayer.addChild(this._waitView);
			}
			this._waitView.visible = true;
			this._waitView.setData(null);
		} else {
			this._waitView.visible = false;
			this._waitView.removeSelf()
		}
	}
}
