import TimeEntity from "../entity/TimeEntity";
import GameConsts from "../../game/sys/consts/GameConsts";
import Client from "../common/kakura/Client";
import LogsManager from "./LogsManager";


export default class TimerManager {
	private static _instance: TimerManager;

	//时区偏移
	public static timeOurOffset: number = 8;

	private timeCount: number = 0;
	//缓存的time对象{id:TimeEntity}
	private _timeMap: any = {};

	constructor() {
		Laya.timer.frameLoop(1, this, this.tickHandler);
	}

	static get instance(): TimerManager {
		if (!this._instance) {
			this._instance = new TimerManager();
		}
		return this._instance;
	}

	/**
	 * 添加一个时钟
	 * @param callBack
	 * @param thisObject
	 * @param delay 延迟时间 毫秒
	 * @param maxCount 执行的次数  如果只执行1次 那么这个地方需要手动传1
	 * @param immediate 是否立即执行一次
	 */
	add(callBack: Function, thisObject: any, delay: number = 1000, maxCount: number = Number.MAX_VALUE, immediate: boolean = false, args: any[] = []): number {
		var timeEntity;
		this.timeCount++
		if (immediate) {
			timeEntity = new TimeEntity(delay, callBack, thisObject, maxCount - 1, args);

			// args.splice(0,0,1);
			if (args.length > 0) {
				callBack.apply(thisObject, args);
			} else {
				callBack.apply(thisObject, [1]);
			}
		} else {
			timeEntity = new TimeEntity(delay, callBack, thisObject, maxCount, args);
		}
		timeEntity.code = this.timeCount
		this._timeMap[String(this.timeCount)] = timeEntity;
		return timeEntity.code;
	}

	/**
	 * 移除该时钟
	 * @param code
	 */
	remove(code: number): void {
		if (code > 0) {
			delete this._timeMap[String(code)];
		}
	}

	/**
	 * 移除该时钟
	 * @param thisObject 作用对象
	 * @param callBack 函数
	 */
	removeByCallBack(thisObject: any, callBack: Function): void {
		for (var i in this._timeMap) {
			var time: TimeEntity = this._timeMap[i];
			if (time.thisObject == thisObject && time.callBack == callBack) {
				time.isRemove = true;
				delete this._timeMap[i];
			}
		}
	}

	//移除一个对象注册的所有回调
	removeByObject(obj: any) {
		for (var i in this._timeMap) {
			var time: TimeEntity = this._timeMap[i];
			if (time.thisObject == obj) {
				time.isRemove = true;
				delete this._timeMap[i];
			}
		}
	}

	//移除所有时钟
	private removeAll() {
		LogsManager.errorTag("timeError", "移除了所有计时器--禁止调用");
		this._timeMap = {};
	}

	/**
	 * 检测时钟
	 */
	private tickHandler(time: number) {
		this.onceUpdateFrame();
		var timeEntity: TimeEntity;
		var curTime: number = Laya.timer.currTimer;
		var num: number = 0;
		for (var i in this._timeMap) {
			timeEntity = this._timeMap[i];
			var isRemove: boolean = false
			num = Math.floor((curTime - timeEntity.oldTime) / timeEntity.delay);
			if (num > 0) {
				timeEntity.maxCount -= num;
				timeEntity.oldTime += num * timeEntity.delay;
				var args = timeEntity.args;
				var callBack = timeEntity.callBack;
				var thisObject = timeEntity.thisObject;
				if (timeEntity.maxCount <= 0) {
					delete this._timeMap[i];
					isRemove = true;
				}
				if (args.length > 0) {
					callBack.apply(thisObject, args);
				} else {
					callBack.apply(thisObject, [num]);
				}
			}
		}
		return true;
	}


	//上一次刷新时间
	private _lastFrameTime = 0;
	//每次刷新的最大时间差. 防止且后台回来刷新次数过多导致卡死
	private _maxFrameDt = 5 * 1000 / GameConsts.gameFrameRate;
	private _leftFrameDt = 0;
	private _oneFrameDt = 1000 / GameConsts.gameFrameRate;

	/**
	 *
	 * id:{
	 * 	callBack, 回调函数
	 * 	thisObj, 回调对象
	 * 	params,  额外的回调参数
	 * 	frame,  剩余时间  -1表示无限时间 >0表示剩余帧数
	 * }
	 *
	 */
	protected updateCallFuncGroup: any = {};
	protected callFuncNums: number = 0;

	//做一次刷新
	private onceUpdateFrame() {

		var currentT = Laya.timer.currTimer;
		var dt = currentT - this._lastFrameTime;
		if (dt > this._maxFrameDt) {
			dt = this._maxFrameDt;
		}

		// LogsManager.echo("timeStamp", timeStamp, "   this._lastFrameTime", this._lastFrameTime, "差值：", dt);
		if (dt > this._maxFrameDt) {
			dt = this._maxFrameDt;
		}
		this._lastFrameTime = currentT;
		this._leftFrameDt += dt;
		var nums = Math.floor(this._leftFrameDt / this._oneFrameDt);
		this._leftFrameDt -= nums * this._oneFrameDt;
		for (var i = 0; i < nums; i++) {
			this._updateFrame();
		}
	}

	//刷新函数
	private _updateFrame() {
		//执行注册的刷新回调
		for (var i in this.updateCallFuncGroup) {
			var info = this.updateCallFuncGroup[i];
			if (info) {
				if (info.frame > 0) {
					info.frame--;
					if (info.frame == 0) {
						delete this.updateCallFuncGroup[i];
					}
				}
				info.callBack.call(info.thisObj, info.params);
			}

		}

	}

	public setTimeout(callBack: Function, thisObject: any, delay: number, ...args: any[]): number {
		return this.add(callBack, thisObject, delay, 1, false, args);
	}

	public clearTimeout(key: number) {
		return this.remove(key);
	}


	//给外部对象调用一个注册刷新的接口 . 必须手动注册和销毁.返回一个注册的刷新id.可以用来销毁
	public registObjUpdate(callFunc, callThisObj, params = null, frame: number = -1) {
		this.callFuncNums++;
		this.updateCallFuncGroup[String(this.callFuncNums)] = {
			callBack: callFunc,
			thisObj: callThisObj,
			params: params,
			frame: frame,
		}
		return this.callFuncNums;
	}

	//销毁一个注册刷新函数 传callId 或者 调用函数以及调用指针
	public deleteObjUpdate(callId = null, callFunc = null, callThisObj = null) {
		var info
		if (callId) {
			delete this.updateCallFuncGroup[callId];
		} else {
			for (var i in this.updateCallFuncGroup) {
				var info = this.updateCallFuncGroup[i];
				if (info.callBack == callFunc && info.thisObj == callThisObj) {
					delete this.updateCallFuncGroup[i];
					break;
				}
			}

		}
	}

	//判断是否跨天了
	public checkOverDay(targetTime: number) {
		var daySecond = 3600000 * 24
		//需要用时间戳减去时区
		var day1 = Math.floor((targetTime - TimerManager.timeOurOffset * 3600000) / daySecond);
		var day2 = Math.floor((Client.instance.miniserverTime - TimerManager.timeOurOffset * 3600000) / daySecond);
		if (day1 != day2) {
			return true;
		}
		return false;

	}


}
