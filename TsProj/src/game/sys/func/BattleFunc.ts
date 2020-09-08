import BaseFunc from "../../../framework/func/BaseFunc";
import GameConsts from "../consts/GameConsts";
import BattleConst from "../consts/BattleConst";
import GlobalParamsFunc from "./GlobalParamsFunc";
import VectorTools from "../../../framework/utils/VectorTools";


export default class BattleFunc extends BaseFunc {


	public static moveSpeed: number = 1;

	static angletoRad: number = Math.PI / 180;
	static radtoAngle: number = 180 / Math.PI;

	//1米大概等于多少像素
	static miToPixel: number = 640 / 18;
	static pixelToMi: number = 18 / 640;

	//一周
	static twopi:number = Math.PI *2;
	//90°对应的弧度
	static halfpi: number = Math.PI / 2;

	//摄像机跟随车的相对坐标
	static cameraFollowPos: {x,y,z} = VectorTools.createVec3(0, 13, 18.3);
	static cameraFollowRotation: {x,y,z} = VectorTools.createVec3(18.27, -175, 0);
	//默认的y坐标
	static defaultYpos: number = 0.2;



	//原点0,0,0 禁止修改
	public static originPoint: {x,y,z} = VectorTools.createVec3();

	//定义一个临时对象.用来存储临时属性的
	public static tempObject:any = {};

	//记录一个临时点 战斗逻辑中间使用的过渡点
	public static tempPoint: {x,y,z} = VectorTools.createVec3(0, 0, 0);
	public static tempPoint2: {x,y,z} = VectorTools.createVec3(0, 0, 0);
	public static tempPoint3: {x,y,z} = VectorTools.createVec3(0, 0, 0);
	public static tempPoint4: {x,y,z} = VectorTools.createVec3(0, 0, 0);

	//临时table 
	static tempArr: any[] = [];

	//前车离我多远后隐藏.  暂定200米
	static carHideFrontDistance:number = 200;
	//后车离我多远后隐藏 暂定20米
	static carHideBackDistance:number = -20;

	//默认车的碰撞cd为5帧
	static carHitCd:number = 3;


	//车辆长度 米
	public static carLength: number = 5
	public static halfCarLength: number = BattleFunc.carLength / 2;
	public static carMinDis:number = BattleFunc.carLength * 0.8 ;
	//长度单位的缩放
	public static lengthScale:number = 3;


	//单车道宽度
	static trackWidth: number = 3.2;
	//总赛道宽度
	static totalTrackWidth:number = 24
	//赛道边界 最大不能超过的值
	static rightBorderPos:number = BattleFunc.totalTrackWidth*0.47
	static leftBorderPos:number = -BattleFunc.totalTrackWidth*0.47
	
	//没动力时的减速度 假定 60帧降到0
	static reduceSpd:number =  -40 / 3600
	
	//主车出生点
	static roleBirthTrackPos:number = - BattleFunc.trackWidth 

	//车换赛道最大摆动角度
	static maxHeadRadtion:number = 15* BattleFunc.angletoRad
	
	//重力加速度 9.8米/秒^2 转化成帧
	static gravityAddSpeed:number = -9.8*3/3600;
	
	//半车道宽度
	static halfTrackWidth: number = 1.6;
	
	//同时最多显示多少快地形

	static terrainShowNums: number = 8;

	// 到达终点后的减速度
	static endReduceSpeed: number = 0.2 * BattleFunc.pixelToMi

	//默认战斗的随机因子序号为10
	static battleRandomIndex: number = 10;



	//落地时的安全角度
	static saveAngleArea:number[] = [-45*BattleFunc.angletoRad,45*BattleFunc.angletoRad ];

	//额外 翻转圈数的倍率
	static extraTurnPowerRatio:number = 0.5;

	//满足加速时 瞬间提速百分比 
	static flyForceRatio:number = 0.2;
	static flyForceMinRatio:number = 0.05;



	static _instance: BattleFunc;

	static get instance() {
		if (!this._instance) {
			this._instance = new BattleFunc();
		}
		return this._instance;
	}


	protected getCfgsPathArr() {
		return ["Level", 
			"TranslateError_json", "TranslateGlobal_json", "TranslateGuide_json", "TranslateMonster_json", "TranslateRole_json", "TranslateShare_json",];
	}

	constructor() {  
		super();
	}


	//获取地形数据
	public getTerrainData(id) {
		// return this.getCfgDatas("Road", "1");
		return this.getCfgDatas("Road", id);
	}

	//获取装饰数据
	public getDecorateData(id) {
		return this.getCfgDatas("Decoration", id);
	}

	public getSkyData(){
		return "scene_ui_beijing";
	}



	//获取角色的模型
	public getRoleModel(id) {
		return this.getRoleInfoData(id).model
	}

	//获取角色对应的info数据
	public getRoleInfoData(id) {
		return this.getCfgDatas("Role", id);
	}


	//根据模型获取视图的url地址
	public getViewUrlByModelId(id, model) {
		var url = ("3dmodels/" + model + "/Conventional/" + id + ".lh")
		LogsManager.echo(url, "__getViewUrlByModelId")
		return url
	}

	//将毫秒转化成帧
	public turnMinisecondToframe(minisecond) {
		return Math.round(Number(minisecond) * GameConsts.gameFrameRate / 1000)
	}

	private speedToFrameRatio: number = 0.0001 / (GameConsts.gameFrameRate)
	//将万分之1米/秒速度转化成 米/帧
	public turnSpeedToFrame(targetSpeed) {
		return Number(targetSpeed) * this.speedToFrameRatio;
	}

	//将米/帧速度转化成 千米/小时
	public turnSpeedToKmh(targetSpeed) {
		return targetSpeed*GameConsts.gameFrameRate * 3.6;
	}

	//将 万分之一角度/s 转化成 弧度/帧
	public turnRotateSpeedToFrame(targetRotateSpeed) {
		return targetRotateSpeed / GameConsts.gameFrameRate * BattleFunc.angletoRad / 10000
	}


	//万分之一单位/秒^2 的加速度单位转化
	private addSpeedToFrameRatio: number = 0.0001 / (GameConsts.gameFrameRate * GameConsts.gameFrameRate)

	//将 万分之一角度加速度/s 转化成 弧度/帧
	public turnRotateAddSpeedToFrame(targetRotateSpeed) {
		return targetRotateSpeed* BattleFunc.angletoRad  *this.addSpeedToFrameRatio;
	}


	
	//将万分之1米/秒^2 转化成  米/帧^2
	public turnAddSpeedToFrame(addSpeed) {
		return Number(addSpeed) * this.addSpeedToFrameRatio
	}





	//初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
	public static initGlobalParams (){
		this.extraTurnPowerRatio = GlobalParamsFunc.instance.getDataNum("extraTurnPowerTime")/10000;
		this.gravityAddSpeed = -BattleFunc.instance.turnAddSpeedToFrame( GlobalParamsFunc.instance.getDataNum("gravity") );
		this.flyForceRatio = GlobalParamsFunc.instance.getDataNum("falldownRatio")/10000

	}

	//转化路线格式 配表格式 {地形id,地形数量}
	public turnRoadList(arr){
		var  resultArr:string[] =[]
		for(var i=0; i < arr.length; i++){
			var tempInfo = arr[i];
			var roadId = tempInfo[0];
			var roadNums = Number(tempInfo[1]);
			
			for(var j =0; j < roadNums;j++){
				resultArr.push(roadId);
			}
		}
		return resultArr;
	}

}