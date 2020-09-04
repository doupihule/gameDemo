import BattleControler from "./BattleControler";
import IMessage from "../../sys/interfaces/IMessage";
import InstancePlayer from "../instance/InstancePlayer";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import TableUtils from "../../../framework/utils/TableUtils";
import BattleFunc from "../../sys/func/BattleFunc";
import Message from "../../../framework/common/Message";
import BattleEvent from "../../sys/event/BattleEvent";
import GameConsts from "../../sys/consts/GameConsts";
import { BattleUI } from "../../sys/view/battle/BattleUI";
import WindowManager from "../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../sys/consts/WindowCfgs";
import RandomUtis from "../../../framework/utils/RandomUtis";
import LevelFunc from "../../sys/func/LevelFunc";
import InstanceEffect from "../instance/InstanceEffect";
import LogsManager from "../../../framework/manager/LogsManager";
import LogsErrorCode from "../../../framework/consts/LogsErrorCode";
import TweenAniManager from "../../sys/manager/TweenAniManager";
import BattleMapControler from "./BattleMapControler";
import BattleConst from "../../sys/consts/BattleConst";
import InstanceRole from "../instance/InstanceRole";
import ResourceConst from "../../sys/consts/ResourceConst";
import SoundManager from "../../../framework/manager/SoundManager";
import InstanceBasic from "../instance/InstanceBasic";
import BattleStatisticsControler from "./BattleStatisticsControler";
import InstanceBullet from "../instance/InstanceBullet";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";
import TimerManager from "../../../framework/manager/TimerManager";
import GuideManager from "../../sys/manager/GuideManager";
import BattleSceneManager from "../../sys/manager/BattleSceneManager";
import VectorTools from "../../../framework/utils/VectorTools";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";
import Client from "../../../framework/common/kakura/Client";
import ViewTools from "../../../framework/components/ViewTools";
import UICompConst from "../../../framework/consts/UICompConst";
import PlaneExpand from "../../../framework/components/d3/PlaneExpand";
import Animation3DExpand from "../../../framework/components/d3/Animation3DExpand";
import PhysicsColliderExpand from "../../../framework/components/physics/PhysicsColliderExpand";
import ImageExpand from "../../../framework/components/ImageExpand";

export default class BattleLogicalControler extends BattleControler implements IMessage {

	/**战斗数据 */
	public battleData: any;

	public battleInfo = [];

	public player: InstancePlayer;		//角色 
	public bulletArr: InstanceBullet[];		//存放所有子弹的数组
	public effectArr: InstanceEffect[];		//存放所有特效的数组
	public roleArr: InstanceRole[];		//存放所有车的数组

	public leftTime: number = 0;	//剩余帧数
	public battlePrefab: Base3dViewExpand;
	public elementField;

	//当前分数
	public currentScore: number = 0;
	//当前星级
	public currentStar: number = 0;
	//当前血量
	public currentBlood: number = -1;
	//本关奖励金币
	public currentReward: number = 0;
	//对应星级分数数组
	public startArr: any[];

	//关卡对应的配置数据
	public levelCfgData: any;

	public battleUi: BattleUI;

	//对应的枪所在的竖直平面
	public gamePlane: PlaneExpand


	public bulletHeight = 3.6;
	//枪的原点坐标
	public originPos3D: {x,y,z} = VectorTools.createVec3(0.3, this.bulletHeight, 2.2);


	//怪物所在的z坐标  暂定离枪 距离1米
	public monsterInitZPos: number = 1.2
	public monsterPlane: PlaneExpand;
	public monsterRemove: boolean = false; //怪物碰到地面是否移除
	public isWin: boolean = false;  //是否胜利

	//对应的枪id
	public weaponId: string;
	public superWeaponId: string;
	private curRate = 0;
	public gameLastTimes = -1;  //-1表示无时间限制

	//撞击力
	private hitForce: number;
	public hitTime; //被击中运动的时间	



	//关卡结束的
	public endStep: number;

	//地图控制器
	public mapControler: BattleMapControler;

