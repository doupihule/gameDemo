import { BattleLayerControler } from './BattleLayerControler';
import BattleControler from "./BattleControler";
import IMessage from "../../sys/interfaces/IMessage";
import RefreshControler from "./RefreshControler";
import InstanceHero from "../instance/InstanceHero";
import InstanceMonster from "../instance/InstanceMonster";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import TableUtils from "../../../framework/utils/TableUtils";
import BattleFunc from "../../sys/func/BattleFunc";
import Message from "../../../framework/common/Message";
import BattleEvent from "../../sys/event/BattleEvent";
import RandomUtis from "../../../framework/utils/RandomUtis";
import LevelFunc from "../../sys/func/LevelFunc";
import InstanceEffect from "../instance/InstanceEffect";
import BattleMapControler from "./BattleMapControler";
import BattleConst from "../../sys/consts/BattleConst";
import SoundManager from "../../../framework/manager/SoundManager";
import InstanceBasic from "../instance/InstanceBasic";
import BattleStatisticsControler from "./BattleStatisticsControler";
import UserInfo from "../../../framework/common/UserInfo";
import InstanceLife from "../instance/InstanceLife";
import BattleRoleView from "../view/BattleRoleView";
import InstanceLogical from '../instance/InstanceLogical';
import RoleHealthBar from '../view/RoleHealthBar';
import BuffTrigger from '../trigger/BuffTrigger';
import SkillActionData from '../data/SkillActionData';
import InstanceBullet from '../instance/InstanceBullet';
import BattleLogsManager from '../../sys/manager/BattleLogsManager';
import InstancePlayer from '../instance/InstancePlayer';
import BattleSkillData from '../data/BattleSkillData';
import ChooseTrigger from '../trigger/ChooseTrigger';
import LogsManager from '../../../framework/manager/LogsManager';
import ResourceConst from '../../sys/consts/ResourceConst';
import BattleDebugTool from './BattleDebugTool';
import PassiveSkillData from '../data/PassiveSkillData';
import PassiveSkillTrigger from '../trigger/PassiveSkillTrigger';
import BattleGuideControler from './BattleGuideControler';
import ScreenAdapterTools from '../../../framework/utils/ScreenAdapterTools';
import Client from '../../../framework/common/kakura/Client';
import InstanceHome from '../instance/InstanceHome';
import GlobalParamsFunc from '../../sys/func/GlobalParamsFunc';
import WindowManager from '../../../framework/manager/WindowManager';
import { WindowCfgs } from '../../sys/consts/WindowCfgs';
import RolesModel from '../../sys/model/RolesModel';
import DisplayUtils from '../../../framework/utils/DisplayUtils';
import RoleBuffBar from '../view/RoleBuffBar';
import RolesFunc from '../../sys/func/RolesFunc';
import ConditionTrigger from '../trigger/ConditionTrigger';
import FogFunc from '../../sys/func/FogFunc';
import FogEventData from '../../fog/data/FogEventData';
import FogModel from '../../sys/model/FogModel';
import GameConsts from '../../sys/consts/GameConsts';



/**
 * 战斗控制器  控制战斗流程刷新. 以及所有对象的创建缓存销毁
 * 
 * 
 * 
 */
export default class BattleLogicalControler extends BattleControler implements IMessage {
	/**战斗数据 */
	public battleData: any;

	//游戏模式 分自动战斗或者boss战
	public gameMode: number = BattleConst.battle_game_mode_auto;




	//关卡对应的配置数据
	public levelCfgData: any;

	//地图控制器
	public mapControler: BattleMapControler;
	//层级管理器
	public layerControler: BattleLayerControler;

	//统计管理器
	public statistControler: BattleStatisticsControler;
	//引导管理器
	public guideControler: BattleGuideControler;

	//当前最前面一个角色的x坐标 标记最前面的一个角色的坐标
	public frontRole1: InstanceLogical
	public frontRole2: InstanceLogical;

	//有坐标发生变化
	public hasPosDirty1: boolean = false;
	public hasPosDirty2: boolean = false;

	public frontPos1: number = 0;

	//对应的ui载体. 用来做交互的.
	public battleUI: any;

	//全局通用的属性加成 比如天赋 等,提升计算性能
	public globalAttrMap: any
	public passive;

	//全局光环类被动; 
	/**
	 * 存储起来是为了提升性能. 计算属性的时候 把这个一起算进去效率会更高. 也更容易管理
	 * [
	 * 	{attr:[],passive:skill },
	 * 	
	 * ]
	 * 
	 */
	public globalPassiveAttrMap: any[]

