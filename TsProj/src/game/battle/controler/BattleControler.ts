import InstanceBasic from "../instance/InstanceBasic";
import CameraControler from "./CameraControler";
import RefreshControler from "./RefreshControler";

import BattleConst from "../../sys/consts/BattleConst";
import GameConsts from "../../sys/consts/GameConsts";
import BattleTweenControler from "./BattleTweenControler";
import LogsManager from "../../../framework/manager/LogsManager";
import InstanceLogical from "../instance/InstanceLogical";
import PerformanceControler from "./PerformanceControler";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import InstancePlayer from "../instance/InstancePlayer";
import BattleDebugTool from "./BattleDebugTool";
import Client from "../../../framework/common/kakura/Client";

/**
 * 游戏的控制器 基类.
 * 是一个中枢.
 * 保证游戏所有对象都能通过controler 访问到.
 */
export default class BattleControler {
	//存储所有实例的数组,并会对实例进行深度排列
	protected _allInstanceArr: any[];
	public campArr_1: InstanceLogical[];		//存放我方所有角色数组
	public campArr_2: InstanceLogical[];		// 存放敌方所有角色数组

	public diedArr_1: InstanceLogical[];		//某个角色死亡的时候 存到对应的数组里面去便于后续复活等逻辑
	public diedArr_2: InstanceLogical[];
	public player: InstancePlayer;		//角色控制器

	//是否是游戏暂停
	public _isGamePause: boolean = false;

	//是否是技能暂停
	public isSkillPause: boolean = false;

	protected _isDisposed: boolean;

	public cameraControler: CameraControler;		//镜头控制器
	public tweenControler: BattleTweenControler;	//缓动控制器
	public performanceControler: PerformanceControler;	//战斗表现控制器

	// 战斗状态 0 是非战斗, 1 是战斗中 2 是战斗结束		
	public battleState: number;

	protected _oneFrameDt: number;			//一帧对应的毫秒数

	protected _maxFrameDt: number; 	//每帧最大的延迟间隔 是5帧时间
	protected _leftFrameDt: number = 0;

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
	protected updateCallFuncGroup: any;
	protected callFuncNums: number = 0;


	//处理一些延迟函数 
	/**
	 * {
	 * 	id: {
	 * 		frame: frame,
			interval:frame,
			times:1,
			callBack: callBack,
			thisObj: thisObj,
			params: params,
			doApplyOrCall: doApplyOrCall
	 *   }
	 * 
	 * }
	 *
	 */
	protected _timeList: any[];

	//缓存time对象. 防止内存一直增长 .如果设置过多的回调函数的话
	protected _cacheTimeArr: any[];

	//当前更新次数
	updateCount: number = 0;

	//刷怪控制器
	public refreshControler: RefreshControler;

	protected _lastFrameTime: number = 0;

	//游戏硬直时间
	public stillFrame: number = 0;

	//游戏加速倍率 默认是1
	public updateScale: number = 1;
	private _leftScaleFrame: number = 0;	//剩余要追scale的帧数
	//战斗调试器
	public battleDebugTool: BattleDebugTool;

	public constructor(ctn: any) {
		this.performanceControler = new PerformanceControler(this);
		this._allInstanceArr = [];
		this.battleState = BattleConst.battleState_out;
		this.cameraControler = new CameraControler(this);
		this._timeList = [];
		this._cacheTimeArr = [];
		this.updateCallFuncGroup = {};
		//一帧对应的毫秒数
		this._oneFrameDt = Math.round(1000 / GameConsts.gameFrameRate);
		this._maxFrameDt = 5 * this._oneFrameDt;
		this.tweenControler = new BattleTweenControler(this);
		this.battleDebugTool = new BattleDebugTool(this);
		this.updateScale = BattleDebugTool.getBattleAddSped();
		if (!this.updateScale) {
			this.updateScale = 1;
		}

	}

	protected onceUpdateFrame() {

		/**
		 * 这里做追帧逻辑. 原因: 计算2帧时间间隔. 如果超过1帧时间 .把时间差记录下来.累积时间差超过1帧会额外做一次逻辑update.
		 * 主要针对特别卡的设备. 比如iphone5s
		 *
		 */
		var currentT = Client.instance.miniserverTime
		var dt = currentT - this._lastFrameTime;
		if (dt > this._maxFrameDt) {
			dt = this._maxFrameDt;
		}
		this._lastFrameTime = currentT;
		this._leftFrameDt += dt;
		var nums = Math.floor(this._leftFrameDt / this._oneFrameDt);
		this._leftFrameDt -= nums * this._oneFrameDt;
		for (var i = 0; i < nums; i++) {

			if (this.updateScale == 1) {
				this.updateFrame();
			} else {
				this._leftScaleFrame += this.updateScale;
				var s = 0;
				for (s = 0; s < this._leftScaleFrame; s++) {
					this.updateFrame();
				}
				this._leftScaleFrame -= s;
			}


		}
	}


	private _leftCatchTime: number = 0;

