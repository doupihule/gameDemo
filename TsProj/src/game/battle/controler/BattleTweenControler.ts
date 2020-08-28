import BattleLogicalControler from "./BattleLogicalControler";
import BattleConst from "../../sys/consts/BattleConst";
import InstanceBasic from "../instance/InstanceBasic";
import BaseContainer from "../../../framework/components/BaseContainer";

/**
 * 战斗缓存行为控制器
 *
 */

export default class BattleTweenControler {

	public controler: BattleLogicalControler;

	//缓动信息表 根据游戏类型自己扩展 运动行为 初步只封装基础的 匀速运动.旋转

	/**
	 * [
	 *  {
	 *      type: 缓动方式   支持多种组合
	 *      instance: 对应的InstanceBasic
	 *      frame: 已经运行的时间
	 *      totalFrame:总时间
	 *      callBack: 缓动回调
	 *      thisObj: 回调函数指针
	 *      //初始信息
	 *      startParams:{
	 *          x,y,sx,sy,rx,ry, tf(总时间)
	 *      }
	 *      //目标信息
	 *      targetParams:{
	 *       }
	 *  }
	 * ]
	 *
	 *
	 */

	private _tweenInfoMap: any[]

	constructor(controler) {
		this.controler = controler;
		this._tweenInfoMap = [];
	}

	public setData() {
		this._tweenInfoMap = [];
	}

	//由主控制器 控制
	public updateFrame() {
		for (var i = this._tweenInfoMap.length - 1; i >= 0; i--) {
			var info = this._tweenInfoMap[i];
			var isEnd = this.updateOneTween(info);
			if (isEnd) {
				this._tweenInfoMap.splice(i, 1);
			}
		}
	}

	//更新一个tween
	protected updateOneTween(tweenInfo) {
		var type = tweenInfo.type;
		tweenInfo.frame++;
		var ratio = tweenInfo.frame / tweenInfo.totalFrame;
		var mode = tweenInfo.mode;
		//暂时给匀速运动
		var startParams = tweenInfo.startParams;
		var targetParams = tweenInfo.targetParams;
		var disParams = tweenInfo.disParams;
		var instance: any = tweenInfo.instance;
		//如果是有运动行为的
		if (this.checkHasType(type, BattleConst.TWEEN_MOVE)) {
			var targetx: number, targety: number, targetz: number;

			if (mode == 1) {
				disParams.x == 0 ? targetx = instance.pos.x : targetx = startParams.x + disParams.x * ratio
				disParams.y == 0 ? targety = instance.pos.y : targety = startParams.y + disParams.y * ratio
				disParams.z == 0 ? targetz = instance.pos.z : targetz = startParams.z + disParams.z * ratio
				instance.setPos(targetx, targety, targetz);
			} else {
				disParams.x == 0 ? targetx = instance.x : instance.x = startParams.x + disParams.x * ratio
				disParams.y == 0 ? targety = instance.y : instance.y = startParams.y + disParams.y * ratio

			}

		}

		if (this.checkHasType(type, BattleConst.TWEEN_ROTATE)) {
			var rx: number, ry: number, rz: number;
			if (mode == 1) {
				disParams.r == 0 ? false : instance.setRotation(startParams.r + disParams.r * ratio);
			} else {
				disParams.r == 0 ? false : instance.rotation = (startParams.r + disParams.r * ratio);
			}
		}
		if (this.checkHasType(type, BattleConst.TWEEN_SCALE)) {
			var scale = startParams.s + disParams.s * ratio
			if (mode == 1) {
				instance.setViewScale(scale)
			} else {
				instance.scale(scale, scale);
			}

		}

		if (this.checkHasType(type, BattleConst.TWEEN_ALPHA)) {
			var value = startParams.a + disParams.a * ratio
			if (mode == 1) {
				instance.setViewAlpha(value)
			} else {
				instance.alpha = value;
			}
		}

		//如果到达最后一帧了
		if (tweenInfo.frame == tweenInfo.totalFrame) {
			if (tweenInfo.callBack) {
				tweenInfo.callBack.call(tweenInfo.thisObj, tweenInfo.callParams);
			}
			return true;
		}
		return false;

	}

