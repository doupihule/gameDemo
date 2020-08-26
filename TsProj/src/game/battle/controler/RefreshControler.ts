import BattleLogicalControler from "./BattleLogicalControler";
import BattleFunc from "../../sys/func/BattleFunc";
import IMessage from "../../sys/interfaces/IMessage";
import BattleConst from "../../sys/consts/BattleConst";
import Message from "../../../framework/common/Message";
import InstanceLogical from "../instance/InstanceLogical";
import WindowManager from "../../../framework/manager/WindowManager";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import InstanceLife from "../instance/InstanceLife";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";
import RolesModel from "../../sys/model/RolesModel";
import ConditionTrigger from "../trigger/ConditionTrigger";
import FogEventData from "../../fog/data/FogEventData";
import FogFunc from "../../sys/func/FogFunc";
import FogConst from "../../sys/consts/FogConst";
import FogModel from "../../sys/model/FogModel";
import RolesFunc from "../../sys/func/RolesFunc";
import FogPropTrigger from "../../fog/trigger/FogPropTrigger";
import TableUtils from "../../../framework/utils/TableUtils";
import StatisticsManager from "../../sys/manager/StatisticsManager";
import KariqiShareManager from "../../../framework/manager/KariqiShareManager";
import KariquShareConst from "../../../framework/consts/KariquShareConst";
import Client from "../../../framework/common/kakura/Client";
import UserModel from "../../sys/model/UserModel";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../sys/func/ShareTvOrderFunc";
import GameConsts from "../../sys/consts/GameConsts";

/**
 * 刷新控制器
 * 控制刷怪逻辑 以及接受事件变化更新角色属性
 *
 */
export default class RefreshControler implements IMessage {
	private controler: BattleLogicalControler;
	//当前波次
	public currentWave: number = 0;
	public maxWave: number = 0;  //最大波次
	public levelWaveCfg: any;

	//当前波次总血量
	public waveTotalHp: number = 0;
	//当前波次剩余血量
	public waveLeftHp: number = 0;

	//扩展的刷怪权重
	public expandWeightMap: any = {}
	//额外刷怪参数概率 额外刷怪:怪物ID,概率,坐标;怪物ID，概率，坐标;
	public extraMonsterInfo: any[];


	//游戏结果 0未出结果  1胜利 2 失败
	public battleResult: number = 0;

	//当前迷雾街区层数
	public currentLayer: number = 0;

	//波次信息
	/**
	 * {
	 *     id: waveid
	 *      frame: 剩余时间
	 *     monsterInfo;
	 * }
	 *
	 */
		//当前关卡
	public level: number = 0;

	//怪物等级
	public monsterLevel: number = 1;

	//章节
	public chapter: number = 1;

	public currentwaveInfo: any;
	private levelInfo;

	//剩余时间
	public leftFrame: number = -1;
	public batteTotalFrame: number = -1
	//  本波次怪物列表(怪物id,怪物移动路径,延时毫秒;)
	public currentMonsterInfo: any;

	//波次id数组
	private _waveIdArr;

	public currentFormationMap: any;

	private addEnergeTime = 60;
	public enemyTab = {};
	//迷雾街区怪物id
	private fogMonsterId: string = "";

	constructor(controler) {
		this.enemyTab = {};
		this.controler = controler;
		this.addEnergeTime = this.controler.battleUI.recoverPer;
	}

