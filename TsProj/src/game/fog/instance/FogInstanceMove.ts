import BattleFunc from "../../sys/func/BattleFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import BattleConst from "../../sys/consts/BattleConst";
import FogInstanceBasic from "./FogInstanceBasic";
import InstanceMoveEntity from "../../battle/instance/InstanceMoveEntity";
import InstanceMoveMultyEntity from "../../battle/instance/InstanceMoveMultyEntity";
import FogFunc from "../../sys/func/FogFunc";

/**
 * 游戏中所有可以运动的对象的基类
 * 如果需要对instance的view进行拖拽, 那么需要在onTouchMove里面 改变的应该是 this.pos.x 而不能直接去设置myview.x,myView.y
 * 禁止在任何地址直接设置myView的坐标
 */

export default class FogInstanceMove extends FogInstanceBasic {

	//没有运动
	static moveType_none: number = 0
	//运动到一个点
	static moveType_onePoint: number = 1
	//运动到一个格子边缘
	static moveType_oneSide: number = 4
	//进入到一个格子
	static moveType_EnterSide: number = 5
	//运动到多个点
	static moveType_multyPoint: number = 2
	//做tween缓动行为
	static moveType_tween: number = 3;

	static state_stand: string = "stand";
	static state_move: string = "move";

	//定义速度
	public speed: Laya.Vector3;
	//加速度
	public addSpeed: Laya.Vector3;
	//当前运动到点类型 0表示不运动.1 表示运动到目标点
	movePointType: number = 0;

	//运动参数
	protected _moveParams: InstanceMoveEntity;
	//多点运动参数对象
	protected _multyparams: InstanceMoveMultyEntity;
	protected _myState: string = "stand"
	// 碰撞尺寸
	public knockSizeBox: any[];
	//速度方向的单位向量 
	protected unitVector: Laya.Vector3;
	//当前移动状态 1到达边缘 2 进入边缘
	private moveState = 0;

	public constructor(controler) {
		super(controler)
		this.speed = VectorTools.createVec3();
		this.addSpeed = VectorTools.createVec3();
		this.unitVector = VectorTools.createVec3();
	}

	//初始化站立状态(也就是闲置)
	initStand() {
		this._myState = BattleConst.state_stand;
		this.speed.x = 0;
		this.speed.y = 0;
		this.speed.z = 0;
	}

	//初始化运动 ,子类可根据这个继承,并改变视图的朝向或者 动作显示
	initMove(x: number = 0, y: number = 0, z: number = 0, outAdjustWay: boolean = false) {
		this.speed.x = x;
		this.speed.y = y;
		this.speed.z = z
		this._myState = BattleConst.state_move;
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
		this.speed.x = this.setSpeed(this.speed.x, this.addSpeed.x);
		//空中状态才执行下落
		if (this._myState == BattleConst.state_jump) {
			this.speed.y = this.setSpeed(this.speed.y, this.addSpeed.y);
		}

		this.speed.z = this.setSpeed(this.speed.z, this.addSpeed.z);
	}

	//设置速度=速度*阻力系数+加速度
	setSpeed(speedSpace, addSpead) {
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
		// this.pos.x = Math.round(this.pos.x + this.speed.x);
		// this.pos.y = Math.round(this.pos.y + this.speed.y);
		// this.pos.z = Math.round(this.pos.z + this.speed.z);
		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;
		this.pos.z += this.speed.z;
	}


	//运动到目标点 ,只针对平面运动,一般是x,y. movePointType 禁止外部调用
	moveToOnePoint(x: number, y: number, z: number = 0, spd: number = 0, callFunc: any = null, thisObj: any = null, callParams = null, expandParams: any = null, movePointType: number = 1) {

		if (!this._moveParams) {
			this._moveParams = new InstanceMoveEntity(VectorTools.createVec3(x, y, z));
		}
		if (!spd || spd == 0) {
			spd = BattleFunc.moveSpeed;
		}
		this._moveParams.target.x = x
		this._moveParams.target.y = y
		this._moveParams.target.z = z

		var speed: number = spd;

		var temp: Laya.Vector3 = BattleFunc.tempPoint;
		//计算目标向量差值
		Laya.Vector3.subtract(this._moveParams.target, this.pos, temp);
		var distance = Laya.Vector3.scalarLength(temp);
		//向量归一
		Laya.Vector3.normalize(temp, this.unitVector);
		//计算速度单位向量 乘以速度绝对值
		Laya.Vector3.scale(this.unitVector, speed, this._moveParams.initSpeed);

		this._moveParams.moveFrame = 0;
		this._moveParams.callParams = callParams;
		//设置预期运动时间
		this._moveParams.totalFrame = Math.ceil(distance / speed);
		this._moveParams.callFunc = callFunc;
		this._moveParams.thisObj = thisObj;
		this._moveParams.spd = spd;

		// this._moveParams = params;
		this.movePointType = movePointType;
		this.initMove(this._moveParams.initSpeed.x, this._moveParams.initSpeed.y, this._moveParams.initSpeed.z);
		this.checkMoveEnd()
	}


