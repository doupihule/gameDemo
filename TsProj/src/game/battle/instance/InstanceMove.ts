import BattleControler from "../controler/BattleControler";
import InstanceMoveEntity from "./InstanceMoveEntity";
import InstanceMoveMultyEntity from "./InstanceMoveMultyEntity";
import BattleFunc from "../../sys/func/BattleFunc";

import BattleConst from "../../sys/consts/BattleConst";
import InstanceBasic from "./InstanceBasic";
import PoolCode from "../../sys/consts/PoolCode";
import InstanceEffect from "./InstanceEffect";
import SkillExpandTrigger from "../trigger/SkillExpandTrigger";
import VectorTools from "../../../framework/utils/VectorTools";

/**
 * 游戏中所有可以运动的对象的基类
 * 如果需要对instance的view进行拖拽, 那么需要在onTouchMove里面 改变的应该是 this.pos.x 而不能直接去设置myview.x,myView.y
 * 禁止在任何地址直接设置myView的坐标
 */

export default class InstanceMove extends InstanceBasic {

	//没有运动
	static moveType_none: number = 0
	//运动到一个点
	static moveType_onePoint: number = 1
	//运动到多个点
	static moveType_multyPoint: number = 2
	//做tween缓动行为
	static moveType_tween: number = 3;

	static state_stand: string = "stand";
	static state_move: string = "move";

	//定义速度
	public speed: {x,y,z};
	//加速度
	public addSpeed: {x,y,z};
	public dragForce: {x,y,z}; //阻力系数 
	//当前运动到点类型 0表示不运动.1 表示运动到目标点
	movePointType: number = 0;

	//定义角速度
	public rotateSpeed: {x,y,z};
	protected enbleRotate: boolean = false;

	//运动参数
	protected _moveParams: InstanceMoveEntity;
	//多点运动参数对象
	protected _multyparams: InstanceMoveMultyEntity;
	protected _myState: string = "stand"

	//是否受重力
	public gravityAble: boolean = false;

	// 碰撞尺寸
	public knockSizeBox: any[];

	//速度方向的单位向量 
	protected unitVector: {x,y,z};

	//地面坐标
	public landPos: number = BattleFunc.defaultRoleYpos;

	public blookSpeed: {x,y,z};

	protected isViewShow: boolean = true;


	public initRotateCtnPos: {x,y,z};

	public _followEffGroup: InstanceEffect[]
	//配置的缩放值
	public cfgScale: number = 1;

	public constructor(controler: BattleControler) {
		super(controler)
		this.gridPos = VectorTools.createVec3();
		this.speed = VectorTools.createVec3();

		//定义角速度
		this.rotateSpeed = VectorTools.createVec3();
		this.addSpeed = VectorTools.createVec3();
		this.unitVector = VectorTools.createVec3();
		this.dragForce = VectorTools.createVec3(1, 1, 1);
		this.blookSpeed = VectorTools.createVec3(0, 0, 0);
		this.isViewShow = true;
		this.initRotateCtnPos = VectorTools.createVec3();
		this._followEffGroup = [];
	}

	//初始化站立状态(也就是闲置)
	initStand() {
		this._myState = BattleConst.state_stand;
		this.speed.x = 0;
		this.speed.y = 0;
		this.speed.z = 0;
		// this.pos.y =0;


	}

	//初始化运动 ,子类可根据这个继承,并改变视图的朝向或者 动作显示
	initMove(x: number = 0, y: number = 0, z: number = 0, outAdjustWay: boolean = false) {
		this.speed.x = x;
		this.speed.y = y;
		this.speed.z = z
		this._myState = BattleConst.state_move;
		//是否忽略调整方向
		if (!outAdjustWay) {
			if (x > 0) {
				this.setViewWay(1)
			} else if (x < 0) {
				this.setViewWay(-1);
			}
		}

	}


	//设置跳跃速度
	initJump(y: number) {
		this.speed.y = y;
		this._myState = BattleConst.state_jump;
		this.gravityAble = true;
	}


	//重写执行逻辑函数
	public doAiLogical() {
		this.checkMoveEnd();
	}

	//更新速度,根据需要扩展,比如加速度,重力加速度.
	protected updateSpeed() {
		//如果是静止的不执行减少运算
		if (this._myState == BattleConst.state_stand) {
			return;
		}
		this.speed.x = this.setSpeed(this.speed.x, this.addSpeed.x, this.dragForce.x);
		//空中状态才执行下落
		if (this._myState == BattleConst.state_jump) {
			this.speed.y = this.setSpeed(this.speed.y, this.addSpeed.y, this.dragForce.y);
		}

		this.speed.z = this.setSpeed(this.speed.z, this.addSpeed.z, this.dragForce.z);
	}

