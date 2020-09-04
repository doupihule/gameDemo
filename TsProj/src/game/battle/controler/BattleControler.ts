import InstanceBasic from "../instance/InstanceBasic";
import CameraControler from "./CameraControler";
import BattleSceneManager from "../../sys/manager/BattleSceneManager";
import BattleConst from "../../sys/consts/BattleConst";
import GameConsts from "../../sys/consts/GameConsts";
import BattleTweenControler from "./BattleTweenControler";
import CameraExpand from "../../../framework/components/d3/CameraExpand";
import Client from "../../../framework/common/kakura/Client";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";

/**
 * 游戏的控制器 基类. 
 * 是一个中枢. 
 * 保证游戏所有对象都能通过controler 访问到.
 */
export default class BattleControler {
	//存储所有实例的数组,并会对实例进行深度排列
	protected _allInstanceArr: any[];
	//可以根据需要 在扩容几个其他数组.比如角色数组. 比如地面的龙
	protected _playerArr: any[];

	//存放所有怪物的数组
	protected _monsterArr: any[];

	//是否是游戏暂停
	public _isGamePause: boolean = false;

	protected _isDisposed: boolean;

	public cameraControler: CameraControler;
	public tweenControler: BattleTweenControler;

	// 战斗状态 0 是非战斗, 1 是战斗中 2 是战斗结束
	public battleState: number;
	public battleCamera: CameraExpand;

	protected _oneFrameDt: number;
	//每帧最大的延迟间隔 是5帧时间
	protected _maxFrameDt: number;
	protected _leftFrameDt: number = 0;

	public battleScene: Base3dViewExpand;
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
	 * 		leftFrame:
	 * 		callBack:
	 * 		thisObj:
	 * 		params: 
	 *   }
	 * 
	 * }
	 * 
	 */
	protected _timeList: any[];

	//当前更新次数
	updateCount: number = 0;

	protected _lastFrameTime: number = 0;


	public constructor(ctn: any) {
		this._allInstanceArr = [];
		this.battleCamera = BattleSceneManager.instance.battleCamera
		this._playerArr = [];
		this._monsterArr = [];
		this.battleState = BattleConst.battleState_out;
		this.cameraControler = new CameraControler(this);
		this._timeList = [];
		this.updateCallFuncGroup = {};
		//一帧对应的毫秒数
		this._oneFrameDt = Math.round(1000 / GameConsts.gameFrameRate);
		this._maxFrameDt = 5 * this._oneFrameDt;
		this.tweenControler = new BattleTweenControler(this);
	}

	protected onceUpdateFrame() {

		/**
		 * 这里做追帧逻辑. 原因: 计算2帧时间间隔. 如果超过1帧时间 .把时间差记录下来.累积时间差超过1帧会额外做一次逻辑update. 
		 * 主要针对特别卡的设备. 比如iphone5s
		 * 
		 */
		var currentT = Client.instance.miniserverTime;
		var dt = currentT - this._lastFrameTime;
		if (dt > this._maxFrameDt) {
			dt = this._maxFrameDt;
		}
		this._lastFrameTime = currentT;
		this._leftFrameDt += dt;
		var nums = Math.floor(this._leftFrameDt / this._oneFrameDt);
		this._leftFrameDt -= nums * this._oneFrameDt;
		for (var i = 0; i < nums; i++) {
			this.updateFrame();
			this.updatePhysics();
		}
	}



	protected updateFrame() {
		if (this._isGamePause) {
			return;
		}
		if (this._isDisposed) {
			return;
		}

		//做更新次数+1
		this.updateCount++;
		//所有对象的刷新
		this.runInstanceUpdate();
		//后面还会扩展 比如 刷怪控制器
		// 逻辑ai控制
		// 摄像头控制器 等等.

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

	}

	updatePhysics() {

	}


	//执行延迟回调函数 
	protected doDelayCallFunc() {
		if (this._timeList.length == 0) {
			return;
		}

		for (var i = this._timeList.length - 1; i >= 0; i--) {
			var info = this._timeList[i];
			info.frame--;
			//先移除 在执行回调.因为回调函数里面可能 会继续插入回调 导致栈混乱 
			if (info.frame <= 0) {
				this._timeList.splice(i, 1);
				//如果有回调函数 那么执行回调函数 
				if (info.callBack) {
					if (info.doApplyOrCall) {
						info.callBack.apply(info.thisObj, info.params);
					} else {
						info.callBack.call(info.thisObj, info.params);
					}

				}

			}

		}

	}



	//更新所有实例
	private runInstanceUpdate() {

		//这里要倒着遍历. 因为在执行每个对象的update的过程中 可能会销毁某个对象 导致数组变化
		var len: number = this._allInstanceArr.length;
		for (var i = len - 1; i >= 0; i--) {
			var instance: InstanceBasic = this._allInstanceArr[i];
			//只有当这个对象没有被销毁的时候 才执行刷新函数
			if (instance && !instance.checkIsDispose()) {
				instance.updateFrame()
			}
		}
		//检测碰撞碰撞会更新速度
		this.checkHit();
		//重新运动
		for (var i = len - 1; i >= 0; i--) {
			var instance: InstanceBasic = this._allInstanceArr[i];
			//只有当这个对象没有被销毁的时候 才执行刷新函数
			if (instance && !instance.checkIsDispose()) {
				instance.updateFrameLater()
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
		var obj = {
			frame: frame,
			callBack: callBack,
			thisObj: thisObj,
			params: params,
			doApplyOrCall: doApplyOrCall
		}
		this._timeList.push(obj);
	}

	//清除回调函数 , 如果不传callBack 表示删除 这个对象注册的所有回调
	public clearCallBack(thisObj, callBack = null) {
		for (var i = this._timeList.length - 1; i >= 0; i--) {
			var obj = this._timeList[i];
			if (thisObj == obj.thisObj) {
				if (!callBack) {
					this._timeList.splice(i, 1);
				} else {
					if (callBack == obj.callBack) {
						this._timeList.splice(i, 1);
						break;
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
		this._isDisposed = true;
		for (var i in this._allInstanceArr) {
			this._allInstanceArr[i].dispose();
		}
		this._playerArr = null;
		this._monsterArr = null;
		this._allInstanceArr = null;
		this._timeList = [];
	}
}