	//设置一个缓动信息
	/**
	 *
	 * @param frame 运动时间
	 * @param targetParams:  {x:1,y:1,z:1,s:1,rx:1,ry:1,rz:1};
	 * x,y,z 必须同时配,  rx,ry,rz 也必须同时配
	 */
	public setOneTween(frame: number, instance: InstanceBasic, targetParams, type, callBack = null, thisObj = null, callBackParams = null) {

		this.clearOneTween(instance);
		var startParams = {
			x: instance.pos.x, y: instance.pos.y, z: instance.pos.z, s: instance.viewScale,
			r: instance._myView.rotation, a: instance.getView().alpha
		};

		var disParams: any = {}
		if (this.checkHasType(type, BattleConst.TWEEN_MOVE)) {
			disParams.x = this.adjustNumber(targetParams.x - startParams.x)
			disParams.y = this.adjustNumber(targetParams.y - startParams.y)
			disParams.z = this.adjustNumber(targetParams.z - startParams.z)
		}

		if (this.checkHasType(type, BattleConst.TWEEN_ROTATE)) {
			disParams.r = this.adjustNumber(targetParams.r - startParams.r)
		}

		if (this.checkHasType(type, BattleConst.TWEEN_SCALE)) {
			disParams.s = targetParams.s - startParams.s
		}
		if (this.checkHasType(type, BattleConst.TWEEN_ALPHA)) {
			disParams.a = targetParams.a - startParams.a
		}

		var tweenInfo = {
			startParams: startParams,
			targetParams: targetParams,
			type: type,
			callBack: callBack,
			thisObj: thisObj,
			callParams: callBackParams,
			instance: instance,
			frame: 0,
			totalFrame: frame,
			disParams: disParams,    //差值
			mode: 1,             //缓动instance
		}

		this._tweenInfoMap.push(tweenInfo);
	}

	//直接对view设置一个tween
	public setTweenByView(frame: number, view: BaseContainer, targetParams: any, type: number, callBack = null, thisObj = null, callBackParams: any = null) {
		this.clearOneTween(view);
		var startParams: any = {
			x: view.x, y: view.y, s: view.scale,
			r: view.rotation, a: view.alpha
		};

		var disParams: any = {}
		if (this.checkHasType(type, BattleConst.TWEEN_MOVE)) {
			disParams.x = this.adjustNumber(targetParams.x - startParams.x)
			disParams.y = this.adjustNumber(targetParams.y - startParams.y)
			disParams.z = this.adjustNumber(targetParams.z - startParams.z)
		}

		if (this.checkHasType(type, BattleConst.TWEEN_ROTATE)) {
			disParams.r = this.adjustNumber(targetParams.r - startParams.r)
		}

		if (this.checkHasType(type, BattleConst.TWEEN_SCALE)) {
			disParams.s = targetParams.s - startParams.s
		}
		if (this.checkHasType(type, BattleConst.TWEEN_ALPHA)) {
			disParams.a = targetParams.a - startParams.a
		}

		var tweenInfo = {
			startParams: startParams,
			targetParams: targetParams,
			type: type,
			callBack: callBack,
			thisObj: thisObj,
			callParams: callBackParams,
			instance: view,
			frame: 0,
			totalFrame: frame,
			disParams: disParams,    //差值
			mode: 2,             //缓动view
		}

		this._tweenInfoMap.push(tweenInfo);
	}

	//销毁一个tween
	public clearOneTween(instance: any) {
		for (var i = this._tweenInfoMap.length - 1; i >= 0; i--) {
			var info = this._tweenInfoMap[i];
			if (info.instance == instance) {
				//移除这个tween
				this._tweenInfoMap.splice(i, 1);
			}
		}
	}


	//判断是否有某一个类型
	private checkHasType(bit, type) {
		return (bit & type) != 0;
	}


	//对number 进行接近0的判断
	protected adjustNumber(value) {
		if (Math.abs(value) < 0.001) {
			return 0;
		}
		return value;
	}

	// 销毁所有的tween对象
	public dispose() {
		for (var i = this._tweenInfoMap.length - 1; i >= 0; i--) {
			var info = this._tweenInfoMap[i];
			//立马做一次回调
			if (info.callBack) {
				info.callBack.call(info.thisObj, info.callParams);
			}
		}
	}


}