	//设置速度=速度*阻力系数+加速度
	setSpeed(speedSpace, addSpead, force) {
		//阻力
		speedSpace *= force;
		//更新加速度		
		speedSpace += addSpead;
		return speedSpace;
	}

	//重写运动函数 主要是更新坐标
	movePos() {
		//stand状态不执行
		if (this._myState == BattleConst.state_stand) {
			return;
		}
		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;
		this.pos.z += this.speed.z;
		//如果坐标小于0 而且是朝地面运动状态  而且是受重力影响的 那么才会去检测落地
		if (this.speed.y < 0 && this.pos.y <= this.landPos && this._myState == BattleConst.state_jump && this.gravityAble) {
			this.onHitLand();
		}


	}

	//着陆了 给子系统重写 比如销毁 或者什么
	protected onHitLand() {
		// this.initStand();
		// this.speed.y =0;
		// this.pos.y = this.landPos;
	}


	//运动到目标点 ,只针对平面运动,一般是x,y. movePointType 禁止外部调用
	//expandParams 
	moveToOnePoint(x: number, y: number, z: number = 0, spd: number = 0, callFunc: any = null, thisObj: any = null, callParams = null, expandParams: any = null, movePointType: number = 1) {

		if (!this._moveParams) {
			this._moveParams = new InstanceMoveEntity(VectorTools.createVec3(x, y, z));
		}
		this._moveParams.expandParams = expandParams;
		this._moveParams.followTarget = null;
		this._moveParams.totalFrame = 0;
		this._moveParams.target.x = x;
		this._moveParams.target.y = y;
		this._moveParams.target.z = z;
		//如果是有扩展行为的
		if (expandParams) {
			if (expandParams.target) {
				this._moveParams.followTarget = expandParams.target;
				this._moveParams.offsetPos.x = x;
				this._moveParams.offsetPos.y = y;
				this._moveParams.offsetPos.z = z;
				this._moveParams.updateTargetPos();
			}
			//如果有运动时长的
			if (expandParams.frame) {
				this._moveParams.totalFrame = expandParams.frame;
			}
		}

		var temp: {x,y,z} = BattleFunc.tempPoint;
		//计算目标向量差值

		VectorTools.subtract(this._moveParams.target, this.pos, temp);
		var distance = VectorTools.scalarLength(temp);
		if (this._moveParams.totalFrame > 0 && spd == 0) {
			spd = distance / this._moveParams.totalFrame;
		} else {
			spd = spd || BattleFunc.moveSpeed;
		}

		this._moveParams.spd = spd;
		this._moveParams.moveFrame = 0;
		this._moveParams.callParams = callParams;
		this._moveParams.callFunc = callFunc;
		this._moveParams.thisObj = thisObj;

		this.countMoveSpeed();
		// this._moveParams = params;
		this.movePointType = movePointType;

		this.checkMoveEnd()
	}

	//计算运动速度
	protected countMoveSpeed() {
		var temp: {x,y,z} = BattleFunc.tempPoint;
		//计算目标向量差值
		VectorTools.subtract(this._moveParams.target, this.pos, temp);

		var speed: number = this._moveParams.spd;
		//向量归一
		VectorTools.normalize(temp, this.unitVector);
		//计算速度单位向量 乘以速度绝对值
		VectorTools.scale(this.unitVector, speed, this._moveParams.initSpeed);
		//设置预期运动时间
		if (this._moveParams.totalFrame == 0) {
			var distance = VectorTools.scalarLength(temp);
			this._moveParams.totalFrame = Math.round(distance / speed);
		}
		this.initMove(this._moveParams.initSpeed.x, this._moveParams.initSpeed.y, this._moveParams.initSpeed.z);
	}


	//根据传递的entity 运动
	moveToOnePointByEntity(enetity: InstanceMoveEntity, movePointType: number = 1, isGrid: Boolean = false) {
		var x = enetity.target.x, y = enetity.target.y;
		if (x == null && enetity.target.y != null) {
			x = enetity.target.x;
			y = enetity.target.y;
		}
		this.moveToOnePoint(x, y, enetity.target.z, enetity.spd, enetity.callFunc, enetity.thisObj, enetity.callParams, enetity.expandParams, movePointType);

	}