	//总的追帧刷新函数
	protected updateFrame() {
		//做更新次数+1
		this.updateCount++;
		this.refreshControler.updateFrame();
		//所有对象的刷新
		this.runInstanceUpdate();
		this.cameraControler.updateFrame();
		//后面还会扩展 比如 刷怪控制器
		// 逻辑ai控制
		// 摄像头控制器 等等.
		this.tweenControler.updateFrame();
		//执行延迟回调
		this.doDelayCallFunc();
		//执行注册的刷新回调
		for (var i in this.updateCallFuncGroup) {
			var info = this.updateCallFuncGroup[i];
			info.callBack.call(info.thisObj, info.params);
			if (info.frame > 0) {
				info.frame--;
				if (info.frame == 0) {
					delete this.updateCallFuncGroup[i];
				}
			}
		}
		this.sortChildren();
		//this.checkHasSameInstance()
	}

	private checkHasSameInstance() {
		if (this.updateCount % 100 != 0) {
			return;
		}
		for (var i = 0; i < this._allInstanceArr.length - 1; i++) {
			var instance1 = this._allInstanceArr[i];
			for (var j = i + 1; j < this._allInstanceArr.length; j++) {
				var instance2 = this._allInstanceArr[j];
				if (instance1 == instance2) {
					LogsManager.errorTag("instanceError", "对象重复了--", instance1);
				}
			}
		}
	}

	//深度排列
	public sortChildren(isForce: boolean = false) {
		//目前只对角色做深度排列
		//1秒算一次
		if ((!isForce) && this.updateCount % 60 != 0) {
			return;
		}
		this.sortOneArr(this._allInstanceArr);

	}

	//每一秒更新一次所有对象的zorder
	private sortOneArr(campArr) {
		for (var i = 0; i < campArr.length; i++) {
			var role: InstanceBasic = campArr[i];
			role.updateViewZorder();
		}
	}


	//执行延迟回调函数 
	protected doDelayCallFunc() {
		if (this._timeList.length == 0) {
			return;
		}
		//这里分一下技能暂停和非技能暂停处理. 为了提高效率 . 分2个逻辑执行
		if (!this.isSkillPause) {
			for (var i = this._timeList.length - 1; i >= 0; i--) {
				var info = this._timeList[i];
				if (!info) {
					BattleLogsManager.battleEcho("_在延迟回调里面做了清理延迟回调事情,导致序列变了");
					continue;
				}

				//执行一次回调判断
				this.doOneCallInfo(info, i);
				var obj = info.thisObj
				if (obj && obj.upTimeScale) {
					info.frame -= obj.upTimeScale;
				} else {
					info.frame -= 1;
				}

			}
		} else {
			for (var i = this._timeList.length - 1; i >= 0; i--) {
				var info = this._timeList[i];
				if (!info) {
					BattleLogsManager.battleEcho("_在延迟回调里面做了清理延迟回调事情,导致序列变了");
					continue;
				}
				var thisObj = info.thisObj;
				var isRunWithSkillPause = true
				if (thisObj && thisObj.isRunWithSkillPause && !thisObj.isRunWithSkillPause()) {
					isRunWithSkillPause = false;
				}
				if (isRunWithSkillPause) {
					//执行一次回调判断
					this.doOneCallInfo(info, i);
					if (thisObj && thisObj.upTimeScale) {
						info.frame -= thisObj.upTimeScale;
					} else {
						info.frame -= 1;
					}
				}

			}
		}


	}

	//执行一次
	private doOneCallInfo(info: any, i: number = -1) {
		//先移除 在执行回调.因为回调函数里面可能 会继续插入回调 导致栈混乱 
		if (info.frame <= 0) {
			if (info.times > 0) {
				info.times--;
			}
			var doApplyOrCall = info.doApplyOrCall;
			var callBack = info.callBack;
			var thisObj = info.thisObj;
			var params = info.params
			var endCallBack = info.endCallBack;
			var endParams = info.endParams;

			if (info.times == 0) {
				//缓存起来
				this._cacheTimeArr.push(info);
				if (i != -1) {
					this._timeList.splice(i, 1);
				}
				//如果有end回调的执行end回调 
				if (endCallBack) {
					if (doApplyOrCall) {
						endCallBack.apply(thisObj, endParams);
					} else {
						endCallBack.call(thisObj, endParams);
					}
				}

			} else {
				//重新开始
				info.frame = info.interval;
				// BattleLogsManager.battleEcho("_重新开始计数",info.times);
			}
			//如果有回调函数 那么执行回调函数 
			if (callBack) {
				if (doApplyOrCall) {
					callBack.apply(thisObj, params);
				} else {
					callBack.call(thisObj, params);
				}
			}
		}
	}

	//获取一个缓存的timeobj
	private getOneCacheTimeObj() {
		if (this._cacheTimeArr.length == 0) {
			return {};
		} else {
			return this._cacheTimeArr.shift();
		}
	}