	/**初始化远征战斗 */
	public initWarData() {
		this.currentLayer = FogModel.instance.getCurLayer();
		this.battleResult = BattleConst.battleResult_none;
		var event: FogEventData = FogFunc.enemyCell.eventData;
		var enemyInfo = FogFunc.instance.getCfgDatas("Enemy", event.params[0]);
		this.fogMonsterId = enemyInfo.id;
		var ai = event.ai;
		var list = FogFunc.instance.getCfgDatasByKey("Ai", ai, "powerRange")
		var aiList = [];
		TableUtils.deepCopy(list, aiList);
		var result = [];
		var role;
		var enemyHomeId;
		var enemyHomeLevel;
		var enemyType = event.enemyType
		if (enemyType == FogConst.FOG_EVENT_ENEMY_TYPE_PLAYER) {
			role = FogModel.instance.getEnemyInfoById(event.enemyId).roles
			for (var key in role) {
				//不在阵上说明是基地 不在阵上并且配表里有这个角色
				if (!role[key].inLine && BattleFunc.instance.getCfgDatas("Role", key, true)) {
					enemyHomeId = key;
					enemyHomeLevel = role[key].level
					break;
				}
			}
		} else {
			var waveData = FogFunc.instance.getCfgDatas("NpcArray", event.enemyId);
			var waveMap = waveData.waveMap;
			//先把敌人数据存到table里，方便后续查找
			for (var i = 0; i < waveMap.length; i++) {
				var item = waveMap[i];
				this.enemyTab[item[0]] = item;
			}
			role = this.enemyTab;
			enemyHomeId = waveData.enemyHomeId[0];
			enemyHomeLevel = waveData.enemyHomeId[1]
		}
		if (!enemyHomeId) {
			enemyHomeId = GlobalParamsFunc.instance.getDataNum("bornHomeId")
			enemyHomeLevel = 1
		}
		//创建敌方基地
		this.controler.enemyHome = this.controler.createHome(enemyHomeId, {level: enemyHomeLevel}, BattleConst.LIFE_JIDI, BattleConst.ROLEGROUP_ENEMY);
		//把ai表里我的角色数据存起来
		for (var i = 0; i < aiList.length; i++) {
			var item = aiList[i];
			if (role[item[0]]) {
				result.push(item);
			}
		}
		//把结果按排序顺序从小到大排
		result.sort(this.sortPaixu);
		//算每个角色的当前优先级值
		for (var i = 0; i < result.length; i++) {
			result[i][2] = Number(result[i][2])
			if (i != 0) {
				result[i][2] += Number(result[i - 1][2])
			}
		}
		//优先级从大到小排序
		result.sort(this.sortYouxianji);
		//敌人能量=配置能量+当前层数*配置能量万分比/10000
		var energy = Math.floor(enemyInfo.energy[0] + FogModel.instance.getCurLayer() * (enemyInfo.energy[1]) / 10000)
		var level;
		var starLevel;
		var equip;
		var roleInfo;
		var playerEnemy
		while (result.length > 0) {
			var curInfo = result[0];
			var id = curInfo[0];
			roleInfo = RolesFunc.instance.getCfgDatas("Role", id);
			//如果当前总能量小于角色出兵的能量，把这个兵从列表删掉
			if (!roleInfo || energy < roleInfo.payEnergyNmb) {
				result.splice(0, 1);
				continue;
			}
			energy -= roleInfo.payEnergyNmb
			playerEnemy = role[id];
			//玩家类型的敌人数据直接取存储在模块下的
			if (enemyType == FogConst.FOG_EVENT_ENEMY_TYPE_PLAYER) {
				level = playerEnemy.level || 1;
				starLevel = playerEnemy.starLevel || 0;
				equip = playerEnemy.equip || {};
			} else {
				//npc类型的敌人，去NPCArray下的敌人数据，playerEnemy[3]有说明有装备，把装备存起来
				level = playerEnemy[1];
				starLevel = playerEnemy[2];
				if (playerEnemy[3]) {
					equip = {}
					for (var i = 3; i < playerEnemy.length; i++) {
						equip[playerEnemy[i]] = 1
					}
				}
			}
			var num = roleInfo.heroNub || 1;
			var offestX = 0;
			for (var j = 0; j < num; j++) {
				if (j != 0) {
					offestX = roleInfo.startSite[j];
				}
				this.controler.createRole(id, {
					level: level,
					starLevel: starLevel,
					equip: equip,
					passivSkill: enemyInfo.passivSkill
				}, roleInfo.kind, BattleConst.ROLEGROUP_ENEMY, offestX);
			}
			//重算当前的优先级
			result[0][2] -= Number(result[0][3]);
			//优先级从大到小排序
			result.sort(this.sortYouxianji);
		}
		this.addHelpRole();
		StatisticsManager.ins.onEvent(StatisticsManager.FOG_BATTLE_START, {enemyId: event.enemyData.id})

	}

