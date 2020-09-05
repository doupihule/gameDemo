import InstanceBasic from "./InstanceBasic";
import BattleControler from "../controler/BattleControler";
import InstanceMoveEntity from "./InstanceMoveEntity";
import InstanceMoveMultyEntity from "./InstanceMoveMultyEntity";
import BattleFunc from "../../sys/func/BattleFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import BattleConst from "../../sys/consts/BattleConst";
import Equation from "../../../framework/utils/Equation";
import VectorTools from "../../../framework/utils/VectorTools";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";

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
	public landPos: number = 0.1;

	public blookSpeed: {x,y,z};

	protected isViewShow: boolean = true;


	//晃动车 
	/**
	 * frame: 时长
	 * index: 当前序号默认是0
	 */
	protected _shakeInfo: any;
	//参考BattleFunc:carHitEffPos
	protected _shakeSource: any;

	public initRotateCtnPos: {x,y,z};


	public constructor(controller: BattleControler) {
		super(controller)
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
	}

	//初始化站立状态(也就是闲置)
	initStand() {
		this._myState = BattleConst.state_stand;
		this.speed.x = 0;
		this.speed.y = 0;
		this.speed.z = 0;
		//停止旋转
		this.enbleRotate = false;
		// this.setRotateSpeed(0, 0, 0);
	}

	//初始化运动 ,子类可根据这个继承,并改变视图的朝向或者 动作显示
	initMove(x: number = 0, y: number = 0, z: number = 0) {
		this.speed.x = x;
		this.speed.y = y;
		this.speed.z = z
		this._myState = BattleConst.state_move;

	}

	//初始化运动 ,子类可根据这个继承,并改变视图的朝向或者 动作显示
	initMove2Stand(x: number = 0, y: number = 0, z: number = 0, scale: number = 1 / 60) {
		this.speed.x = x;
		this.speed.y = y;
		this.speed.z = z;
		this.addSpeed.x = -x * scale;
		this.addSpeed.y = -y * scale;
		this.addSpeed.z = -z * scale;
		this._myState = BattleConst.state_move2stand;

	}

	//设置跳跃速度
	initJump(y: number) {
		this.speed.y = y;
		this._myState = BattleConst.state_jump;
		this.gravityAble = true;
	}





	//设置角速度
	public setRotateSpeed(x, y, z) {
		this.enbleRotate = true;
		this.rotateSpeed.x = x;
		this.rotateSpeed.y = y;
		this.rotateSpeed.z = z;
	}

	//设置速度
	public setSpeedByAng(spd, rx, ry, rz) {
		this.initMove(spd * rx, spd * ry, spd * rz);
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
		var preX = this.speed.x;
		this.speed.x = this.setSpeed(this.speed.x, this.addSpeed.x, this.dragForce.x);
		this.speed.y = this.setSpeed(this.speed.y, this.addSpeed.y, this.dragForce.y);
		this.speed.z = this.setSpeed(this.speed.z, this.addSpeed.z, this.dragForce.z);
		if (this._myState == BattleConst.state_move2stand) {
			if (this.speed.x * preX <= 0) {
				this.speed.x = 0;
				this.speed.y = 0;
				this.speed.z = 0;
				this._myState = BattleConst.state_stand;
			}
		}
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
		//如果是激活旋转的 那么让view的第一去旋转这么多角度
		if (this.enbleRotate) {
			//设置弧度
			this.setRadian(this.rotationRad.x + this.rotateSpeed.x, this.rotationRad.y + this.rotateSpeed.y, this.rotationRad.z + this.rotateSpeed.z);
		}
		//stand状态不执行
		if (this._myState == BattleConst.state_stand) {
			return;
		}
		this.pos.x += this.speed.x + this.blookSpeed.x;
		this.pos.y += this.speed.y + this.blookSpeed.y;
		this.pos.z += this.speed.z + this.blookSpeed.z;
		//如果坐标小于0 而且是朝地面运动状态  而且是受重力影响的 那么才会去检测落地
		if (this.speed.y < 0 && this.pos.y <= this.landPos && this._myState == BattleConst.state_move && this.gravityAble) {
			this.onHitLand();
		}


	}

	//着陆了 给子系统重写 比如销毁 或者什么
	protected onHitLand() {
		this.initStand();
	}




	//运动到目标点 ,只针对平面运动,一般是x,y. movePointType 禁止外部调用
	moveToOnePoint(x: number, y: number, z: number = 0, spd: number = 0, callFunc: any = null, thisObj: any = null, callParams = null, expandParams: any = null, movePointType: number = 1) {

		if (!this._moveParams) {
			this._moveParams = new InstanceMoveEntity(VectorTools.createVec3(x, y, z));
		}
		if (spd == 0) {
			spd = BattleFunc.moveSpeed;
		}
		this._moveParams.target.x = x
		this._moveParams.target.y = y
		this._moveParams.target.z = z

		var speed: number = spd;

		var temp: {x,y,z} = BattleFunc.tempPoint;
		//计算目标向量差值
		VectorTools.subtract(this._moveParams.target, this.pos, temp);
		var distance = VectorTools.scalarLength(temp);
		//向量归一
		VectorTools.normalize(temp, this.unitVector);
		//计算速度单位向量 乘以速度绝对值
		VectorTools.scale(this.unitVector, speed, this._moveParams.initSpeed);

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
		this.moveToOnePoint(x, y, enetity.spd, enetity.callFunc, enetity.thisObj, enetity.callParams, enetity.expandParams, movePointType);

	}



	//按一组点去运动
	// moveToGroupPoints(params:InstanceMoveMultyEntity){
	moveToGroupPoints(pointArr: {x,y,z}[], speed: number = 0, callFunc: any = null, thisObj: any = null, loopParams: any = null) {
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
		this.moveToOnePointByEntity(param, InstanceMove.moveType_multyPoint, false);
	}

	//按一组网格点运动
	moveToGroupGridPoints(gridArr: {x,y,z}[], speed: number = 0, callFunc: any = null, thisObj: any = null, loopParams: any = null) {
		// this._multyparams = params;
		if (!this._multyparams) {
			this._multyparams = new InstanceMoveMultyEntity();
		}
		this._multyparams.initData(gridArr, speed, callFunc, thisObj, loopParams, true);
		var param = this._multyparams.getNextpos();
		if (!param) {
			LogsManager.errorTag(null, "没有找到当前运动的点");
			return;
		}
		this.moveToOnePointByEntity(param, InstanceMove.moveType_multyPoint, true);
	}



	//判断是否到达终点
	checkMoveEnd() {
		if (this.movePointType == InstanceMove.moveType_none) {
			return;
		}
		//如果是做缓动行为的
		if (this.movePointType == InstanceMove.moveType_tween) {
			this.pos.x = this._myView.x;
			this.pos.y = this._myView.y;
			return
		}
		this._moveParams.moveFrame++;
		var speedRadio: number = this._moveParams.getSpeedRadio();
		//根据moveParams 实时刷新速度
		this.speed.x = this._moveParams.initSpeed.x * speedRadio;
		this.speed.y = this._moveParams.initSpeed.y * speedRadio;
		this.speed.z = this._moveParams.initSpeed.z * speedRadio;

		var distance: number = VectorTools.distance(this._moveParams.target, this.pos);
		var speedAbs: number = VectorTools.scalarLength(this.speed);
		//如果距离小于一个速度绝对值 那么判定到达
		//有需要可以扩展更复杂的行为,比如添加摩擦力,飞跃行为等等
		var whetherEnd: boolean = false
		if (distance < speedAbs) {
			whetherEnd = true;
		}

		if (whetherEnd) {

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
		} else {

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


	//晃动相关
	//晃动车 接口预留 
	protected doShakeInfo() {
		if (!this._shakeInfo) {
			return;
		}
		var info = this._shakeInfo;
		var source = this._shakeSource[info.index];
		if (info.leftFrame > 0) {
			info.leftFrame--;
			if (info.leftFrame == 0) {
				this.resetShakeInfo()
				return;
			}
		}

		var nextSource;
		info.frame++;
		//如果要进入到下一个
		if (info.frame >= source.frame) {
			info.index++;
			info.frame = 0;
			if (info.index == this._shakeSource.length - 1) {
				if (info.leftFrame == 0) {
					this.resetShakeInfo()
					return;;
				} else {
					this.initShakeInfoByIndex(0);
				}
			} else {
				this.initShakeInfoByIndex(info.index);
			}
		} else {
			nextSource = this._shakeSource[info.index + 1];
			var currentPos = source.pos
			var nextPos = nextSource.pos;
			var temp = BattleFunc.tempPoint;
			//计算比例
			var ratio = info.frame / info.length;

			if (currentPos && nextPos) {
				temp.x = Equation.getPosByRatio(currentPos.x, nextPos.x, ratio)
				temp.y = Equation.getPosByRatio(currentPos.y, nextPos.y, ratio)
				temp.z = Equation.getPosByRatio(currentPos.z, nextPos.z, ratio)
				this.setChildViewPos(temp);
			}

			var currentRotation = source.rotation;
			var nextRotation = nextSource.rotation;

			if (currentRotation && nextRotation) {
				temp.x = Equation.getPosByRatio(currentRotation.x, nextRotation.x, ratio)
				temp.y = Equation.getPosByRatio(currentRotation.y, nextRotation.y, ratio)
				temp.z = Equation.getPosByRatio(currentRotation.z, nextRotation.z, ratio)
				this.setChildViewRotation(temp);
			}
		}
	}

	//到达一个点;
	protected initShakeInfoByIndex(index) {
		this._shakeInfo.index = index;
		this._shakeInfo.frame = 0;
		var info = this._shakeInfo

		var source = this._shakeSource[info.index];
		info.length = source.frame;
		if (source.pos) {
			this.setChildViewPos(source.pos)
		}
		if (source.rotation) {
			this.setChildViewRotation(source.rotation)
		}
	}

	//重置shakeinfo
	protected resetShakeInfo() {
		this.setChildViewRotation(BattleFunc.originPoint)
		this.setChildViewPos(BattleFunc.originPoint)
		//那么
		this._shakeInfo = null
	}

	//重置子对象的旋转和坐标为默认值
	public resetChildViewRotationAndPos() {
		this.setChildViewRotation(BattleFunc.originPoint);
		this.setChildViewPos(BattleFunc.originPoint);
	}

	//设置子对象的旋转
	protected setChildViewRotation(r) {
		var child: Base3dViewExpand = this._myView.getChildAt(0) as Base3dViewExpand;
		child.set3dRotation(r.x,r.y,r.z);
	}

	//设置子对象的坐标
	protected setChildViewPos(p) {
		var child: Base3dViewExpand = this._myView.getChildAt(0) as Base3dViewExpand;
		var temp = BattleFunc.tempPoint4;
		temp.x = p.x + this.initRotateCtnPos.x
		temp.y = p.x + this.initRotateCtnPos.y
		temp.z = p.x + this.initRotateCtnPos.z
		child.set3dPos( p.x + this.initRotateCtnPos.x,p.y + this.initRotateCtnPos.y,p.z+this.initRotateCtnPos.z);
	}


	//设置震动信息totalFrame -1 表示无限循环 0 表示只执行1次
	public setShakeInfo(params, totalFrame: number = 0) {
		this._shakeSource = params;
		this._shakeInfo = {
			index: 0,
			totalFrame: totalFrame,
			leftFrame: totalFrame,

		}
		this.initShakeInfoByIndex(0);
	}

	//显示或者隐藏view
	public showOrHideView(value) {
		if (this.isViewShow == value) {
			return;
		}
		this.isViewShow = value
		this._myView.setActive(value);
	}


}