	public startTime = 0;
	//**我方基地 */
	public myHome: InstanceHome;
	/**敌方基地 */
	public enemyHome: InstanceHome;
	/**是否游戏结束 */
	public isGameOver = false;
	/**技能容器 */
	public skillContent: InstancePlayer;
	/**复活次数 */
	public reviveCount = 0;
	/**是否处于远征复活战斗中 */
	public inFogReviveBattle = false;
	/**是否处于超时复活战斗中 */
	public inOverTimeRevive = false;
	/**是否处于战败复活战斗中 */
	public inDefeatRevive = false;
	/**技能cd 默认是有cd的 */
	public battleSkillnoCd = false;
	/**助阵角色的id */
	public helpRoleId: any;
	public helpRoleCd: any;
	public helpRoleLeftCd: any
	public constructor(ctn: any, ui: any, gameMode: number = 1) {
		super(ctn);
		this.gameMode = gameMode;
		this.isGameOver = false;

		BuffTrigger.init();
		Message.instance.add(BattleEvent.BATTLEEVENT_CONTINUE_BATTLE, this);
		this.campArr_1 = []
		this.campArr_2 = [];
		this.diedArr_1 = [];
		this.diedArr_2 = [];
		this.battleUI = ui;
		//初始化全局光环类的被动
		this.globalPassiveAttrMap = [];
		var time = Laya.Browser.now()
		BattleLogsManager.battleEcho("battle 设置随机种子:", time, "用来做复盘用")
		RandomUtis.setOneRandomYinzi(time, BattleFunc.battleRandomIndex);
		this.refreshControler = new RefreshControler(this);
		this.mapControler = new BattleMapControler(this);
		this.statistControler = new BattleStatisticsControler(this);
		this.layerControler = new BattleLayerControler(this, ctn);
		this.guideControler = new BattleGuideControler(this);
		this.passive = null;
		//全局属性加成
		this.globalAttrMap = {
		}
	}
	//设置数据
	public setData(data) {
		//初始化统计控制器
		this.statistControler.setData();
		this.battleData = data;
		this.battleState = BattleConst.battleState_in;
		this.frontPos1 = 0;
		this._isGamePause = false
		this.tweenControler.setData();
		this.startTime = Client.instance.serverTime;
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			this.setNormalMap();
		} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			this.setWarMap();
		}
		//摄像头初始化位置
		this.cameraControler.updateCtnPos();
	}
	//普通地图
	setNormalMap() {
		this.levelCfgData = LevelFunc.instance.getLevelInfoById(this.battleData.levelId);
		this.mapControler.setData(this.levelCfgData.sceneId || "1")
	}
	//远征地图
	setWarMap() {
		var mapId;
		if (FogFunc.enemyCell) {
			var event: FogEventData = FogFunc.enemyCell.eventData;
			mapId = FogFunc.instance.getCfgDatasByKey("Enemy", event.params[0], "sceneId")
		} else {
			LogsManager.errorTag("", "没有当前的敌人事件格子")
		}
		this.mapControler.setData(mapId || "1");
	}
	//初始化游戏
	initGame() {
		this.cameraControler.setData();
		this.refreshControler.initData();
		Message.instance.send(BattleEvent.BATTLEEVENT_BATTLESTART);
		Laya.timer.frameLoop(1, this, this.onceUpdateFrame);
	}
	//重写逐帧刷新
	protected updateFrame() {
		if (this._isGamePause) {
			return;
		}
		if (this._isDisposed) {
			return;
		}
		super.updateFrame();
		this.freshHelpRoleCd();

	}
	/**刷新助阵英雄的cd */
	public freshHelpRoleCd() {
		if (this.helpRoleLeftCd < 0) return;
		if (this.helpRoleLeftCd % GameConsts.gameFrameRate == 0) {
			this.battleUI.freshHelpRoleState(this.helpRoleLeftCd / GameConsts.gameFrameRate);
		}
		this.helpRoleLeftCd -= 1;

	}
	//当有角色移动时
	public oneRoleMove(instance: InstanceLife) {
		if (instance.camp == 1) {
			if (!this.frontPos1) {
				this.frontPos1 = instance.pos.x;
			} else {
				if (this.frontPos1 < instance.pos.x) {
					this.frontPos1 = instance.pos.x;
				}
			}
		}
	}
	/**有角色死亡时，重新选取一遍最前边的位置 */
	public checkAllRolePos() {
		this.frontPos1 = this.myHome.pos.x;
		for (var i = 0; i < this.campArr_1.length; i++) {
			var item = this.campArr_1[i];
			if (this.frontPos1 < item.pos.x) {
				this.frontPos1 = item.pos.x;
			}
		}
	}
	//播放音效, lastTime 持续时间,表示多久后关闭 -1表示永久循环 0表示只播放一次
	public playSound(soundName: string, lastTime: number = -1) {
		// BattleLogsManager.battleEcho("battle play sound",soundName,lastTime)
		//@xdtest 暂时屏蔽声音
		if (lastTime == 0) {
			SoundManager.playSE(soundName, 1);
		} else {
			SoundManager.playSE(soundName, 0);
			if (lastTime > 0) {
				this.setCallBack(lastTime, this.stopSound, this, soundName);
			}
		}

	}

	//根据参数播放声音
	public playSoundByParams(params: any[]) {
		this.playSound(params[2], Number(params[3]))
	}

	//停止某个音效
	public stopSound(soundName: string) {
		SoundManager.stopMusicOrSound(soundName);
	}


	//---------------------------------------创建和销毁模块------------------------------------------------------



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
	public createInstance(data: any, cacheId: string, model: string, classModel, resName, x, y, z, viewScale: number = 1, viewIndex: number = 0) {
		var instance = PoolTools.getItem(cacheId);
		// BattleLogsManager.battleEcho("battle", "创建实例:", resName, "model:", model, viewScale);
		if (instance) {
			//重置 instance的控制器
			instance.controler = this;
			instance.setPos(x, y, z);
			// 缩放有变化 重新设置动画的缩放值
			if (instance._myView && instance._myView._viewScale != viewScale) {
				instance._myView.setItemViewScale(viewScale);
			}
			instance.setData(data);
		} else {
			var view: any;
			instance = new classModel(this);
			instance.cacheId = cacheId;
			if (resName) {
				var expandView: BattleRoleView;
				var viewName: string = resName
				//如果资源是字符串
				if (typeof resName == "string") {
					view = new BattleRoleView(resName, viewScale, viewIndex, "battle");
				} else {
					view = new BattleRoleView(resName[0], viewScale, viewIndex, "battle");
					viewName = resName[0]
					//部分角色或者怪物可能有2个视图.
					if (resName.length > 1) {
						expandView = new BattleRoleView(resName[1], viewScale, viewIndex);
						instance.setView2(expandView);
					}
				}
				// //先设置视图
				instance.setViewName(viewName);
				instance.setView(view);
			}
			instance.setPos(x, y, z);
			//设置数据
			instance.setData(data);
		}
		return instance;
	}


	//创建一个特效 {name:}
	public createEffect(data: any) {
		var cacheId = PoolCode.POOL_EFFECT + data.id + data.index;
		var cacheItem: InstanceEffect = this.performanceControler.getCacheEffect(cacheId);
		if (!cacheItem) {
			cacheItem = this.createInstance(data, cacheId, BattleConst.model_effect, InstanceEffect, data.id, 0, 0, 0, BattleFunc.defaultScale);
		} else {
			cacheItem.setData(data);
		}


		return cacheItem;
	}


	//预缓存一个特效 .默认120秒后重新缓存
	public preCreateEffect(name: string, frame: number = 10) {
		var eff = this.createEffect({ id: name, index: 0 });
		eff.setLastFrame(frame);
		//把这个特效放到天边去
		eff.setPos(10000, 100000, 10000);
	}



	//创建一个子弹 
	public createBullet(id: string, owner: InstanceLogical, skillAction: SkillActionData, x: number, y: number, rotation: number, targetRole, offz: number = 0) {
		var cacheId = PoolCode.POOL_BUTTLE + id;
		var resname = BattleFunc.instance.getCfgDatasByKey("Bullet", id, "model", true);
		var data = { id: id };
		var cacheItem: InstanceBullet = this.createInstance(data, cacheId, BattleConst.model_bullet, InstanceBullet, resname, x, y, owner.pos.z + offz, BattleFunc.defaultScale * owner.cfgScale);
		cacheItem.setOwner(owner, skillAction, rotation, targetRole);
		cacheItem.setZorderOffset(owner.zorderOffset);
		this._allInstanceArr.push(cacheItem);
		if (cacheItem.getView()) {
			this.layerControler.a22.addChild(cacheItem.getView());
		}
		return null;
	}

	//创建一个角色
	public createRole(id: string, data: any, lifeType: number, camp: number, offestX = 0, offestY = 0) {
		//角色的缓存id 还要拼一下lifeType，用来存不同阵营不同类型
		var cacheId = PoolCode.POOL_ROLE + id + "_" + data.level + "_" + data.starLevel + "_" + lifeType + "_" + camp;
		var scale = 1;
		var resname = "role_1002"
		if (!data.id) {
			data.id = id;
		}
		var modelName: string;
		var classObj: any;
		var cfgs = BattleFunc.instance.getCfgDatas("Role", id);
		//判断是我方角色还是敌方的
		if (camp == BattleConst.ROLEGROUP_MYSELF) {
			modelName = BattleConst.model_role;
			classObj = InstanceHero;
		} else {
			modelName = BattleConst.model_monster;
			classObj = InstanceMonster;
		}
		resname = cfgs.spine;
		scale = cfgs.scale / 10000 || 1
		// resname = "role_11"
		var tempPos = BattleFunc.tempPoint
		this.getPosByTypeAndCamp(camp, lifeType, tempPos, offestX, offestY, cfgs.warHeroplace || 1);
		var ypos = 0;
		if (lifeType == BattleConst.LIFE_AIRHERO) {
			ypos = -BattleFunc.airArmyHigh;
			if (!BattleFunc.CreateRoleIndex[BattleConst.LIFE_AIRHERO]) {
				BattleFunc.CreateRoleIndex[BattleConst.LIFE_AIRHERO] = 0;
			}
			BattleFunc.CreateRoleIndex[BattleConst.LIFE_AIRHERO] = BattleFunc.CreateRoleIndex[BattleConst.LIFE_AIRHERO] + 1 > BattleFunc.landArmyStartYLocation.length - 1 ? 0 : BattleFunc.CreateRoleIndex[BattleConst.LIFE_AIRHERO] + 1;
		} else {
			if (!BattleFunc.CreateRoleIndex[BattleConst.LIFE_LANDHERO]) {
				BattleFunc.CreateRoleIndex[BattleConst.LIFE_LANDHERO] = 0;
			}
			BattleFunc.CreateRoleIndex[BattleConst.LIFE_LANDHERO] = BattleFunc.CreateRoleIndex[BattleConst.LIFE_LANDHERO] + 1 > BattleFunc.landArmyStartYLocation.length - 1 ? 0 : BattleFunc.CreateRoleIndex[BattleConst.LIFE_LANDHERO] + 1;
		}
		var viewIndex = BattleFunc.instance.getCfgDatasByKey("RoleUpdate", id, data.level || 1).body || 0
		if (camp == BattleConst.ROLEGROUP_ENEMY && BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			//远征战斗敌人的皮肤强制用 9
			viewIndex = 9;
		}
		var cacheItem: InstanceLogical = this.createInstance(data, cacheId, modelName, classObj, resname, tempPos.x, ypos, tempPos.z, BattleFunc.defaultScale * scale, viewIndex);
		//把角色添加到a22
		this.layerControler.a22.addChild(cacheItem.getView());
		//
		if (cacheItem._myView2) {
			this.layerControler.a22.addChild(cacheItem._myView2);
		}
		this._allInstanceArr.push(cacheItem);
		cacheItem.setCamp(camp);
		this["campArr_" + camp].push(cacheItem);
		cacheItem.setLifeType(lifeType);
		//给这个角色执行全局被动
		PassiveSkillTrigger.runAllPassiveGlobalAttr(this.globalPassiveAttrMap, cacheItem, 1);
		


		if (camp == BattleConst.ROLEGROUP_ENEMY) {
			cacheItem.setViewWay(-1);
		} else {
			cacheItem.setViewWay(1);
		}



		//拿到这个角色的所有被动
		var passiveSkills = cacheItem.passiveSkills;
		if (passiveSkills) {
			for (var i = 0; i < passiveSkills.length; i++) {
				this.insterGlobalPassive(passiveSkills[i]);
			}
		}
		//我方角色的一些操作
		if (camp == BattleConst.ROLEGROUP_MYSELF) {
			//豪华开局：己方所有角色被动加成
			if (this.battleUI.battleAdditionId && (this.battleUI.battleAdditionId == BattleConst.battle_start_attack_add || this.battleUI.battleAdditionId == BattleConst.battle_start_life_add)) {
				var battleAdditionId = this.battleUI.battleAdditionId;
				var skillId = LevelFunc.instance.getBattleAddtionoByTwoId(battleAdditionId, "addtionNub");
				var passive: PassiveSkillData = new PassiveSkillData(skillId, 1, cacheItem, BattleConst.skill_kind_passive);
				this.insterGlobalPassive(passive);
				this.passive = passive;
			}
		}

		//远征模式敌方加被动
		if (camp == BattleConst.ROLEGROUP_ENEMY && BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			var level = FogModel.instance.getCurLayer() + 1;
			var passivSkill = data.passivSkill;
			if (passivSkill) {
				var passiveData: PassiveSkillData;
				for (var i = 0; i < passivSkill.length; i++) {
					passiveData = new PassiveSkillData(passivSkill[i], level, cacheItem, BattleConst.skill_kind_passive);
					this.insterGlobalPassive(passiveData);
				}
			}
		}

		//需要重算一下所有属性
		if (cacheItem.attrData.hasDataChange) {
			cacheItem.attrData.countAllAttr();
		}
		if (camp == BattleConst.ROLEGROUP_MYSELF) {
			if (this.battleUI.battleAdditionId && this.battleUI.battleAdditionId == BattleConst.battle_start_life_add) {
				var battleAdditionId = this.battleUI.battleAdditionId;
				cacheItem.hp = cacheItem.attrData.getOneAttr(BattleConst.attr_maxHp)
			}
		}
		//如果是普通战斗或者复活赛中 直接加出生触发的被动
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL || this.inFogReviveBattle) {
			//当我出生时
			ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_createMySelf, cacheItem);
		}
		cacheItem.resetHp();
		cacheItem.hpBar = this.createHealthBar(cacheItem.camp, cacheItem);
		cacheItem.hpBar.followTarget();
		cacheItem.buffBar = this.createBuffBar(cacheItem.camp, cacheItem);
		cacheItem.buffBar.followTarget();

		this.oneRoleMove(cacheItem);
		return cacheItem;
	}
	public createHome(id: string, data: any, lifeType: number, camp: number, offestX = 0, offestY = 0) {
		//角色的缓存id
		var cacheId = PoolCode.POOL_HOME + id + "_" + lifeType + "_" + camp;
		var scale = 1;
		var resname = "role_1000"
		if (!data.id) {
			data.id = id;
		}

		var modelName: string = BattleConst.model_home;
		var classObj: any = InstanceHome;
		var cfgs = BattleFunc.instance.getCfgDatas("Role", id);
		resname = cfgs.spine;
		scale = cfgs.scale / 10000 || 1
		var tempPos = BattleFunc.tempPoint
		if (camp == BattleConst.ROLEGROUP_MYSELF) {
			tempPos.x = GlobalParamsFunc.instance.getDataNum("myHomeLocation");
		} else {
			tempPos.x = this.mapControler._maxSceneWidth - GlobalParamsFunc.instance.getDataNum("enemyHomeLocation");
		}
		tempPos.z = BattleFunc.battleCenterY
		var ypos = 0;
		var viewIndex = BattleFunc.instance.getCfgDatasByKey("RoleUpdate", id, data.level).body || 0
		if (camp == BattleConst.ROLEGROUP_ENEMY && BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			//远征战斗敌人的皮肤强制用 9
			viewIndex = 9;
		}
		var cacheItem: InstanceHome = this.createInstance(data, cacheId, modelName, classObj, resname, tempPos.x, ypos, tempPos.z, BattleFunc.defaultScale * scale, viewIndex);
		//把角色添加到a22
		this.layerControler.a22.addChild(cacheItem.getView());

		//
		if (cacheItem._myView2) {
			this.layerControler.a22.addChild(cacheItem._myView2);
		}
		this._allInstanceArr.push(cacheItem);
		cacheItem.setCamp(camp);
		cacheItem.setLifeType(lifeType)
		this["campArr_" + camp].push(cacheItem);
		//给这个角色执行全局被动
		PassiveSkillTrigger.runAllPassiveGlobalAttr(this.globalPassiveAttrMap, cacheItem, 1);

		if (camp == BattleConst.ROLEGROUP_ENEMY) {
			cacheItem.setViewWay(-1);
		} else {
			cacheItem.setViewWay(1);
		}

		//拿到这个角色的所有被动
		var passiveSkills = cacheItem.passiveSkills;
		if (passiveSkills) {
			for (var i = 0; i < passiveSkills.length; i++) {
				this.insterGlobalPassive(passiveSkills[i]);
			}
		}

		if (camp == BattleConst.ROLEGROUP_MYSELF) {
			//豪华开局：己方基地技能cd降低
			if (this.battleUI.battleAdditionId && this.battleUI.battleAdditionId == BattleConst.battle_start_homeCd) {
				var battleAdditionId = this.battleUI.battleAdditionId;
				var skillId = LevelFunc.instance.getBattleAddtionoByTwoId(battleAdditionId, "addtionNub");
				var passive: PassiveSkillData = new PassiveSkillData(skillId, 1, cacheItem, BattleConst.skill_kind_passive);
				this.insterGlobalPassive(passive);
				this.passive = passive;
			}

			//远征模式：己方基地随等级提升攻击力和生命上限
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
				var level = FogModel.instance.getBusLevel();
				var passiveSkillId = FogFunc.instance.getCfgDatasByKey("BusUpGrade_json", level, "passiveSkill");
				if (passiveSkillId) {
					var passive: PassiveSkillData = new PassiveSkillData(passiveSkillId, level, cacheItem, BattleConst.skill_kind_passive);
					this.insterGlobalPassive(passive);
				}
			}
		} else {
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
				//普通模式敌方加全局被动
				var passiveSkillInfo = this.levelCfgData.passivSkill;
				if (passiveSkillInfo) {
					var passive: PassiveSkillData = new PassiveSkillData(passiveSkillInfo[0], Number(passiveSkillInfo[1]), cacheItem, BattleConst.skill_kind_passive);
					this.insterGlobalPassive(passive);
				}
			}
		}
		
		//需要重算一下所有属性
		if (cacheItem.attrData.hasDataChange) {
			cacheItem.attrData.countAllAttr();
		}
		cacheItem.resetHp();
		cacheItem.hpBar = this.createHealthBar(cacheItem.camp, cacheItem);
		cacheItem.hpBar.followTarget();

		this.oneRoleMove(cacheItem);

		return cacheItem;
	}
	//创建召唤物
	public createSummoned(id: string, data: any, x: number, z: number, fromRole: InstanceLogical, liveFrame: number = -1) {
		var cacheId = PoolCode.POOL_MONSTER + id + "_" + data.level + "_" + data.starLevel;
		// var resname = "role_1002"
		var cfgData = BattleFunc.instance.getCfgDatas("Role", id);
		var resname = cfgData.spine;
		if (!data.id) {
			data.id = id;
		}
		var scale = cfgData.scale / 10000;
		var viewIndex = BattleFunc.instance.getCfgDatasByKey("RoleUpdate", id, data.level).body || 0
		var cacheItem: InstanceMonster = this.createInstance(data, cacheId, BattleConst.model_role, InstanceMonster, resname, x, 0, z, BattleFunc.defaultScale * scale, viewIndex);
		cacheItem.attrData.countSummonedAttr(data.level, fromRole.attrData)
		cacheItem.hp = cacheItem.maxHp;
		this._allInstanceArr.push(cacheItem);
		this.layerControler.a22.addChild(cacheItem.getView());
		if (cacheItem._myView2) {
			this.layerControler.a22.addChild(cacheItem._myView2);
		}
		cacheItem.setCamp(fromRole.camp);
		cacheItem.setLifeType(BattleFunc.instance.getCfgDatasByKey("Role", id, "kind"))
		fromRole.campArr.push(cacheItem);
		cacheItem.checkMoveOrAttack(true);
		cacheItem.setLiveFrame(liveFrame);
		//给这个角色执行全局被动
		PassiveSkillTrigger.runAllPassiveGlobalAttr(this.globalPassiveAttrMap, cacheItem, 1);
		
		//拿到这个角色的所有被动
		var passiveSkills = cacheItem.passiveSkills;
		if (passiveSkills) {
			for (var i = 0; i < passiveSkills.length; i++) {
				this.insterGlobalPassive(passiveSkills[i]);
			}
		}
		//需要重算一下所有属性
		if (cacheItem.attrData.hasDataChange) {
			cacheItem.attrData.countAllAttr();
		}
		cacheItem.resetHp()
		cacheItem.hpBar = this.createHealthBar(cacheItem.camp, cacheItem);
		this.oneRoleMove(cacheItem);
		return cacheItem;
	}
	//创建一个buff区域
	public createBuffBar(camp: number, instance: InstanceLife) {
		var cacheItem: RoleBuffBar = PoolTools.getItem(PoolCode.POOL_BUFFBAR + camp);
		if (!cacheItem) {
			cacheItem = new RoleBuffBar();
		}
		cacheItem.setData(instance, this.layerControler.a23);
		return cacheItem;
	}
	//创建一个血条
	public createHealthBar(camp: number, instance: InstanceLife) {
		var cacheItem: RoleHealthBar = PoolTools.getItem(PoolCode.POOL_HPBAR + camp);
		if (!cacheItem) {
			cacheItem = new RoleHealthBar();
		}
		cacheItem.setData(instance, this.layerControler.a23);
		return cacheItem;
	}
	/**创建基地技能容器 */
	public createSkillContent(skillArr, parent) {
		var cacheId = PoolCode.POOL_PLAYERCONTENT;
		var item = PoolTools.getItem(cacheId);
		if (!item) {
			item = new InstancePlayer(this);
		} else {
			item.controler = this;
		}
		var data = TableUtils.copyOneTable(this.myHome.cfgData)
		item.setData(data);
		item.cacheId = cacheId;
		item.setSkillInfo(skillArr, parent);
		item.setCamp(BattleConst.ROLEGROUP_MYSELF);
		this._allInstanceArr.push(item);
		return item;

	}





	//创建一个技能数据.后面会为缓存做准备
	public createSkillData(skillId: string, level: number, role: any, skillType: number, lifeType = null) {
		return new BattleSkillData(skillId, level, role, skillType, null, lifeType);
	}

	//创建一个被动技 后续扩展使用缓存
	public createPassiveSkill(skillId: string, level: number, role: any, relyonSkill: any = null) {
		return new PassiveSkillData(skillId, level, role, BattleConst.skill_kind_passive, relyonSkill);
	}

	//创建影子 
	public createShade() {
		var sp: Laya.Image = PoolTools.getItem(PoolCode.POOL_SHADE);
		if (!sp) {
			sp = new Laya.Image(ResourceConst.BATTLE_SHADE);
			sp.anchorX = 0.5
			sp.anchorY = 0.5
		}
		sp.visible = true;
		sp.scale(1, 1);
		return sp;
	}



	//销毁一个实例
	public destoryInstance(instance: InstanceBasic, outRemoveAllArr: boolean = false) {
		var cacheId = instance.cacheId;
		var model = instance.classModel;
		if (!instance.checkIsUsing()) {
			return;
		}
		//必须是没有缓存的我才放入缓存池. 比如特效 比较例外.因为有多个地方持有特效引用.导致会执行重复放入缓存逻辑
		if (!PoolTools.checkItemHasCache(cacheId, instance)) {
			//把instance放入缓存.
			PoolTools.cacheItem(cacheId, instance);
		}


		instance.onSetToCache();
		if (!outRemoveAllArr) {
			TableUtils.removeValue(this._allInstanceArr, instance);
		}

		if (model == BattleConst.model_effect) {
			this.performanceControler.removeCacheEffect(instance as InstanceEffect);
		} else if (model == BattleConst.model_role) {
			(instance as InstanceLogical).destroyPoint()
			// this.player = null;
			TableUtils.removeValue(this.campArr_1, instance);
			TableUtils.removeValue(this.diedArr_1, instance);
		} else if (model == BattleConst.model_monster) {
			// this.player = null;
			(instance as InstanceLogical).destroyPoint()
			TableUtils.removeValue(this.campArr_2, instance);
			TableUtils.removeValue(this.diedArr_2, instance);
		} else if (model == BattleConst.model_home) {
			(instance as InstanceLogical).destroyPoint();
			TableUtils.removeValue(this.campArr_1, instance);
			TableUtils.removeValue(this.diedArr_1, instance);
			TableUtils.removeValue(this.campArr_2, instance);
			TableUtils.removeValue(this.diedArr_2, instance);
		}
		//清除这个对象注册的所有回调
		this.clearCallBack(instance);
	}



	//销毁一个怪物
	public destoryMonster(monster: InstanceMonster) {
		if (!monster.checkIsUsing()) {
			return;
		}
		this.destoryInstance(monster);

		this.hasPosDirty2 = true;
	}

	//销毁主角 
	public destoryHero(role: InstanceHero) {
		if (!role.checkIsUsing()) {
			return;
		}
		var passives = role.passiveSkills;
		for (var i = passives.length - 1; i >= 0; i--) {
			//清除这条被动效果
			this.clearOnePassiveAttr(passives[i]);
		}
		this.destoryInstance(role);


		this.hasPosDirty1 = true;
	}

	//销毁一个子弹 
	public destroyBullet(bullet: InstanceBullet) {
		if (!bullet.checkIsUsing()) {
			return;
		}
		this.destoryInstance(bullet);
	}


	//销毁一个特效
	public destoryEffect(effect: InstanceEffect) {
		this.destoryInstance(effect);
	}


	//销毁一个数组的实例
	destoryInstanceArr(instanceArr: InstanceBasic[], outRemoveAllArr: boolean = false) {
		for (var i = instanceArr.length - 1; i >= 0; i--) {
			if (instanceArr[i]) {
				this.destoryInstance(instanceArr[i], outRemoveAllArr);
			}
		}
	}
	/**
	 * 创建我方角色
	 * @param id 角色id
	 * @param level 角色等级
	 * @param starLevel 角色星级
	 * @param type 角色类型 助阵角色/普通角色
	 */
	public createMyRole(id, level = 1, starLevel = null, type = null) {
		var data = BattleFunc.instance.getCfgDatas("Role", id);
		level = RolesModel.instance.getRoleLevelById(id);
		if (starLevel == null) {
			starLevel = RolesModel.instance.getRoleStarLevel(id)
		}
		var num = data.heroNub || 1;
		var offestX = 0;
		for (var j = 0; j < num; j++) {
			if (j != 0) {
				offestX = data.startSite[j];
			}
			this.createRole(id, { level: level, starLevel: starLevel, type: type }, data.kind, BattleConst.ROLEGROUP_MYSELF, offestX);
		}
	}





	//----------------------------外部接口--------------------------------------

	public setPosX(posX) {
		return posX
	}
	//获取坐标 输出到 outpos.x ,outpos.x,outpos.z
	public getPosByTypeAndCamp(camp: number, type: number, outpos: Laya.Vector3, offestX, offestY, xIndex = 1) {

		var targetX = 0;
		var targetY;

		//地面角色x读地面配置 y走循环
		if (type == BattleConst.LIFE_AIRHERO) {
			var posX = BattleFunc.airArmyStartXLocation
			//远征的角色，读取站位坐标
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
				posX = Number(BattleFunc.warRoleXoffest[xIndex - 1])
			}
			if (camp == BattleConst.ROLEGROUP_ENEMY) {
				targetX = this.mapControler._maxSceneWidth - posX;
			} else {
				targetX = this.setPosX(posX)
			}
			targetX += offestX;
			var index = BattleFunc.CreateRoleIndex[BattleConst.LIFE_AIRHERO] || 0;
			targetY = BattleFunc.battleCenterY + Number(BattleFunc.landArmyStartYLocation[index]) + offestY;
		} else {
			if (type == BattleConst.LIFE_LANDBUILD) {
				//电塔x
				var posX = BattleFunc.pylonStartXLocation
				if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
					posX = Number(BattleFunc.warRoleXoffest[xIndex - 1])
				}
				offestX = Math.random() * BattleFunc.pylonTwoLocation;
				if (camp == BattleConst.ROLEGROUP_ENEMY) {
					targetX = this.mapControler._maxSceneWidth - posX + offestX;
				} else {
					targetX = this.setPosX(posX) + offestX
				}
			} else {
				var posX = BattleFunc.landArmyStartXLocation
				if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
					posX = Number(BattleFunc.warRoleXoffest[xIndex - 1])
				}
				if (camp == BattleConst.ROLEGROUP_ENEMY) {
					targetX = this.mapControler._maxSceneWidth - posX;
				} else {
					targetX = this.setPosX(posX)
				}
				targetX += offestX;
			}
			var index1 = BattleFunc.CreateRoleIndex[BattleConst.LIFE_LANDHERO] || 0;
			targetY = BattleFunc.battleCenterY + Number(BattleFunc.landArmyStartYLocation[index1]) + offestY;
		};
		if (isNaN(targetY)) {
			LogsManager.errorTag("无效的z坐标", "无效的z坐标")
		}
		outpos.x = targetX;
		outpos.z = targetY;
		return outpos;
	}
	//根据id获取role
	public getRoleById(id: string) {
		for (var i = 0; i < this.campArr_1.length; i++) {
			var role = this.campArr_1[i];
			if (role.dataId == id) {
				return role;
			}
		}
		for (var i = 0; i < this.diedArr_1.length; i++) {
			var role = this.diedArr_1[i];
			if (role.dataId == id) {
				return role;
			}
		}
		return null
	}



	//点击某个角色技能
	public onClickRole(rid: string) {
		var role: InstanceHero = ChooseTrigger.getPlayerById(rid, this.campArr_1) as InstanceHero;
		if (role) {
			role.onCheckGiveEnergySkill()
		}
	}


	//------------------------------全局属性------------------------------------------------

	//插入一条被动属性  isJustRun是否立即加成被动属性. 返回是否执行成功.决定是否需要重算战力
	public insterGlobalPassive(passive: PassiveSkillData) {
		var type = passive.cfgData.effectType;
		if (type != BattleConst.passive_effect_global_attr) {
			return false;
		}
		//如果未激活 不用执行
		if (!passive.isActive) {
			return false;
		}
		for (var i = this.globalPassiveAttrMap.length - 1; i >= 0; i--) {
			var info = this.globalPassiveAttrMap[i];
			//如果相同id的 先做移除
			if (info.passive._skillId == passive._skillId) {
				this.clearOnePassiveAttr(passive)
			}
		}
		var attrInfo = TableUtils.deepCopy(passive.skillLogicalParams, []);
		var map = { attr: attrInfo, passive: passive };
		this.globalPassiveAttrMap.push(map);
		PassiveSkillTrigger.runOnePassiveGlobalAttr(map.passive, map.attr);
		return true;
	}


	//移除一条被动
	public clearOnePassiveAttr(passive: PassiveSkillData) {
		var type = passive.cfgData.effectType;
		if (type != BattleConst.passive_effect_global_attr) {
			return;
		}
		if (!passive.isActive) {
			return;
		}
		for (var i = this.globalPassiveAttrMap.length - 1; i >= 0; i--) {
			var info = this.globalPassiveAttrMap[i];
			//如果相同id的 先做移除
			if (info.passive._skillId == passive._skillId) {
				this.globalPassiveAttrMap.splice(i, 1);
				PassiveSkillTrigger.runOnePassiveGlobalAttr(info.passive, info.attr, null, -1);
			}
		}
	}
	/**清除所有角色 */
	clearAllRole() {
		var arr = this.campArr_1;
		for (var i = arr.length - 1; i >= 0; i--) {
			var item = arr[i];
			//如果不存在角色类型或者角色类型不是助阵英雄 并且不是基地，就销毁
			if ((!item.roleType || item.roleType != BattleConst.ROLETYPE_HELPROLE) && item.lifeType != BattleConst.LIFE_JIDI) {
				this.destoryHero(item as InstanceHero)
			}
		}
	}
	/**迷雾模式等战斗开始后再加当我出生的触发 */
	public addAllTiggerOnBorn() {
		var camp1 = this.campArr_1;
		for (var i = 0; i < camp1.length; i++) {
			ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_createMySelf, camp1[i]);
		}
		var camp2 = this.campArr_2;
		for (var i = 0; i < camp2.length; i++) {
			ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_createMySelf, camp2[i]);
		}
	}

	//退出游戏
	exitBattle() {
		this.dispose()
	}

	//隐藏战斗 
	public hideBattle() {
		this.layerControler.a.removeSelf();
		this.setGamePlayOrPause(true)
	}

	//显示战斗
	public showBattle() {
		this.layerControler.rootCtn.addChild(this.layerControler.a);
		this.setGamePlayOrPause(false);

	}
	/**显示迷雾复活 */
	public showFogRevive() {
		this.setGamePlayOrPause(true);
		WindowManager.OpenUI(WindowCfgs.FogBattleReviveUI, { controler: this })

	}
	/**执行迷雾复活 */
	public fogRevive() {
		this.reviveCount += 1;
		this.inFogReviveBattle = true;
		this.battleUI.addFogEnergy(BattleFunc.fogBattleRecover);
		//如果我方基地被打爆了，把基地复活
		var arr = this.campArr_1;
		var newJidi = true;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].lifeType == BattleConst.LIFE_JIDI) {
				newJidi = false;
				break;
			}
		}
		if (newJidi) {
			this.refreshControler.createMyHome();
		}
	}

	/**显示复活 */
	public showBattleRevive(type) {
		this.setGamePlayOrPause(true);
		WindowManager.OpenUI(WindowCfgs.BattleReviveUI, { controler: this, reviveType: type })

	}
	/**执行超时复活 */
	public overTimeRevive() {
		this.inOverTimeRevive = true;
		var passiveData: PassiveSkillData = new PassiveSkillData(BattleFunc.overTimePassiveSkill, 1, this.myHome, BattleConst.skill_kind_passive);
		this.insterGlobalPassive(passiveData);
	}
	/**执行失败复活 */
	public defeatRevive() {
		this.inDefeatRevive = true;
		//杀掉除了敌方基地外的敌人
		var arr = this.campArr_2;
		for (var i = arr.length - 1; i >= 0; i--) {
			var item = arr[i];
			if (item.lifeType != BattleConst.LIFE_JIDI) {
				item.doDiedLogical();
			}
		}
		//重新创建基地
		this.refreshControler.createMyHome();
		//把基地血量按百分比恢复
		this.myHome.setMyHp(Math.ceil(this.myHome.hp * GlobalParamsFunc.instance.getDataNum("battleResurrectionEnergy") / 10000));
		this.myHome.setUnmatchState();
		//回满能量
		this.battleUI.nowEnergy = this.battleUI.maxEnergy;
		//重置倒计时
		if (this.refreshControler.leftFrame != -1) {
			this.refreshControler.resetGameLeftTime();
		}

	}

	//处理事件
	public recvMsg(cmd: string): void {
		switch (cmd) {
			case BattleEvent.BATTLEEVENT_CONTINUE_BATTLE:
				this.setGamePlayOrPause(false);
				break;
			case BattleEvent.BATTLEEVENT_PAUSE_BATTLE:
				this.setGamePlayOrPause(true);
				break;

		}
	}


	//销毁游戏
	dispose() {
		BattleLogsManager.battleEcho("退出战斗----");
		Laya.timer.clear(this, this.onceUpdateFrame);
		this.tweenControler.dispose();
		this.statistControler.startSendStatistics();
		//销毁所有对象 
		this.destoryInstanceArr(this._allInstanceArr);
		//清空延迟回调
		this._timeList.length = 0;
		this.campArr_1.length = 0;
		this.campArr_2.length = 0;
		this.diedArr_1.length = 0;
		this.diedArr_2.length = 0;
		this._allInstanceArr.length = 0;
		this.tweenControler.dispose()
		this.cameraControler = null;
		this.refreshControler && this.refreshControler.dispose();
		this.layerControler.dispose();
		this.layerControler = null;
		this.mapControler.dispose();
		this.mapControler = null;
		this.player = null;
		super.dispose();
		Message.instance.removeObjEvents(this);
		BattleFunc.CreateRoleIndex = {}

	}



}