	//当前处于地形index, 从0开始.是 根据主角车去判断的
	public currentTerrainIndex: number = 0;


	//排名信息 [{id,rank, isRole} ]
	public rankInfo: any[]
	public statistControler: BattleStatisticsControler;

	public line;

	public explodeEffect;
	public bloodEffect;
	// public crashEffect;
	public shootEffect;

	public canChangeLevel;

	public bulletNum = 5;

	public basicBulletNum = 5;

	public maxBulletNum = 5;

	public shadowList = [];

	public explodeEffectArr;
	public bloodEffectArr;
	// public crashEffectArr;
	public shootEffectArr;

	public activeExplodeEffectArr;
	public activeBloodEffectArr;
	// public activeCrashEffectArr;
	public activeShootEffectArr;

	public battleEnd;

	public constructor(ctn: any, ctn2) {
		super(ctn);
		this.battleScene = ctn;
		this.battlePrefab = ctn2;
		this.explodeEffectArr = [];
		this.activeExplodeEffectArr = [];
		this.bloodEffectArr = [];
		this.activeBloodEffectArr = [];
		this.shootEffectArr = [];
		this.activeShootEffectArr = [];
		this.explodeEffect = ViewTools.create3DModel(ResourceConst.EFFECT_EXPLODE,"Effect").getChildAt(0);
		this.bloodEffect = ViewTools.create3DModel(ResourceConst.EFFECT_BLOOD, "Effect");
		this.shootEffect = ViewTools.create3DModel(ResourceConst.EFFECT_SHOOT, "Effect").getChildAt(0);
		this.elementField = this.battlePrefab.getChildByName("element_field") as Base3dViewExpand;
		this.effectArr = [];
		this.roleArr = []
		this.bulletArr = [];
		var time = Client.instance.miniserverTime
		LogsManager.echo("battle 设置随机种子:", time, "用来做复盘用")
		RandomUtis.setOneRandomYinzi(time, BattleFunc.battleRandomIndex);
		this.mapControler = new BattleMapControler(this);
		// this.propControler = new BattlePropControler(this);
		this.statistControler = new BattleStatisticsControler(this);

		var y = this.originPos3D.y
		// this.gamePlane = new Laya.Plane(VectorTools.createVec3(0,0,-1),Math.abs(z) );
		this.gamePlane =ViewTools.createPlaneBy3p(VectorTools.createVec3(-10, y, 10), VectorTools.createVec3(10, y, -10), VectorTools.createVec3(10, y, 10));
		// z = this.monsterInitZPos;
		var time = Client.instance.miniserverTime
		RandomUtis.setOneRandomYinzi(time, BattleFunc.battleRandomIndex);
		this.hitTime = 1//GlobalParamsFunc.instance.getDataByTwoId("impactTime", "num") / 1000;

	}

	//设置数据
	public setData(data) {

		while (this.activeExplodeEffectArr.length) {
			var explodeEffect = this.activeExplodeEffectArr.pop();
			explodeEffect.active = false;
			this.explodeEffectArr.push(explodeEffect);
		}
		while (this.activeBloodEffectArr.length) {
			var bloodEffect = this.activeBloodEffectArr.pop();
			bloodEffect.active = false;
			this.bloodEffectArr.push(bloodEffect);
		}
		while (this.activeShootEffectArr.length) {
			var shootEffect = this.activeShootEffectArr.pop();
			shootEffect.active = false;
			this.shootEffectArr.push(shootEffect);
		}
		//初始化统计控制器
		this.statistControler.setData();
		this.battleData = data;
		this.preCreateEffGroup();
		// this.levelCfgData = LevelFunc.instance.getLevelInfoById(data.levelId);
		// this.battleState = BattleConst.battleState_in;
		// this.currentTerrainIndex = 0;
		// this._isGamePause = false
		// this.rankInfo =[];
		this.updateCallFuncGroup = {};
		// //地图信息
		// this.mapInfoArr = [];
		this.mapControler.setData(data);
		// // this.propControler.setData();
		// this.tweenControler.setData();
		this.initGame(data);

	}