	//更新所有实例
	private runInstanceUpdate() {

		if (this.player) {
			this.player.updateFrame();
		}
		//这里要倒着遍历. 因为在执行每个对象的update的过程中 可能会销毁某个对象 导致数组变化
		var len: number = this._allInstanceArr.length;
		for (var i = len - 1; i >= 0; i--) {
			var instance: InstanceBasic = this._allInstanceArr[i];
			//只有当这个对象没有被销毁的时候 才执行刷新函数
			if (instance && instance.checkIsUsing()) {
				if (!this.isSkillPause || instance.isRunWithSkillPause()) {
					instance.updateFrame()
				}
			}
		}
		//检测碰撞碰撞会更新速度
		this.checkHit();
		//重新运动
		for (var i = len - 1; i >= 0; i--) {
			var instance: InstanceBasic = this._allInstanceArr[i];
			//只有当这个对象没有被销毁的时候 才执行刷新函数
			if (instance && instance.checkIsUsing()) {
				if (!this.isSkillPause || instance.isRunWithSkillPause()) {
					instance.updateFrameLater()
				}

			}
		}
	}

	//子类重写
	protected checkHit() {

	}


	//设置回调函数
	/**
	 * frame: 延迟帧数
	 * callBack: 回调函数
	 * params:回调附带参数
	 * doApplyOrCall: 回调是callFunc.call 还是callFunc.apply ,  默认是callFunc.call
	 *  如果doApplyOrCall是true , 那么 params必须是数组格式
	 */
	public setCallBack(frame: number, callBack: any, thisObj: any, params: any = null, doApplyOrCall = false) {
		if (frame == null || isNaN(frame)) {
			LogsManager.errorTag("battleerror", "没有传入frame,直接做回调");
		}
		var obj = this.getOneCacheTimeObj();
		if (!frame) {
			if (doApplyOrCall) {
				callBack.apply(thisObj, params)
			} else {
				callBack.call(thisObj, params);
			}
			return;
		}
		obj.frame = frame;
		obj.interval = frame;
		obj.times = 1;
		obj.callBack = callBack;
		obj.thisObj = thisObj;
		obj.params = params;
		obj.doApplyOrCall = doApplyOrCall;
		this._timeList.push(obj);
	}

	/**
	 * 设置持续回调
	 * @param delay  延迟帧数
	 * @param interval  间隔帧数
	 * @param times  执行次数 -1表示永久. 必须手动清除
	 * @param callBack  回调
	 * @param thisObj  作用指针
	 * @param params  回调附带参数
	 * @param doApplyOrCall
	 */
	public setLastCallBack(delay: number, interval: number, times: number, callBack: any, thisObj: any, params: any = null, endCallBack: any = null, endParams: any = null, doApplyOrCall = false) {
		if (delay == null || isNaN(delay)) {
			LogsManager.errorTag("battleerror", "没有传入frame");
			return;
		}
		var obj = this.getOneCacheTimeObj();
		obj.frame = delay;
		obj.interval = interval;
		obj.times = times;
		obj.callBack = callBack;
		obj.thisObj = thisObj;
		obj.params = params;
		obj.doApplyOrCall = doApplyOrCall;
		obj.endCallBack = endCallBack;
		obj.endParams = endParams;
		this._timeList.push(obj);
		this.doOneCallInfo(obj, this._timeList.length - 1);
	}


	//清除回调函数 , 如果不传callBack 表示删除 这个对象注册的所有回调, params,同时匹配参数是否相等才清除回调
	public clearCallBack(thisObj, callBack = null, params: any = null) {
		for (var i = this._timeList.length - 1; i >= 0; i--) {
			var obj = this._timeList[i];
			if (thisObj == obj.thisObj) {
				if (!callBack) {
					this._timeList.splice(i, 1);
				} else {
					if (callBack == obj.callBack) {
						if (params == null) {
							this._timeList.splice(i, 1);
						} else {
							if (params == obj.params) {
								this._timeList.splice(i, 1);
							}
						}

					}
				}
			}
		}
	}


	//给外部对象调用一个注册刷新的接口 游戏退出的时候自动销毁这个回调. 所以必须在每次游戏开始的时候 手动注册一次
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

	//删除注册的刷新回调
	public deleteObjUpdate(callFuncNums = null, callFunc, callThisObj) {
		for (var index = 0; index < this.updateCallFuncGroup.length; index++) {
			if (callFuncNums == index) {
				delete this.updateCallFuncGroup[index];
				break;
			}
		}

	}

	//插入一个实例
	public insterInstanceToArr(instance: InstanceBasic) {
		if (this._allInstanceArr.indexOf(instance) == -1) {
			this._allInstanceArr.push(instance);
		}
	}

	//获取所有的实例 
	public getAllInstanceArr() {
		return this._allInstanceArr;
	}

	//设置战斗状态
	public setBattleState(value) {
		this.battleState = value;
	}

	//设置游戏暂停或者播放
	public setGamePlayOrPause(value) {
		this._isGamePause = value;
	}


	//销毁游戏 养成习惯,所有的对象都需要有dispose 函数
	public dispose() {
		if (this._isDisposed) {
			return;
		}
		this._timeList = [];
	}
}