	//按一组点去运动
	// moveToGroupPoints(params:InstanceMoveMultyEntity){
	moveToGroupPoints(pointArr: {x,y,z}[], speed: number = 0, callFunc: any = null, thisObj: any = null, expandParams: any[], loopParams: any = null) {
		// this._multyparams = params;
		if (!this._multyparams) {
			this._multyparams = new InstanceMoveMultyEntity();
		}

		this._multyparams.initData(pointArr, speed, callFunc, thisObj, loopParams, false);
		this._multyparams.expandParams = expandParams;
		var param = this._multyparams.getNextpos();
		if (!param) {
			LogsManager.errorTag(null, "没有找到当前运动的点");
			return
		}
		this.moveToOnePointByEntity(param, InstanceMove.moveType_multyPoint, false);
	}


	//判断是否到达终点
	checkMoveEnd() {
		if (this.movePointType == InstanceMove.moveType_none) {
			return;
		}
		this._moveParams.moveFrame++;
		//如果是跟随目标的
		if (this._moveParams.followTarget) {
			//重新计算目标以及更新速度
			this._moveParams.updateTargetPos();
			this.countMoveSpeed();
			//如果目标已经销毁 那么直接结束运动
			if (!this._moveParams.followTarget.checkIsUsing()) {
				this.overFinalPoint();
				return;
			}
		}

		if (this._moveParams.moveFrame >= this._moveParams.totalFrame) {
			this.pos.x = this._moveParams.target.x;
			this.pos.y = this._moveParams.target.y;
			this.pos.z = this._moveParams.target.z;
			if (this.movePointType == InstanceMove.moveType_onePoint) {
				this.overFinalPoint();
			} else {
				var param = this._multyparams.getNextpos();
				//如果没有给返回值,直接到达终点
				if (!param) {
					this.overFinalPoint();
				} else {
					this.onArriveOnePoint();
					// this._moveParams = param;
					//重新开始运动到下一个点
					this.moveToOnePointByEntity(param, InstanceMove.moveType_multyPoint, this._multyparams.isGrid);
				}
			}

		}

	}


	//到达一个点 ,子类重写,根据需要转身,或者干嘛 ,这个是针对运动到多个点的运动行为判断的 
	onArriveOnePoint() {

	}


	//判断是否有运动类型行为
	public checkHasMoveType() {
		if (this.movePointType == InstanceMove.moveType_none) {
			return false;
		}
		return true;
	}


	//到达终点
	overFinalPoint() {
		//初始化变成站立状态,通知子类改变动作行为
		this.initStand();
		this.movePointType = InstanceMove.moveType_none;
		var callBack, thisObj;
		if (this._moveParams) {
			callBack = this._moveParams.callFunc;
			thisObj = this._moveParams.thisObj;
			this._moveParams.reset();
			if (callBack) callBack.call(thisObj);
		}
		if (this._multyparams) {
			callBack = this._multyparams.callFunc;
			thisObj = this._multyparams.thisObj;
			this._multyparams.dispose()
			this._multyparams = null;
			if (callBack) callBack.call(thisObj);
		}
	}

	//重写realpoS
	realShowView() {
		//如果是做tween缓动行为的
		if (this.movePointType == InstanceMove.moveType_tween) {
			return
		}
		super.realShowView();
	}


	//朝目标运动
	protected moveToTargetRole(spd: number, targetRole: InstanceBasic) {
		var dx = targetRole.pos.x - this.pos.x;
		var dz = targetRole.pos.z - this.pos.z;

		var ang = Math.atan2(dz, dx);
		var spdx = spd * Math.cos(ang);
		var spdz = spd * Math.sin(ang);
		this.initMove(spdx, 0, spdz);

	}


	//-----------------------------创建特效相关----------------------------------------
	//-----------------------------创建特效相关----------------------------------------
	//-----------------------------创建特效相关----------------------------------------
	//创建特效挪到move里面是因为子弹也需要用到这里面的逻辑
	//特效：  
	/**
	 *   0   特效名,
	 *   1   动作序列(默认1),
	 *   2   偏移方式(1,数值,2万分比),
	 *   3   偏移x值,
	 *   4   偏移y值,
	 *   5   显示层级1地面,2角色后面,3角色前面,4所有角色前面 , 5显示在角色前面并跟随
	 *   6   朝向(-1,永远朝左,0 跟随目标的朝向旋转,1永远朝右);
         7   播放延迟
         8   循环总时长,
         9   循环开始时间,
         10  循环结束时间,
		 11  特效总帧数;
	 */
	public createEffByParams(effectParamsArr: any[], isFollow: boolean = false, isLoop: boolean = false, expandParams: any = null, aniSpeed: number = 1) {
		if (!effectParamsArr || effectParamsArr.length == 0) {
			return;
		}
		if (!this.controler) {
			LogsManager.warn("已经放入缓存了不应该走到这里来");
			return;
		}
		for (var i = 0; i < effectParamsArr.length; i++) {
			var params = effectParamsArr[i];
			this.createOneEffByParam(params, isFollow, isLoop, expandParams, aniSpeed);
		}

	}