	//根据传递的entity 运动
	moveToOnePointByEntity(enetity: InstanceMoveEntity, movePointType: number = 1, isGrid: Boolean = false) {
		var x = enetity.target.x, y = enetity.target.y;
		if (x == null && enetity.target.y != null) {
			x = enetity.target.x;
			y = enetity.target.y;
		}
		this.moveToOnePoint(x, y, 0, enetity.spd, enetity.callFunc, enetity.thisObj, enetity.callParams, enetity.expandParams, movePointType);

	}


	//按一组点去运动
	// moveToGroupPoints(params:InstanceMoveMultyEntity){
	moveToGroupPoints(pointArr: Laya.Vector3[], speed: number = 0, callFunc: any = null, thisObj: any = null, loopParams: any = null) {
		// this._multyparams = params;
		if (!this._multyparams) {
			this._multyparams = new InstanceMoveMultyEntity();
		}
		if (speed == 0 || speed == null) {
			speed = BattleFunc.moveSpeed;
		}
		this._multyparams.initData(pointArr, speed, callFunc, thisObj, loopParams, false);
		var param = this._multyparams.getNextpos();
		if (!param) {
			LogsManager.errorTag(null, "没有找到当前运动的点");
			return
		}
		this.moveToOnePointByEntity(param, FogInstanceMove.moveType_multyPoint, false);
	}


	//判断是否到达终点
	checkMoveEnd() {
		if (this.movePointType == FogInstanceMove.moveType_none) {
			return;
		}
		//如果是做缓动行为的
		if (this.movePointType == FogInstanceMove.moveType_tween) {
			this.pos.x = this.x;
			this.pos.y = this.y;
			return
		}
		this._moveParams.moveFrame++;
		var speedRadio: number = this._moveParams.getSpeedRadio();
		//根据moveParams 实时刷新速度
		this.speed.x = this._moveParams.initSpeed.x * speedRadio;
		this.speed.y = this._moveParams.initSpeed.y * speedRadio;
		this.speed.z = this._moveParams.initSpeed.z * speedRadio;

		var distance: number = Laya.Vector3.distance(this._moveParams.target, this.pos);
		var speedAbs: number = Laya.Vector3.scalarLength(this.speed);
		//如果距离小于一个速度绝对值 那么判定到达
		//有需要可以扩展更复杂的行为,比如添加摩擦力,飞跃行为等等
		if (!this.moveState && distance >= FogFunc.itemHeight / 2 && distance < (FogFunc.itemHeight / 2 + FogFunc.busHeight / 2) + speedAbs) {
			this.moveState += 1;
			this.enterSide("side");
		}
		var whetherEnd: boolean = false
		if (distance < speedAbs && this.moveState == 1) {
			whetherEnd = true;
		}
		if (whetherEnd) {

			this.pos.x = this._moveParams.target.x;
			this.pos.y = this._moveParams.target.y;
			this.pos.z = this._moveParams.target.z;
			if (this.movePointType == FogInstanceMove.moveType_onePoint) {
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
					this.moveToOnePointByEntity(param, FogInstanceMove.moveType_multyPoint, this._multyparams.isGrid);
				}
			}
		} else {

		}
	}

	//到达一个点 ,子类重写,根据需要转身,或者干嘛 ,这个是针对运动到多个点的运动行为判断的 
	onArriveOnePoint() {

	}


	//判断是否有运动类型行为
	public checkHasMoveType() {
		if (this.movePointType == FogInstanceMove.moveType_none) {
			return false;
		}
		return true;
	}

	//到达边缘回调
	enterSide(type) {
		var callBack, thisObj;
		if (this._moveParams) {
			callBack = this._moveParams.callFunc;
			thisObj = this._moveParams.thisObj;
			if (callBack) callBack.call(thisObj, type);
		}
	}

	//到达终点
	overFinalPoint() {
		this.resetMoveState();
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

	resetMoveState() {
		//初始化变成站立状态,通知子类改变动作行为
		this.moveState = 0;
		this.initStand();
		this.movePointType = FogInstanceMove.moveType_none;
	}
}