	//播放音效, lastTime 持续时间,表示多久后关闭 0表示永久循环 -1表示只播放一次
	public playSound(soundName: string, lastTime: number = -1) {
		// LogsManager.echo("battle play sound",soundName,lastTime)

		if (lastTime == -1) {
			SoundManager.playSE(soundName, 1);
		} else {
			SoundManager.playSE(soundName, 0);
			if (lastTime > 0) {
				this.setCallBack(lastTime, this.stopSound, this, soundName);
			}

		}

	}

	//停止某个音效
	public stopSound(soundName: string) {
		SoundManager.stopMusicOrSound(soundName);
	}

	//销毁一个实例
	public destoryInstance(instance: InstanceBasic, cacheId: string, model: string, arr?) {
		//把instance放入缓存.
		instance.destroyPre();
		PoolTools.cacheItem(cacheId, instance);

		instance.onSetToCache();

		// view.removeSelf();
		TableUtils.removeValue(this._allInstanceArr, instance);
		if (arr) {
			TableUtils.removeValue(arr, instance);
		}
		if (model == BattleConst.model_effect) {
			TableUtils.removeValue(this.effectArr, instance);
		} else if (model == BattleConst.model_role) {
			// this.player = null;
			TableUtils.removeValue(this.roleArr, instance);
		}
	}


	//销毁角色
	public destoryRole(player: InstanceRole, checkResult = true) {
		this.destoryInstance(player, PoolCode.POOL_PLAYER + player.dataId, BattleConst.model_role, this.roleArr);
		if (checkResult) {
			switch (player.type) {
				case "Target":
					this.checkResult();
					break;
				case "Player":
					this.player = null;
					this.checkResult();
					break;
			}
		}
	}

	//销毁角色
	public roleDead(player: InstanceRole, checkResult = true, speed?) {
		if (player.dead) {
			return false;
		}
		player._myView.getChildByName("collider").setActive(false);
		var randomInt = RandomUtis.getOneRandomInt(2,-1);
		var rotation = player._myView.get3dRotation();
		player._myView.set3dRotation(rotation.x,rotation.y=randomInt * 30,rotation.z);
		if (speed) {
			player.initMove2Stand(speed.x, speed.y, speed.z);
			VectorTools.scale(speed, -GlobalParamsFunc.instance.getDataNum("hitPlayerSlowDown") / 1000, player.addSpeed);

			var bloodEffect;
			if (this.bloodEffectArr.length) {
				bloodEffect = this.bloodEffectArr.pop();
			}
			else {
				bloodEffect = this.bloodEffect.clone();
			}
			player._myView.addChild(bloodEffect);
			bloodEffect.active = false;
			bloodEffect.active = true;
		}
		var anim = player._myView.getChildByName(player._myView.name).getComponent(UICompConst.comp_animator3d) as Animation3DExpand;
		anim.play("dead");
		player.dead = true;
		if (checkResult) {
			switch (player.type) {
				case "Target":
					this.checkResult();
					break;
				case "Player":
					this.player = null;
					this.checkResult();
					break;
			}
		}
		return true;
	}



	//销毁一个特效
	public destoryEffect(effect: InstanceEffect) {
		this.destoryInstance(effect, PoolCode.POOL_EFFECT + effect.effectName, BattleConst.model_effect);
	}

	//销毁一个子弹 
	public destoryBullet(bullet: InstanceBullet) {
		this.destoryInstance(bullet, PoolCode.POOL_BUTTLE + bullet.dataId, BattleConst.model_bullet, this.bulletArr);
		if (this.bulletNum <= 0 && this.bulletArr.length <= 0) {
			this.battleUi.lose();
		}
		// view.removeSelf();
	}


	//销毁图片特效