	//创建单个特效
	public createOneEffByParam(params: any, isFollow: boolean = false, isLoop: boolean = false, expandParams: any = null, aniSpeed: number = 1) {
		var delayTime = Number(params[7]) || 0;
		params.isFollow = isFollow;
		params.isLoop = isLoop;
		params.expandParams = expandParams;
		params.aniSpeed = aniSpeed;
		if (delayTime > 0) {
			this.controler.setCallBack(BattleFunc.instance.turnMinisecondToframe(delayTime), this.delayCreateEffByParams, this, params);
		} else {
			this.delayCreateEffByParams(params);
		}
	}

	private static _defaultViewSize: number[] = [0, 0]

	//延迟创建特效片
	public delayCreateEffByParams(params) {
		var isFollow = params.isFollow
		var isLoop = params.isLoop
		var offsetType = Number(params[2]);
		var offsetX: number = Number(params[3])
		var offsetY: number = Number(params[4]);
		var effectName = params[0];
		var aniIndex: number = Number(params[1])
		var aniSpeed = params.aniSpeed || 1;
		if (offsetType == 2) {
			if (!this.cfgData) {
				LogsManager.errorTag("cgfserror", "没有配置size,rid:", this.dataId, "类型:", this["lifeType"]);
			}
			var viewSize = this.cfgData.size;
			if (!viewSize) {
				viewSize = InstanceMove._defaultViewSize;
			}
			offsetX = offsetX / 10000 * viewSize[1];
			offsetY = -offsetY / 10000 * viewSize[0];
		} else {
			//y反向
			offsetY *= -1;
		}
		offsetX *= this.cfgScale;
		offsetY *= this.cfgScale;
		var frame = -1;
		if (!isLoop) {
			frame = this.controler.performanceControler.getEffectLength(effectName, aniIndex - 1);
		}
		var layerIndex = Number(params[5])
		var ani: InstanceEffect = this.createEfect(effectName, aniIndex - 1, isLoop, offsetX, offsetY, 0, isFollow, layerIndex, Number(params[6]), frame, aniSpeed)
		var sysFrame = Number(params[8]);
		if (sysFrame && sysFrame > 0 && params.length > 10) {
			ani.playSpecialSysAction(aniIndex - 1, sysFrame, Number(params[9]), Number(params[10]), Number(params[11]) * BattleFunc.battleViewFrameScale, aniSpeed);
		}
		//设置特效扩展参数
		if (params.expandParams) {
			ani.setExpandParams(params.expandParams)
		}
		//特效默认是独立的 传了follow 就认为随玩家角色死亡而消失
		if ((params.expandParams && params.expandParams.follow) || isFollow || layerIndex == 5) {
			if (params.expandParams && params.expandParams.type == SkillExpandTrigger.EXPAND_TYLE_LINEEFFECT) return;
			ani._followTarget = this;
			//如果是跟随特效 那么先清除, 自身不需要挂重复的特效
			this.clearEffByName(ani.cacheId, true);
			this._followEffGroup.push(ani);
		}
	}


	//清除一组特效 
	protected clearEffByParams(effectParams: any[]) {
		if (!effectParams || effectParams.length == 0) {
			return;
		}
		for (var i = 0; i < effectParams.length; i++) {
			//特效缓存是  特效名字+特效动作序号
			this.clearEffByName(PoolCode.POOL_EFFECT + effectParams[i][0] + Number(effectParams[i][1] - 1));
		}
	}

	//清除一个特效
	protected clearEffByName(name: string, clearAll: boolean = false) {
		for (var i = this._followEffGroup.length - 1; i >= 0; i--) {
			var eff: InstanceEffect = this._followEffGroup[i];
			if (eff.cacheId == name) {
				this._followEffGroup.splice(i, 1);
				//销毁这个特效
				this.controler.destoryEffect(eff);
				if (!clearAll) {
					break;
				}
			}
		}
	}

	//清除所有的跟随特效
	public clearAllFollowEffect() {
		//销毁所有的特效
		for (var i = this._followEffGroup.length - 1; i >= 0; i--) {
			this.controler.destoryEffect(this._followEffGroup[i]);
		}
		this._followEffGroup.length = 0;
	}


}