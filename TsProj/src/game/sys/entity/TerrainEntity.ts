import BattleFunc from "../func/BattleFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import BattleConst from "../consts/BattleConst";

export default class TerrainEntity {
	public startPos: Laya.Vector3;   // 起点
	public endPos: Laya.Vector3;     //终点
	public area: number;       //扇形区域弧度
	public r: number;        //半径
	public type: number;     //类型 0直线 1右转弯, -1左转弯
	public length: number;       //长度.
	public startStep: number;  //起始长度 用来计算每辆车落在哪个index
	public endStep: number;    //终止长度
	public startAng: number;     //起始角度 用来计算 坐标的
	public endAng: number;       //终止角度

	private centerCircle: Laya.Vector3;        //圆心坐标

	/** 参数 传入当前的距离长度, 传入输出点out */
	public getPosByLength: Function;        //每一段路径传入一个运动的长度
	public index: number;                //当前所处于的路段序号

	//把角度转化成相对于圆心的角度
	private _turnStartAng: number;

	private _cosAngValue: number;     //缓存直线 Math.cos(this.startAng)值. 提高后续的计算性能
	private _sinAngValue: number;

	private _cosPlumAngValue: number;    //缓存直线 切线方向的cos值. 提高后续计算性能
	private _sinPlumAngValue: number;    //缓存 切线垂线方向的cos值. 提高后续计算性能


	constructor(terrcfg, index, lastEntity: TerrainEntity, startAngle) {

		this.type = terrcfg.type || BattleConst.TERRAIN_LINE;

		var type: number = this.type;
		this.index = index;
		if (index == 0) {
			this.startPos = new Laya.Vector3();
			this.startAng = startAngle;
			this.startStep = 0;
		} else {
			this.startAng = lastEntity.endAng;
			this.startPos = lastEntity.endPos;
			this.startStep = lastEntity.endStep;
		}
		//
		if (type == BattleConst.TERRAIN_LINE) {
			this.length = terrcfg.length / 10000;
			this.endAng = this.startAng;
			this.area = 0;
			this._cosAngValue = Math.cos(this.startAng);
			this._sinAngValue = Math.sin(this.startAng);
			this._cosPlumAngValue = Math.cos(this.startAng + BattleFunc.halfpi)
			this._sinPlumAngValue = Math.sin(this.startAng + BattleFunc.halfpi)

		} else {
			var r: number = terrcfg.radio / 10000;
			var area: number = terrcfg.area * BattleFunc.angletoRad;
			this.area = area;
			this.length = r * area;
			this.r = r;
			this.endAng = this.startAng + area * type
		}
		this.endStep = this.startStep + this.length
		if (this.type == BattleConst.TERRAIN_LINE) {
			this.getPosByLength = this.getPosByLineLength;
		} else {
			//计算圆心
			this.centerCircle = new Laya.Vector3();
			this.centerCircle.z = this.startPos.z + this.r * Math.cos(this.startAng + BattleFunc.halfpi * this.type);
			this.centerCircle.x = this.startPos.x + this.r * Math.sin(this.startAng + BattleFunc.halfpi * this.type);
			//把起点角度转化成相对于圆心的角度
			this._turnStartAng = this.startAng - BattleFunc.halfpi * this.type;
			this.getPosByLength = this.getPosByCircle;
		}

		this.endPos = new Laya.Vector3()
		//计算终点坐标
		this.getPosByLength(this.endStep, this.endPos);

	}

	//根据位置获取角度
	public getAngleByStep(step) {
		if (this.type == BattleConst.TERRAIN_LINE) {
			return this.startAng
		}
		var through = step - this.startStep;
		var ang = through / this.length * this.area;
		return this.startAng + ang * this.type;
	}


	//获取直线坐标
	private getPosByLineLength(length, outp: Laya.Vector3, trackValue: number = 0) {
		var through = length - this.startStep;

		// if (through < 0 || length > this.endStep) {
		//     LogsManager.errorTag("battle", "传入的length 小于起始位置或者高于终止位置", length, "index:", this.index);
		//     return;
		// }
		//因为算坐标是每帧都需要机型的大量浮点运算.所以能缓存的值 尽量缓存.
		outp.z = through * this._cosAngValue + this.startPos.z
		outp.x = through * this._sinAngValue + this.startPos.x
		if (trackValue != 0) {
			outp.z += trackValue * this._cosPlumAngValue
			outp.x += trackValue * this._sinPlumAngValue
		}
	}

	//根据距离获取对应的坐标
	private getPosByCircle(length, outp: Laya.Vector3, trackValue: number = 0) {
		//在这个弯道上经过的距离
		var through = length - this.startStep;

		if (through < 0 || length > this.endStep) {
			LogsManager.errorTag("battle", "传入的length 小于起始位置或者高于终止位置", length, "index:", this.index);
			return;
		}
		var ang = through / this.r;
		var targetAng = this._turnStartAng + ang * this.type;
		outp.z = this.centerCircle.z + this.r * Math.cos(targetAng);
		outp.x = this.centerCircle.x + this.r * Math.sin(targetAng);
		if (trackValue != 0) {
			var trackAng = this.startAng + ang * this.type + BattleFunc.halfpi
			outp.z += trackValue * Math.cos(trackAng)
			outp.x += trackValue * Math.sin(trackAng)
		}

	}

}