	//创建一个instance
	/**
	 * 
	 * @param data  数据
	 * @param cacheId 缓存id
	 * @param model  对应的模块 , role ,monster,effect,bullet
	 * @param classModel 对应的类对象
	 * @param resName  对应需要加载的资源名
	 * @param viewScale  视图缩放系数
	 */
	public createInstance(data: any, cacheId, model, classModel, resName, viewScale: number = 1) {
		var instance = PoolTools.getItem(cacheId, PoolCode.pool_model_battle);
		var view;
		LogsManager.echo("battle", "创建实例:", resName, "model:", model, viewScale);
		if (instance) {

			instance.getView().active = true;
			instance.setData(data);
			view = instance.getView();
			this.battleScene.addChild(view);
		} else {
			instance = new classModel(this);
			var resurl: string = resName
			view = ViewTools.create3DModel(resurl, "Effect").getChildAt(0);
			if (!view) {
				LogsManager.errorTag(LogsErrorCode.CONFIG_ERROR, "这个资源不存在:", resurl);
			}
			view = ViewTools.cloneOneView(view);
			instance.setView(view);
			instance.setData(data);
			this.battleScene.addChild(view);
			//如果是角色 那么记录初始坐标
			if (model == BattleConst.model_role) {
				var childView: Base3dViewExpand = view.getChildAt(0)
				VectorTools.cloneTo(childView.positionTrans,instance.initRotateCtnPos);
			}

		}


		if (viewScale != 1) {
			var childView: Base3dViewExpand = view
			var tempP = BattleFunc.tempPoint;
			tempP.x = tempP.y = tempP.z = viewScale;
			childView.setScale(viewScale,viewScale,viewScale);
			instance.viewScale = viewScale;
		}

		view.instance = instance;
		return instance;
	}


	//使用场景元素创建一个instance
	/**
	 * 
	 * @param data  数据
	 * @param cacheId 缓存id
	 * @param model  对应的模块 , role ,monster,effect,bullet
	 * @param classModel 对应的类对象
	 * @param resName  对应需要加载的资源名
	 * @param viewScale  视图缩放系数
	 */
	public createInstanceDefault(info: any, cacheId, object, classModel, shadow = null) {
		var instance = PoolTools.getItem(cacheId, PoolCode.pool_model_battle);
		var view;
		var data = { id: info.name + "_" + info.id, type: info.type }
		LogsManager.echo("battle", "创建实例:", "model:");
		if (instance) {
			if (instance.type == "Player") {
				this.line.removeSelf();
			}
			instance.getView().removeSelf();
			(instance.getView() as Base3dViewExpand).dispose();
			instance = null;
			// instance.getView().active = true;
			// instance.setData(data);
			// view = instance.getView();
			// instance.setView(view, info.transform[0], info.transform[1], info.transform[2]);
		}
		instance = new classModel(this);
		view = object;
		if (!view) {
			LogsManager.errorTag(LogsErrorCode.CONFIG_ERROR, "这个资源不存在");
		}
		view = view.clone();

		instance.setView(view, info.transform[0], info.transform[1], info.transform[2]);
		instance.setData(data);



		this.elementField.addChild(view);

		view.transform.localPositionX = info.transform[0];
		view.transform.localPositionY = info.transform[1];
		view.transform.localPositionZ = info.transform[2];
		view.transform.localRotationEulerX = info.transform[3];
		view.transform.localRotationEulerY = info.transform[4];
		view.transform.localRotationEulerZ = info.transform[5];
		view.transform.localScaleX = info.transform[6];
		view.transform.localScaleY = info.transform[7];
		view.transform.localScaleZ = info.transform[8];


		view.instance = instance;

		instance.param = {};
		instance.param.transform = info.transform;
		instance.param["x1"] = view.transform.localPositionX;
		instance.param["y1"] = view.transform.localPositionY;
		instance.param["z1"] = view.transform.localPositionZ;

		for (var index in info.param) {
			switch (info.param[index]) {
				case "T":
					instance.param[index] = true;
					break;
				case "F":
					instance.param[index] = false;
					break;
				default:
					instance.param[index] = info.param[index];
					break;
			}
		}


		if (instance.param.move) {
			instance.setColl(true);
			var collider: PhysicsColliderExpand = view.getComponent( UICompConst.comp_collider)
			if (collider) {
				collider.ccdMotionThreshold = 0.00001;
			}
		}
		else {
			instance.setColl(false);
		}

		if (instance.param.autoMoveSpeed) {

			instance.param["x2"] = instance.param["x1"] + instance.param.autoMoveDis[0];
			instance.param["y2"] = instance.param["y1"] + instance.param.autoMoveDis[1];
			instance.param["z2"] = instance.param["z1"] + instance.param.autoMoveDis[2];
			TimerManager.instance.registObjUpdate(instance.patrol,instance);
		}

		if (shadow) {
			var shadowObj = shadow.clone()
			// view.addChild(shadowObj);
			shadowObj.transform.localScaleX = instance.shape.sizeX * instance._myView.transform.localScaleX * GlobalParamsFunc.instance.getGlobalCfgDatas("shadowSize").num / 1000 || 1.5;
			shadowObj.transform.localScaleY = instance.shape.sizeZ * instance._myView.transform.localScaleZ * GlobalParamsFunc.instance.getGlobalCfgDatas("shadowSize").num / 1000 || 1.5;
			shadowObj.transform.localPositionX = instance._myView.transform.localPositionX;
			shadowObj.transform.localPositionY = 0.2;
			shadowObj.transform.localPositionZ = instance._myView.transform.localPositionZ;

			shadowObj.transform.localRotationEulerX = 90;
			shadowObj.transform.localRotationEulerY = instance._myView.transform.localRotationEulerY;

			this.elementField.addChild(shadowObj);
			shadowObj.instance = instance;
			instance.shadow = shadowObj;
			this.shadowList.push(shadowObj);
		}

		return instance;
	}