	sortPaixu(a, b) {
		return a[1] - b[1];
	}

	sortYouxianji(a, b) {
		return b[2] - a[2];
	}

	//加助阵角色
	addHelpRole() {
		FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_AddRoleHelp, this.controler)
	}

	//创建我方基地
	public createMyHome() {
		var homeId = GlobalParamsFunc.instance.getDataNum("bornHomeId");
		var trueHome = homeId
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			homeId = GlobalParamsFunc.instance.getDataNum("fogHomeId");
		}
		this.controler.myHome = this.controler.createHome(homeId, {level: RolesModel.instance.getRoleLevelById(trueHome)}, BattleConst.LIFE_JIDI, BattleConst.ROLEGROUP_MYSELF);
	}

	//初始化数据
	public initData() {
		this.battleResult = BattleConst.battleResult_none;
		this._waveIdArr = [];
		this.createMyHome();
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			this.initNormalData();
			if (Number(this.controler.levelCfgData.levelId) == UserModel.instance.getMaxBattleLevel() + 1) {
				KariqiShareManager.sendNewLevel({guanqia: this.getKariqiLevelId()});
			}
			KariqiShareManager.onEvent(KariquShareConst.KARIQU_LEVELSTART, {}, this.getKariqiLevelId());
		} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			this.initWarData();
			FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_AddBattlePassive, this.controler)
			KariqiShareManager.onEvent("fogLevelStart", {level: this.getKariqiLevelId()});
		}
		KariqiShareManager.onEvent(KariquShareConst.KARIQU_STARTGAME);

	}

	/**初始化普通战斗 */
	initNormalData() {
		this.initLevelData(this.controler.levelCfgData.levelId);
		//让刷怪控制器开始刷怪
		this.enterTargetWave(1);
	}

	//进入目标wave
	public enterTargetWave(waveIndex) {
		//设置为没有出结果状态
		this.battleResult = BattleConst.battleResult_none;
		this.currentWave = waveIndex;
		var waveInfo = this._waveIdArr[waveIndex - 1].split(",");
		var enterTime = BattleFunc.instance.turnMinisecondToframe(waveInfo[1]);
		this.controler.setCallBack(enterTime, this.enterWave, this, waveInfo[0])
		BattleLogsManager.battleEcho("进入波次:", waveIndex, "延迟", waveInfo[1]);

		//初始化开战 一些技能的被动效果
		ConditionTrigger.onOpportunityByArr(ConditionTrigger.opportunity_startBattle, this.controler.campArr_2);
		ConditionTrigger.onOpportunityByArr(ConditionTrigger.opportunity_startBattle, this.controler.campArr_1);
		ConditionTrigger.onOpportunityByArr(ConditionTrigger.opportunity_refreshMonster, this.controler.campArr_1);
		ConditionTrigger.onOpportunityByArr(ConditionTrigger.opportunity_refreshMonster, this.controler.campArr_2);


		// this.controler.battleUI.updateWave(this.currentWave, this.maxWave);
		// this.controler.battleUI.updateBlood(this.waveLeftHp, this.waveTotalHp);
		// this.controler.battleUI.updateGameTime(this.leftFrame, this.batteTotalFrame);

	}

	enterWave(waveId) {
		var monsterArr = BattleFunc.instance.getCfgDatasByKey("LevelWave", waveId, "waveMap");
		//创建小怪
		var showTime = 0;
		var equip;
		for (var i = 0; i < monsterArr.length; i++) {
			var info = monsterArr[i].split(",");
			var id = info[0];
			showTime += Number(info[1]);
			var level = Number(info[2]);
			var starLevel = Number(info[3]) || 0;
			var roleInfo = BattleFunc.instance.getCfgDatas("Role", id);
			var num = roleInfo.heroNub || 1;
			var datas = {
				waveAllEnemy: monsterArr.length - 1,
				index: i,
				id: id,
				data: {
					level: level,
					starLevel: starLevel
				},
				lifeType: roleInfo.kind,
				camp: BattleConst.ROLEGROUP_ENEMY
			}
			if (info[4]) {
				equip = {}
				for (var k = 4; k < info.length; k++) {
					equip[info[k]] = 1
				}
				datas["data"]["equip"] = equip
			}
			for (var j = 0; j < num; j++) {
				var itemData = {
					data: datas,
					index: j,
				}
				if (num > 1) {
					itemData["offestX"] = roleInfo.startSite[j];

				}
				this.controler.setCallBack(BattleFunc.instance.turnMinisecondToframe(showTime), this.initWaveEnemy, this, itemData)
			}
		}
	}

	initWaveEnemy(info) {
		if (this.controler && this.controler.isGameOver) return;
		var data = info.data;
		this.controler.createRole(data.id, data.data, data.lifeType, data.camp, info.offestX)
		//是当前波次的最后一个敌人
		if (data.waveAllEnemy == data.index && info.index == 0) {
			//如果当前是最后一波了，重新回到第一波
			if (this.currentWave == this.maxWave) {
				this.currentWave = 0;
			}
			this.enterTargetWave(this.currentWave + 1);
		}
	}

	//初始化关卡数据
	private initLevelData(level: number) {
		//进入下一波
		this.level = Number(level);
		this.levelInfo = BattleFunc.instance.getCfgDatas("Level", String(level));
		this._waveIdArr = this.levelInfo.levelWave;
		this.maxWave = this._waveIdArr.length;
		this.resetGameLeftTime();
		var enemyInfo = this.levelInfo.enemyHomeId;
		this.controler.enemyHome = this.controler.createHome(enemyInfo[0], {level: Number(enemyInfo[1])}, BattleConst.LIFE_JIDI, BattleConst.ROLEGROUP_ENEMY);
	}

	//重置战斗时间
	public resetGameLeftTime() {
		//新手引导第一关没有时间限制
		if (UserModel.instance.getMaxBattleLevel() <= 0) {
			this.leftFrame = -1;
			return;
		}
		// this.leftFrame = BattleFunc.instance.turnMinisecondToframe(3000)
		this.leftFrame = BattleFunc.instance.turnMinisecondToframe(this.levelInfo.maxTime)
	}

	//当敌人死光了的时候
	public onMonsterAllDied(monster: InstanceLife) {
		this.onGameOver(BattleConst.battleResult_win);
	}


	//有人复活了 通知对面阵营的人 是否要检测ai了
	public oneRoleRelive(role: any) {
		var arr: InstanceLogical[] = role.toCampArr;
		if (role.campArr.length == 1) {
			for (var i = 0; i < arr.length; i++) {
				arr[i].checkMoveOrAttack(true);
			}
		}
	}

	//刷新函数
	public updateFrame() {
		this.updateBattleEnergy();
		this.updateBattleLeftTime()

	}

	updateBattleLeftTime() {
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL && !this.controler.inOverTimeRevive && this.leftFrame != -1) {

			if (this.leftFrame % GameConsts.gameFrameRate == 0) {
				this.controler.battleUI.showLeftTxt(this.leftFrame)
			}
			if (this.leftFrame <= 0) {
				this.leftFrame = -1;
				this.checkOverTimeLose();
				return;
			}
			this.leftFrame -= 1;

		}
	}

	updateBattleEnergy() {
		if (this.addEnergeTime > 0) {
			this.addEnergeTime--;
			return;
		}
		this.addEnergeTime = this.controler.battleUI.recoverPer;
		this.controler.battleUI.autoAddEnergy();
	}

	//超时失败
	public checkOverTimeLose() {
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL && !this.controler.inOverTimeRevive && ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLEREVIVE_OVERTIME) != ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.controler.showBattleRevive(BattleConst.REVIVETYPE_OVERTIME);
			return;
		}
		this.showGameLose();
	}

	//战斗失败
	public checkGameLose() {
		//判断是否可以复活
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR && !this.controler.reviveCount && ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLEFOG_REVIVE) != ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.controler.showFogRevive();
			return;
		}
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL && !this.controler.inDefeatRevive && ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLEREVIVE_DEFEAT) != ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.controler.showBattleRevive(BattleConst.REVIVETYPE_DEFEAT);
			return;
		}
		this.showGameLose();
	}

	public showGameLose() {
		this.onGameOver(BattleConst.battleResult_lose);
	}

	//升级回来
	public onUpLevelBack() {


	}

	//关卡结束时让我方所有人站立.
	private onGameOver(rt: number) {
		if (this.battleResult != BattleConst.battleResult_none) {
			return;
		}

		KariqiShareManager.onEvent(KariquShareConst.KARIQU_RESULT);
		this.controler.isGameOver = true;
		var campArr = this.controler.campArr_1;
		for (var i = 0; i < campArr.length; i++) {
			campArr[i].initStand();
			campArr[i].resumeIdleAction()
		}
		campArr = this.controler.campArr_2;
		for (var i = 0; i < campArr.length; i++) {
			campArr[i].initStand();
			campArr[i].resumeIdleAction()
		}
		this.battleResult = rt
		if (this.controler.passive) {
			this.controler.clearOnePassiveAttr(this.controler.passive);
			this.controler.passive = null;
		}
		var levelCostTime = Client.instance.serverTime - this.controler.startTime;
		if (rt == BattleConst.battleResult_lose) {
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
				KariqiShareManager.onEvent(KariquShareConst.KARIQU_GAMEFAIL, {"time": levelCostTime}, this.getKariqiLevelId());
			} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
				KariqiShareManager.onEvent("fogLevelFail", {"level": this.getKariqiLevelId()});
			}

			this.controler.setCallBack(120, () => {
				WindowManager.OpenUI(WindowCfgs.BattleResultUI, {
					levelId: this.level,
					isWin: false,
					controler: this.controler
				})
			}, this)
		} else {
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
				KariqiShareManager.onEvent(KariquShareConst.KARIQU_GAMESUCESS, {"time": levelCostTime}, this.getKariqiLevelId());
			} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
				KariqiShareManager.onEvent("fogLevelSuccess", {"level": this.getKariqiLevelId()});
			}


			this.controler.setCallBack(120, () => {
				WindowManager.OpenUI(WindowCfgs.BattleResultUI, {
					levelId: this.level,
					isWin: true,
					controler: this.controler
				})
			}, this)
		}
	}


	//立即复活所有的英雄
	private reliveAllHeros() {
		var diedArr = this.controler.diedArr_1;
		var campArr = this.controler.campArr_1;
		for (var i = 0; i < campArr.length; i++) {
			//让所有人满血
			var role = campArr[i];
			role.changeHp(role.maxHp - role.hp);
		}
		for (var i = diedArr.length - 1; i >= 0; i--) {
			var role = diedArr[i];
			role.doRelive(role.maxHp, null);
		}
	}

	//重新开始这一关
	public restartLevel() {
		//销毁所有敌人
		this.controler.destoryInstanceArr(this.controler.campArr_2);
		this.controler.destoryInstanceArr(this.controler.diedArr_2);
		//重新开始
		this.onUpLevelBack();
	}


	//改变敌人总血量
	public changeWaveHp(value) {
		this.waveLeftHp += value;
		this.controler.battleUI.updateBlood(this.waveLeftHp, this.waveTotalHp);
	}

	//设置一个阵位额外刷怪概率
	public setFormationWeight(formation: number, changeValue: number) {
		// var defValue = this.expandWeightMap[formation];
		// if (defValue == null) {
		//     this.expandWeightMap[formation] = 0;
		//     defValue = 0;
		// }
		// defValue += changeValue;
		// if (defValue < 0) {
		//     defValue = 0;
		// }
		// this.expandWeightMap[defValue];
	}


	private getKariqiLevelId() {
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			return Number(this.controler.levelCfgData.levelId)
		} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			return Number(this.fogMonsterId);
		}
		return 0
	}


	//接受事件
	public recvMsg(msg: string, data: any) {
	}


	public dispose() {
		//一定要注意移除事件
		Message.instance.removeObjEvents(this);
		this.controler = null;
	}


}