	//创建一个特效 {name:}
	public createEffect(data: any) {
		var cacheId = PoolCode.POOL_EFFECT + data.id;
		var cacheItem: InstanceEffect = this.createInstance(data, cacheId, BattleConst.model_effect, InstanceEffect, data.id);
		this.effectArr.push(cacheItem);
		return cacheItem;
	}

	public getEffectByName(name) {
		for (var i = 0; i < this.effectArr.length; i++) {
			var eff: InstanceEffect = this.effectArr[i];
			if (eff.getData().id == name) {
				return eff;
			}
		}
		return null;
	}

	//创建一个子弹 
	public createBullet(data: any) {
		var cacheId = PoolCode.POOL_BUTTLE + data.id;
		// var cfgdata = BattleFunc.instance.getBulletData(data.id);
		// var cacheItem: InstanceBullet = this.createInstance(data, cacheId, BattleConst.model_role, InstanceBullet, "role_car_03", 1);

		var cacheItem: InstanceBullet = this.createInstance(data, cacheId, BattleConst.model_role, InstanceBullet, BattleConst.model_bullet_model, 1);
		this.bulletArr.push(cacheItem);
		this._allInstanceArr.push(cacheItem);
		return cacheItem;
	}

	// //创建一个主角
	// public createPlayer(data: any) {
	// 	var cacheId = PoolCode.POOL_PLAYER + data.id;
	// 	var roleInfo = BattleFunc.instance.getRoleInfoData(data.id);
	// 	var cacheItem: InstancePlayer = this.createInstance(data, cacheId, BattleConst.model_role, InstancePlayer, roleInfo.model, roleInfo.sizeScale / 10000);
	// 	this.player = cacheItem;
	// 	//初始朝向
	// 	this.player.countGunRotate(ScreenAdapterTools.width / 2, ScreenAdapterTools.height / 2, false);

	// 	this._allInstanceArr.push(cacheItem);
	// 	return cacheItem;
	// }

	//创建一个角色(场景物件)
	public createRole(data: any, object: any, shadow = null) {
		var cacheId = PoolCode.POOL_PLAYER + data.name + "_" + data.id;
		// var viewName = BattleFunc.instance.getCfgDatasByKey("Monster", data.id, "model")
		var cacheItem: InstanceRole = this.createInstanceDefault(data, cacheId, object, InstanceRole, shadow);
		// cacheItem.initStep(step, trackPos);
		// cacheItem.pos.y = BattleFunc.defaultYpos;
		// cacheItem.setPos(0, 0.1, 0)
		this._allInstanceArr.push(cacheItem);
		this.roleArr.push(cacheItem);
		return cacheItem;
	}

	//创建一个角色(主角)
	public createPlayer(data: any, object: any, shadow = null) {
		var cacheId = PoolCode.POOL_PLAYER + data.name + "_" + data.id;
		// var viewName = BattleFunc.instance.getCfgDatasByKey("Monster", data.id, "model")
		var cacheItem: InstancePlayer = this.createInstanceDefault(data, cacheId, object, InstancePlayer, shadow);
		// cacheItem.initStep(step, trackPos);
		// cacheItem.pos.y = BattleFunc.defaultYpos;
		// cacheItem.setPos(0, 0.1, 0)
		this._allInstanceArr.push(cacheItem);
		this.roleArr.push(cacheItem);

		var y = cacheItem.pos.y;
		this.gamePlane = ViewTools.createPlaneBy3p(VectorTools.createVec3(-10, y, 10), VectorTools.createVec3(10, y, -10), VectorTools.createVec3(10, y, 10));

		return cacheItem;
	}


	public createExplode(pos, range) {
		var dis = range;
		// WindowManager.ShowTip("生成爆炸 距离" + dis);
		var explodeEffect;
		if (this.explodeEffectArr.length) {
			explodeEffect = this.explodeEffectArr.pop();
		}
		else {
			explodeEffect = this.explodeEffect.clone();
		}
		this.activeExplodeEffectArr.push(explodeEffect);
		this.battleScene.addChild(explodeEffect);
		explodeEffect.transform.position.x = pos.x;
		explodeEffect.transform.position.y = pos.y;
		explodeEffect.transform.position.z = pos.z;
		explodeEffect.transform.position = explodeEffect.transform.position;
		for (var part of explodeEffect._children) {
			part.transform.scale.x = part.transform.scale.y = part.transform.scale.z = range / 1.5;
			part.transform.localScale = part.transform.scale;
		}
		explodeEffect.active = true;
		var tempFunc = ()=>{
			if (explodeEffect.active) {
				var roleArr = this.roleArr;
				for(var i = roleArr.length-1;i>=0; i--){
					var instance = roleArr[i];
					var dx = instance.pos.x - pos.x;
					var dz = instance.pos.z - pos.z;
					if (Math.pow(dx, 2) + Math.pow(dz, 2) <= Math.pow(dis, 2)) {
						this.destoryRole(instance);
					}
				}
			}
		}
		TimerManager.instance.add(tempFunc,this,500,1 )

	}


	//初始化游戏
	initGame(data) {
		this.battleUi = WindowManager.getUIByName(WindowCfgs.BattleUI);
		//一些信息的初始化操作
		this.initBattleInfo();
		//创建其他的car
		this.basicBulletNum = LevelFunc.instance.getLevelInfoByTwoId(data.levelId, "basisBulletNub")
		this.maxBulletNum = this.basicBulletNum + LevelFunc.instance.getLevelInfoByTwoId(this.battleData.levelId, "threeStarPayBulletNub");

		this.bulletNum = this.maxBulletNum;
		this.battleEnd = false;

		Message.instance.send(BattleEvent.BATTLEEVENT_BATTLESTART);

		//初始化摄像机跟随主角
		// this.cameraControler.followPlayer();
		// this.battleCamera.clearFlag = Laya.Camera.CLEARFLAG_SOLIDCOLOR
		// this._lastFrameTime = Client.instance.miniserverTime
		TimerManager.instance.registObjUpdate(this.onceUpdateFrame,this);

		// this.player.resetChildViewRotationAndPos();

	}

	//初始化角色
	initRole() {
		// this.player = this.createPlayer({ id: this.battleData.roleId, superId: this.superWeaponId })
		// this.player.setPos(this.originPos3D.x, this.originPos3D.y, this.originPos3D.z);
	}

	//初始化一些信息
	initBattleInfo() {
	}

	//处理事件
	public recvMsg(cmd: string, data: any): void {
	}


	//得分
	public changeScore(value: number) {
	}

	//设置撞击力
	public setHitForce(force) {
		var hitParams = GlobalParamsFunc.instance.getDataByTwoId("impactParams", "arr");
		this.hitForce = BattleFunc.instance.turnSpeedToFrame(Math.ceil(force / (Number(hitParams[0]) + force) * Number(hitParams[1])));
	}

	//获取撞击力
	public getHitForce() {
		return this.hitForce;
	}

	//进入结算
	public enterBattleOver() {
		//进入结算状态;
		//开始发送打点数据

		this.setBattleState(BattleConst.battleState_over);

		this.battleEnd = false;
		WindowManager.OpenUI(WindowCfgs.BattleResultUI, { levelId: this.battleData.levelId, rank: this.bulletNum >= this.basicBulletNum ? 3 : (this.bulletNum > 1 ? 2 : 1) })

	}
	//退出游戏,这个不是销毁游戏
	exitBattle() {
		TimerManager.instance.deleteObjUpdate(null,this.onceUpdateFrame,this);
		this.statistControler.startSendStatistics();
		// this.stopSound(MusicConst.SOUND_REV_LOOP);
		// this.stopSound(MusicConst.SOUND_REV_LOOP2);
		var arr2: InstanceRole[] = TableUtils.copyOneArr(this.roleArr);
		var arr3: InstanceBullet[] = TableUtils.copyOneArr(this.bulletArr);
		//销毁怪物
		for (var i = 0; i < arr2.length; i++) {
			this.destoryRole(arr2[i], false);
		}

		for (var i = 0; i < arr3.length; i++) {
			this.destoryBullet(arr3[i]);
		}


		this.player = null;
		this.mapControler.destoryMap();
		//销毁主角
		// this.destoryRole(this.player);
		//清空延迟回调
		this._timeList = [];
		this.battleScene.setActive(false);
	}

	checkResult() {
		if (!this.player) {
			this.battleEnd = true;
			WindowManager.ShowTip("失败");
			TimerManager.instance.setTimeout(() => {
				this.battleUi.onReplayGame();
			}, this, 1000);
			return;
		}
		var arr2: InstanceRole[] = TableUtils.copyOneArr(this.roleArr);
		var targetNum = 0;
		for (var i = 0; i < arr2.length; i++) {
			if (arr2[i].type == "Target" && arr2[i].dead == false) {
				targetNum++;
			}
		}
		if (!targetNum) {
			this.battleEnd = true;
			WindowManager.ShowTip("过关");
			if (GuideManager.ins.nowGuideId == 3) {
				GuideManager.ins.guideFin(3, () => {
					WindowManager.CloseUI(WindowCfgs.GuideUI);
					TimerManager.instance.setTimeout(() => {
						this.enterBattleOver();
					}, this, 1000);
				}, this, true);
			}
			else {
				TimerManager.instance.setTimeout(() => {
					this.enterBattleOver();
				}, this, 1000);
			}
		}
	}

	//销毁游戏
	dispose() {
		super.dispose();
	}

	protected preCreateEffGroup() {
		var effectArr = [ResourceConst.EFFECT_BLOOD, ResourceConst.EFFECT_EXPLODE, ResourceConst.EFFECT_SHOOT];
		for (var i = 0; i < effectArr.length; i++) {
			this.preCreateEffect(effectArr[i], 120);
		}

	}

	//预缓存一个特效 .默认120秒后重新缓存
	public preCreateEffect(name: string, frame: number = 10) {
		var eff = this.createEffect({ id: name });
		eff.setLastFrame(frame);
		//把这个特效放到天边去
		eff.setPos(10000, 100000, 10000);
	}



}