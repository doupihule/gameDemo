import BattleConst from "../../sys/consts/BattleConst";
import BattleSkillData from "../data/BattleSkillData";
import BattleFunc from "../../sys/func/BattleFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import PoolCode from "../../sys/consts/PoolCode";
import PoolTools from "../../../framework/utils/PoolTools";
import PassiveSkillData from "../data/PassiveSkillData";
import InstancePerformance from "./InstancePerformance";
import BuffTrigger from "../trigger/BuffTrigger";
import BattleBuffData from "../data/BattleBuffData";
import TableUtils from "../../../framework/utils/TableUtils";
import InstanceLogical from "./InstanceLogical";
import SkillActionData from "../data/SkillActionData";
import ConditionTrigger from "../trigger/ConditionTrigger";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import AttributeExtendData from "../data/AttributeExtendData";
import UserModel from "../../sys/model/UserModel";
import BattleDebugTool from "../controler/BattleDebugTool";
import SkillExpandTrigger from "../trigger/SkillExpandTrigger";
import GameConsts from "../../sys/consts/GameConsts";
import ResourceConst from "../../sys/consts/ResourceConst";
import RoleBuffBar from "../view/RoleBuffBar";
import RolesFunc from "../../sys/func/RolesFunc";
import InstanceMove from "./InstanceMove";
import ImageExpand from "../../../framework/components/ImageExpand";

// 活物.带生命交互的基类  具备攻防血buff等基类
export default class InstanceLife extends InstancePerformance {

	//阵营
	public camp: number = 1;
	public toCamp: number = 2;
	public campArr: any[];
	public toCampArr: any[];

	public diedArr: any[];
	public toDiedArr: any[];

	//阵位
	public formationId: string;
	//定位 1前排.2后排
	public posType: number;
	//属性数据 用他来存储攻防暴闪等信息
	public attrData: AttributeExtendData;

	public hp: number = 50;    //当前血量
	//血量比 当前血量/总血量
	public hpPercent = 1;
	public level = 1;
	public starLevel = 0;
	private passSkillArr = null;
	private normalSkillArr = null;

	//最大血量
	public get maxHp() {
		return this.attrData.getOneAttr(BattleConst.attr_maxHp);
	}


	//当前能量值
	public energy: number = 0;
	public energyResumeValue: number = 0;  //每秒恢复的能量数
	public killResumeEnergy: number = 0;  //击杀回复能量
	public maxEnergy: number = 0;   //最大能量


	public battleKeepDis: number = 0;     //战斗保持距离


	//是否是自动释放技能
	public isAutoSKill: boolean = false;
	//主动技能数组
	public normalSkills: BattleSkillData[];
	//被动技能数组
	public passiveSkills: PassiveSkillData[];
	//能量技能
	public energySkill: BattleSkillData;
	//黑屏时间
	public blackFrame: number = 0;
	//当前小技能的序号
	public currentSkillIndex: number = 0;
	//当前正在释放的技能;
	public currentSkill: BattleSkillData;
	//技能播放玩后的等待时间
	public skillWaitFrame: number = 0;


	//护盾数组, [{value:护盾值, buff:护盾的buff对象 }]
	public shieldInfoArr: any[];

	//嘲讽目标
	/**
	 * target: 嘲讽目标
	 * buff:被作用的buff对象
	 */
	public beTauntTargetInfo: any;


	//按照逻辑效果存储{logicalType:[buffData,..]} . 加属性的buff 把属性效果单拿出去.buff对象还是统一管理.因为涉及到cd特效管理等
	public buffInfo: any;

	//标记当前拥有的无敌buff次数. 如果大于0表示无敌状态
	public invincibleNum: number = 0;
	//控制类型的buffbit 用来做控制判断的
	public ctrlBuffBit: number = 0;

	//加属性的buff数组. [ {buff:buffObj,attrMap:{[1]:[10,10]}}   ] ;是为了在清除buff的时候 把对应的属性扣回去.
	public buffAttrInfo: any[];

	//buff区域
	public buffBar: RoleBuffBar;


	//临时变量 用来做一些排序用的
	public tempSortValue: any;
	//临时筛选优先级 0是最高优先级
	public tempSortPriority: number = 0;

	//临时被作用变量.  伤害结果,伤害值,攻击者
	public tempBeUsedValue: any;

	//临时作用变量 针对攻击者.  伤害结果,伤害值,防御者
	public tempUseValue: any;
	//上一次的攻击者
	public lastAttacker: InstanceLife;
	/**地面建筑检测时间 */
	public buildCheckFrame = 30;
	/**减血量 */
	public reduceBlood = 1;
	//角色类型
	public roleType;

	/**在小地图的小红点/小蓝点 */
	mapPoint: ImageExpand;

	constructor(controler) {

		super(controler);
		this.shieldInfoArr = []
		this.tempBeUsedValue = []
		this.tempUseValue = []
		this.beTauntTargetInfo = {}
		this.passSkillArr = null;
		this.normalSkillArr = null;
		//拿到筛选器.方便访问和调用

	}


	//-------------------------初始化相关-------------------------------------------------------

	//设置数据
	public setData(data: any) {
		super.setData(data);
		this.initStand();
		this.invincibleNum = 0;
		this.shieldInfoArr.length = 0;
		this.energy = 0;
		this.diedState = 0;
		this.shadeOffestX = 0;
		// 初始化控制bit
		this.ctrlBuffBit = 0;
		this.buffInfo = {};
		//属性buff
		this.buffAttrInfo = [];
		//初始化清空被嘲讽目标
		this.beTauntTargetInfo.target = null
		this.beTauntTargetInfo.buff = null
		this.passSkillArr = null;
		this.normalSkillArr = null;
		if (this.movePointType != InstanceMove.moveType_none) {
			this.movePointType = InstanceMove.moveType_none
		}
		if (this.lifeType != BattleConst.LIFE_PLAYER) {
			this.roleType = data.type;
			this.level = data.level;
			this.starLevel = data.starLevel;
			this.cfgData = BattleFunc.instance.getCfgDatasByKey("RoleUpdate", this.dataId, data.level);
			this.initSkillData();
			//存储自己的属性 初始化不需要算属性
			if (!this.attrData) {
				data.passiveSkills = this.passSkillArr;
				this.attrData = new AttributeExtendData(this.dataId, data, this.lifeType, UserModel.instance.getData(), this.controler.globalAttrMap);
			} else {
				this._data.passiveSkills = this.passSkillArr
				//这里需要完全重置数据
				this.attrData.resetData(this.dataId, this._data, this.lifeType, UserModel.instance.getData(), this.controler.globalAttrMap);
			}
			this.hp = this.maxHp;
			var baseData = BattleFunc.instance.getCfgDatas("Role", this.dataId)
			if (baseData.scale) {
				this.cfgScale = baseData.scale / 10000;
			}
			this.mass = baseData.weight || 1;
			this.battleKeepDis = baseData.battleDis || 100;
			//播放idle动画
			this.playAction(BattleConst.LABEL_IDLE, true);
			if (this.cfgData.expand) {
				SkillExpandTrigger.onCheckExpand(this as any, null, this.cfgData.expand, null);
			}
			this.realSize[0] = this.cfgData.size[0] * this.cfgScale;
			this.realSize[1] = this.cfgData.size[1] * this.cfgScale;
		} else {
			this.attrData = this.controler.myHome.attrData;
		}


	}

	/**重新设置当前血量 防止有加减血量的被动，改变初始值
	 * 若有初始不满血量的需求 此处需改动
	 */
	public resetHp() {
		this.hp = this.maxHp;
	}

	//战斗中的移动速度  //暂定写死2像素/帧
	public get walkSpeed() {
		return this.attrData.getOneAttr(BattleConst.attr_speed) / GameConsts.gameFrameRate
	}

	//初始化技能数据
	protected initSkillData() {
		var thisObj: any = this;
		var passCfg = this.getPassiveSkills();
		this.passiveSkills = [];
		//被动技
		if (passCfg) {
			for (var i = 0; i < passCfg.length; i++) {
				var info = passCfg[i];
				var skillId: string;
				//
				var level: number = 1;
				skillId = String(info);

				var debugPassiveSkillData: any = BattleDebugTool.getDebugPassiveSkill();
				if (debugPassiveSkillData) {
					var passive: PassiveSkillData = new PassiveSkillData(debugPassiveSkillData[0], Number(debugPassiveSkillData[1]) || 1, thisObj, BattleConst.skill_kind_passive);
					this.passiveSkills.push(passive);
					break;
				}
				var passive: PassiveSkillData = new PassiveSkillData(skillId, level, thisObj, BattleConst.skill_kind_passive);
				this.passiveSkills.push(passive);
			}
		}
		//先初始化被动，因为我的普通技能可能被改变
		this.initNormalSkill(thisObj);
		//大招
		if (this.cfgData.energySkill && this.cfgData.energyParams) {
			var level: number;
			level = 1;
			this.energySkill = this.controler.createSkillData(this.cfgData.energySkill, level, thisObj, BattleConst.skill_kind_energy);
			this.maxEnergy = this.cfgData.energyParams[1];
			this.energyResumeValue = this.cfgData.energyParams[0];
			//黑屏时间
			this.blackFrame = Math.floor(this.cfgData.energyParams[2] * BattleFunc.miniSecondToFrame);
			//击杀回复能量
			this.killResumeEnergy = this.cfgData.energyParams[3] || 0;
		}
	}

	/**初始化普通技能   基地技能不需要判断是否是isActive*/
	initNormalSkill(thisObj, lifeType = null) {
		this.currentSkillIndex = 0
		//初始化技能
		this.normalSkills = [];
		var normalCfg = this.getNormalSkills();
		var debugSkillData: any = BattleDebugTool.getDebugSkill();
		//小技能:技能ID,技能UI位置编号;技能ID,技能UI位置编号;
		for (var i = 0; i < normalCfg.length; i++) {
			var info = normalCfg[i];
			//@xd_dev 所以技能等级默认先给1.
			var level: number = 1
			var skillId: string;
			var skill: BattleSkillData;
			skillId = String(info);
			//如果是调试技能的
			if (debugSkillData) {
				skill = this.controler.createSkillData(debugSkillData[0], Number(debugSkillData[1]) || 1, thisObj, BattleConst.skill_kind_noraml, lifeType);
				this.normalSkills.push(skill);
				break;
			} else {
				//技能组最后一个是普攻击
				if (i == normalCfg.length - 1) {
					if (level == 0) {
						level = 1
					}
					;
					//普攻是拥有的
					skill = this.controler.createSkillData(skillId, level, thisObj, BattleConst.skill_kind_noraml, lifeType);
				} else {
					skill = this.controler.createSkillData(skillId, level, thisObj, BattleConst.skill_kind_small, lifeType);
				}
			}

			if (this.lifeType == BattleConst.LIFE_PLAYER) {
				skill.leftSkillCd = this.getSkillLeftCd(skill);
			}
			this.normalSkills.push(skill);
		}
	}

	public getSkillLeftCd(skill) {
		var skillSpeedValue = this.getSkillSpeedUpValue(skill._skillId);
		//超级武器技能没有cd 根据能量判定
		//技能提速
		return Math.round(skill.skillInitCd / skillSpeedValue);
	}

	//获取普通技
	protected getNormalSkills() {
		if (this.normalSkillArr) {
			return this.normalSkillArr;
		}
		return this.cfgData.skill;

	}

	// 获取被动技
	protected getPassiveSkills() {
		if (!this.passSkillArr) {
			this.passSkillArr = [];
			if (this.lifeType == BattleConst.LIFE_JIDI) return this.passSkillArr;

			var basePassive = this.cfgData.passiveSkill;
			if (basePassive && basePassive.length > 0) {
				for (var s = 0; s < basePassive.length; s++) {
					this.passSkillArr.push(basePassive[s]);
				}
			}

			//基地没有被动
			var allInfo = RolesFunc.instance.getCfgDatas("RoleStar", this.dataId);
			for (var key in allInfo) {
				if (allInfo.hasOwnProperty(key)) {
					var item = allInfo[key];
					if (this.starLevel >= item.star && item.passiveSkill) {
						for (var i = 0; i < item.passiveSkill.length; i++) {
							this.passSkillArr.push(item.passiveSkill[i]);
						}
					}
				}
			}
		}
		this.getLastNormalAndPassSkill();
		return this.passSkillArr;
	}

	/**获取最终的普通技能和被动技能 */
	getLastNormalAndPassSkill() {
		if (this.passSkillArr.length == 0) return;
		var eff;
		var changeSkill;
		var firstID;
		var secondID;
		var skillType;
		var tempArr = BattleFunc.getOneTempArr();
		tempArr = TableUtils.copyOneArr(this.passSkillArr, tempArr);
		this.normalSkillArr = TableUtils.copyOneArr(this.cfgData.skill);
		for (var i = 0; i < tempArr.length; i++) {
			var item = tempArr[i];
			var data = BattleFunc.instance.getCfgDatas("PassiveSkill", item);
			//判断是否有改变角色技能的被动
			if (data.effectType == BattleConst.passive_effect_changeSkill) {
				eff = data.effectParams
				for (var j = 0; j < eff.length; j++) {
					changeSkill = eff[j];
					firstID = Number(changeSkill[0]);
					secondID = Number(changeSkill[1]);
					skillType = Number(changeSkill[2]);
					if (skillType == BattleConst.skillType_passive) {
						var passIndex = this.passSkillArr.indexOf(firstID);
						if (passIndex != -1) {
							this.passSkillArr[passIndex] = secondID;
						}
					} else if (skillType == BattleConst.skillType_normal) {
						var normalIndex = this.normalSkillArr.indexOf(firstID);
						if (normalIndex != -1) {
							this.normalSkillArr[normalIndex] = secondID;
						}
					}
				}
			}
		}
		BattleFunc.cacheOneTempArr(tempArr);

	}

	//重置属性
	public resetProperty() {
		this.label = null;
		super.resetProperty();
	}

	/**设置角色类型 1地面小兵 2空中小兵 3地面建筑 4基地 */
	public setLifeType(type) {
		this.lifeType = type;
		if (this.lifeType == BattleConst.LIFE_LANDBUILD) {
			this.buildCheckFrame = BattleFunc.buildAutoFrame;
			this.reduceBlood = this.maxHp * BattleFunc.buildingAutoReduceHp / 10000;
		}
		this.initPointOnSmallMap();
		if (this.camp == BattleConst.ROLEGROUP_MYSELF && (this.lifeType == BattleConst.LIFE_LANDHERO || this.lifeType == BattleConst.LIFE_LANDBUILD)) {
			this.showBornAni()
		}
	}

	//设置阵营
	public setCamp(value) {
		this.camp = value;
		if (value == 1) {
			this.toCamp = 2;
			this.campArr = this.controler.campArr_1;
			this.toCampArr = this.controler.campArr_2;
			this.diedArr = this.controler.diedArr_1;
		} else {
			this.toCamp = 1;
			this.campArr = this.controler.campArr_2;
			this.toCampArr = this.controler.campArr_1;
			this.diedArr = this.controler.diedArr_2;
		}
		if (this.lifeType != BattleConst.LIFE_PLAYER) {
			//创建影子
			this.createShade();
			if (this.lifeType == BattleConst.LIFE_JIDI) {
				this.shadeOffestX = this.realSize[0] / 2 - 50
			}
			if (this.camp == 1) {
				this.shadeOffestX = -this.shadeOffestX;
			}
		}

	}


	//改变能量值
	public changeEnergy(value) {
		this.energy += value;
		if (this.energy < 0) {
			this.energy = 0;
		} else if (this.energy > this.maxEnergy) {
			this.energy = this.maxEnergy;
		}

	}

	//改变血量
	public changeHp(value: number) {
		//战斗的新手引导中基地不掉血
		if (UserModel.instance.getMaxBattleLevel() <= 0 && this.lifeType == BattleConst.LIFE_JIDI && this.camp == BattleConst.ROLEGROUP_MYSELF) return;
		if (value < 0) {
			var debugVale = BattleDebugTool.isInfiniteHp();
			if (debugVale) {
				var debugCamp = Number(debugVale[0]) || 0;
				//如果是全阵营 或者是我的阵营等于调试阵营的
				if (debugCamp == 0 || debugCamp == 3 || this.camp == debugCamp) {
					value = 1;
				}

			}
		}
		if (this.hp <= 0 && value > 0) {
			LogsManager.errorTag("hpError", "死亡的角色还在被治疗")
		}
		this.hp += value;

		var changeValue = value;
		if (this.hp <= 0) {
			value -= this.hp;
			this.hp = 0;
			//判断是否执行死亡函数
			this.doDiedLogical();
		} else if (this.hp > this.maxHp) {
			//如果超过最大生命.把多+的血扣除. 用来做血量统计
			value -= this.hp - this.maxHp
			this.hp = this.maxHp;
		}


		if (!this.hpBar) {
			LogsManager.errorTag("instanceError", "血条没了----")
		} else {
			//通知血条更新
			this.hpBar.onHpChange();
		}
		//敌方阵营需要同步血量
		if (this.camp == 2) {
			this.controler.refreshControler.changeWaveHp(value)
		}
	}


	//执行死亡逻辑
	public doDiedLogical() {
		this.hp = 0;
		//移除注册的所有回调
		this.controler.clearCallBack(this);
		this.diedState = BattleConst.DIED_STATE_ING;

		//清除所有的非永久性buff
		this.clearAllBuff()
		this.destroyPoint();
		//把我从对应的数组移除
		TableUtils.removeValue(this.campArr, this);
		this.diedArr.push(this);
		this.startDoDiedPerformance();
		//触发自己死亡时机
		var anythis: any = this;
		ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_onDied, anythis);
		if (this.camp == 2) {
			this.controler.statistControler.onKillRole(1);
		} else {
			this.controler.checkAllRolePos();
		}
		SkillExpandTrigger.skillExpand_6(null, null, [1, BattleFunc.diedShockCount], null)
		//如果我方阵营人都没了或者我方基地死了 游戏结束
		if (this.campArr.length == 0 || this.lifeType == BattleConst.LIFE_JIDI) {
			this.doResult();
			return;

		}
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			//我方复活赛中必须打爆基地才算游戏结束
			if (this.camp == 1 && this.controler.inFogReviveBattle) return;
			//远征模式只剩一个基地了，也判定游戏结束
			if (this.campArr.length == 1) {
				var item = this.campArr[0];
				if (item.lifeType == BattleConst.LIFE_JIDI) {
					this.doResult();
				}
			}
		}
	}

	doResult() {
		var toArr = this.toCampArr;
		for (var i = 0; i < toArr.length; i++) {
			var instance: InstanceLogical = toArr[i];
			instance.onToCampAllDied();
		}
		if (this.camp == 2) {
			this.controler.refreshControler.onMonsterAllDied(this);
		} else {
			this.controler.refreshControler.checkGameLose();
		}
	}


	//重写彻底死亡逻辑
	protected doEndDiedLogical() {
		super.doEndDiedLogical();
		var anythis: any = this;
		//如果执行被动后复活了 说明已经做了复活逻辑
		if (this.hp > 0) {
			return;
		}
		//从死亡数组移除
		TableUtils.removeValue(this.diedArr, this);
		if (this.camp == 2) {

			//销毁一个怪物
			this.controler.destoryMonster(anythis);
		} else {
			this.controler.destoryHero(anythis);
		}

	}


	//运动到一个点的时候
	public moveToOnePoint(x: number, y: number, z: number = 0, spd: number = 0, callFunc: any = null, thisObj: any = null, callParams = null, expandParams: any = null, movePointType: number = 1) {
		if (this.label == BattleConst.LABEL_IDLE) {
			this.playAction(BattleConst.LABEL_WALK, true);
		}

		super.moveToOnePoint(x, y, z, spd, callFunc, thisObj, callParams, expandParams, movePointType);
	}

	//到达目的地播放闲置动画
	public overFinalPoint() {
		this.playAction(BattleConst.LABEL_IDLE, true);
		super.overFinalPoint();
	}


	//移动坐标
	public movePos() {
		super.movePos();
		if (this._myState != BattleConst.state_stand) {
			this.controler.oneRoleMove(this);
			if (this.hpBar) {
				this.hpBar.followTarget();
			}
			if (this.mapPoint) {
				this.controler.battleUI.setSmallMapXByScreen(this.mapPoint, this.pos);
			}
			if (this.buffBar) {
				this.buffBar.followTarget();
			}
		}
	}


	//------------------------父类函数扩展------------------------------------------------

	//播放动画
	public playAction(label: string, loop: boolean, resumeIdle: boolean = true, force: boolean = false, start: number = 0, end: number = 0) {
		super.playAction(label, loop, resumeIdle, force, start, end);
		//切换动作需要重置动画播放速度
		if (this._myView) {
			this.setAniPlaySpeed(1);
		}

		if (label == BattleConst.LABEL_IDLE || label == BattleConst.LABEL_WALK || label == BattleConst.LABEL_DEAD) {
			//那么清空当前skill
			this.currentSkill = null;
		}
	}

	//还原闲置动作
	public resumeIdleAction() {
		//如果不是idle的 不能还原动作
		// this.playAction(BattleConst.LABEL_IDLE, true, false, true);
		if (this.currentSkill) {
			this.skillWaitFrame = Math.round(this.currentSkill.skillWaitFrame / this._aniPlaySpeed);
		}
		super.resumeIdleAction()
	}


	//-------------------------------buff相关----------------------------------------------------
	//-------------------------------buff相关----------------------------------------------------
	//-------------------------------buff相关----------------------------------------------------

	//插入一个普通buff
	public insterOneBuff(buff: BattleBuffData) {

		var anythis: any = this
		// //被作用着触发效果 每次buff的效果被作用时触发
		// ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_beUsedBuff,anythis,BattleFunc.emptyArr,buff.skillAction.skill, buff);
		// //施法者触发效果
		// ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_buffUsed,buff.onwer,BattleFunc.emptyArr,buff.skillAction.skill,buff);


		var logicalType = buff.logicType;
		var buffInfo = this.buffInfo;
		if (!buffInfo[logicalType]) {
			buffInfo[logicalType] = []
		}
		var buffbit = BuffTrigger.buffTypeToBit[logicalType]
		//对这个buffbit 按位取或
		if (buffbit) {
			this.ctrlBuffBit = this.ctrlBuffBit | buffbit;
		}
		buffInfo[logicalType].push(buff)
		super.insterOneBuff(buff);
		if (this.buffBar && this.buffBar.onBuffChange) {
			this.buffBar.onBuffChange(buff);
		}
		//根据buff触发时机等执行具体的buff效果
		//如果是生效一次的  立马执行
		if (buff.leftTimes == 1) {
			this.delayCheckBuff(buff);

		} else {
			this.controler.setLastCallBack(0, buff.interval, buff.leftTimes, this.delayCheckBuff, this, buff);
		}
		//到时记得清除buff
		if (buff.leftFrame > 0) {
			this.controler.setCallBack(buff.leftFrame, this.clearOneBuff, this, buff);
		}
		//获得buff后 触发
		ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_getbuff, anythis, BattleFunc.emptyArr, buff.skillAction.skill, buff);

	}

	//延迟检测buff
	protected delayCheckBuff(buffObj: BattleBuffData) {

		BuffTrigger.runOneBuffEffect(buffObj.onwer, this as any, buffObj.skillAction, buffObj);
	}


	//清理一个buff removeChance 清除时机
	public clearOneBuff(buff: BattleBuffData, removeChance: number = 1) {
		var anythis: any = this

		//移除完毕后继承父类的移除buff表现
		super.clearOneBuff(buff);
		var logicalType = buff.logicType;
		this.controler.clearCallBack(this, this.delayCheckBuff, buff);
		var buffInfo = this.buffInfo;
		if (!buffInfo[logicalType]) {
			buffInfo[logicalType] = []
		}
		var arr: any[] = buffInfo[logicalType];
		var removeResult: boolean = false
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr[i] == buff) {
				arr.splice(i, 1);
				removeResult = true;
				break;
				//移除buff对应的效果

			}
		}
		if (removeChance != BattleConst.buff_remove_diedClear) {
			if (arr.length == 0) {
				var buffbit = BuffTrigger.buffTypeToBit[logicalType]
				//对这个buffbit 按位取异或
				if (buffbit && this.ctrlBuffBit) {
					//必须包含这个buffbit的时候 才取异或.否则会出问题
					if (this.ctrlBuffBit & buffbit) {
						this.ctrlBuffBit = this.ctrlBuffBit ^ buffbit;
					} else {
						BattleLogsManager.battleWarn("xd buffbit错误:", this.ctrlBuffBit, buffbit, "buffid:", buff._id);
					}
				}
			}
		}

		//如果移除成功 执行清除buff效果. 比如 还原攻击力.还原状态
		if (removeResult) {
			BuffTrigger.onClearBuff(this as any, buff, removeChance);
		}


		//必须不是死亡时清除才触发 被作用着触发buff移除时机
		if (removeChance != BattleConst.buff_remove_diedClear && removeChance != BattleConst.buff_remove_cover) {
			ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_usedbuffRmoved, anythis, BattleFunc.emptyArr, buff.skillAction.skill, buff, removeChance);
			//施法者触发buff移除时机
			ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_ownerbuffRemoved, buff.onwer, BattleFunc.emptyArr, buff.skillAction.skill, buff, removeChance);
		}
		if (this.buffBar && this.buffBar.onBuffChange) {
			this.buffBar.onBuffChange(buff);
		}
	}

	//清除所有的负面buff
	public clearAllBuff() {
		for (var i in this.buffInfo) {
			var arr = this.buffInfo[i];
			if (arr && arr.length > 0) {
				for (var s = arr.length - 1; s >= 0; s--) {
					var buff: BattleBuffData = arr[s];
					//光环类的buff 不能清
					if (buff.leftFrame != -1) {
						this.clearOneBuff(arr[s], BattleConst.buff_remove_diedClear);
					}
				}
			}
		}


	}

	//清除控制类buff
	public clearControlBuff() {
		for (var i in this.buffInfo) {
			var arr = this.buffInfo[i];
			if (arr && arr.length > 0) {
				//必须是控制类型的buff才清除
				if (BuffTrigger.buffTypeToBit[Number(i)]) {
					for (var s = arr.length - 1; s >= 0; s--) {
						var buff: BattleBuffData = arr[s];
						//光环类的buff 不能清
						if (buff.leftFrame != -1) {
							this.clearOneBuff(arr[s]);
						}
					}
				}

			}
		}
	}


	//判断是否有某个logicalbuff
	public checkHasOneBuff(logicalType: number) {
		return this.buffInfo[logicalType] && this.buffInfo[logicalType].length > 0;
	}

	//根据buffid判断
	public getBuffById(buffId: string) {
		for (var i in this.buffInfo) {
			var tempArr: BattleBuffData[] = this.buffInfo[i]
			if (tempArr.length > 0) {
				for (var s = 0; s < tempArr.length; s++) {
					var buff = tempArr[s];
					if (buff._id == buffId) {
						return buff
					}
				}
			}
		}
		return null;
	}

	//重置某种id的buff剩余时间
	//根据buffid判断
	public refreshBuffTimeById(buffId: string) {
		for (var i in this.buffInfo) {
			var tempArr: BattleBuffData[] = this.buffInfo[i]
			if (tempArr.length > 0) {
				for (var s = 0; s < tempArr.length; s++) {
					var buff = tempArr[s];
					if (buff._id == buffId) {
						this.resetOneBuffLastTime(buff);
						// return buff
					}
				}
			}
		}
		return null;
	}

	//重置buff剩余时间
	public resetOneBuffLastTime(buff: BattleBuffData) {
		this.controler.clearCallBack(this, this.clearOneBuff, buff);
		//到时记得清除buff
		if (buff.leftFrame > 0) {
			this.controler.setCallBack(buff.leftFrame, this.clearOneBuff, this, buff);
		}
	}

	//判断是否有指定的buff组
	public getBuffByGroup(groupId: number) {
		for (var i in this.buffInfo) {
			var tempArr: BattleBuffData[] = this.buffInfo[i]
			if (tempArr.length > 0) {
				for (var s = 0; s < tempArr.length; s++) {
					var buff = tempArr[s];
					if (buff.group == groupId) {
						return buff
					}
				}
			}
		}
		return null;
	}


	//---------------------------------技能效果相关---------------------------------------------

	//复活 注意属性初始化
	public doRelive(hp: number = 0, skillAct: SkillActionData) {
		BattleLogsManager.battleEcho("xd 复活---", this.dataId)
		if (this.hp > 0) {
			BattleLogsManager.battleEcho("已经复活了")
			TableUtils.removeValue(this.diedArr, this);
			//把我放到数组里面
			if (this.campArr.indexOf(this) == -1) {
				this.campArr.push(this);
			}
			return;
		}
		var anyThis: any = this;
		//非自然复活需要触发技能
		if (skillAct) {
			ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_relive, anyThis, BattleFunc.emptyArr, skillAct);
		}
		this.controler.clearCallBack(this, this.doRelive);
		//判断当前是否在屏幕外
		//根据阵位确定坐标
		this.hp = hp;
		//重置死亡状态
		this.diedState = BattleConst.DIED_STATE_NONE;
		this._myView.alpha = 1;
		this._myView2 && (this._myView2.alpha = 1);

		TableUtils.removeValue(this.diedArr, this);
		//把我放到数组里面
		if (this.campArr.indexOf(this) == -1) {
			this.campArr.push(this);
		}
		this.doRelivePerformance()
		this.resumeIdleAction();
		this.initStand();
		this.hpBar.onHpChange();
		this.hpBar.followTarget();
		this.buffBar.onBuffChange();
		this.buffBar.followTarget();

		this.controler.refreshControler.oneRoleRelive(this);

	}

	/**设置我的血量和显示 */
	setMyHp(hp) {
		this.hp = hp;
		this.hpBar.onHpChange();
	}


	//是否技能暂停的时候继续执行
	public isRunWithSkillPause() {
		if (this.currentSkill && this.currentSkill == this.energySkill) {
			return true;
		}
		return false;
	}

	//获取某个技能对象
	public getSkillById(skillId: string, skillType: number) {
		if (skillType == BattleConst.skill_kind_energy) {
			return this.energySkill;
			//普攻或者小技能
		} else if (skillType == BattleConst.skill_kind_noraml || skillType == BattleConst.skill_kind_small) {
			//小技能:技能ID,技能UI位置编号;技能ID,技能UI位置编号;
			return this.getSkillByGroup(skillId, this.normalSkills)
		} else if (skillType == BattleConst.skill_kind_passive) {
			return this.getSkillByGroup(skillId, this.passiveSkills);
		}
	}

	//获取技能
	public getSkillByGroup(skillId: string, skillArr: BattleSkillData[]) {
		for (var i = 0; i < skillArr.length; i++) {
			if (skillArr[i]._skillId == skillId) {
				return skillArr[i];
			}
		}
		return null
	}


	//获取普通技能的等级
	public getCfgSkillLevel(targetSkillId: string) {
		var normalCfg = this.cfgData.normalSkill;
		if (this._data && this._data.normalSkills && this._data.normalSkills[targetSkillId]) {
			return this._data.normalSkills[targetSkillId]
		}
		if (this._data && this._data.passiveSkills && this._data.passiveSkills[targetSkillId]) {
			return this._data.passiveSkills[targetSkillId];
		}

		if (this._data && this.energySkill) {
			var level = this._data.energySkill && this._data.energySkill.level || 1;
			var skillId: string = this.cfgData.energySkill;
			if (this.energySkill._skillId == targetSkillId) {
				return this.energySkill.level;
			}
		}
		return 1;
	}

	//获取护盾量
	public getSheildValue() {
		var value = 0;
		for (var i = 0; i < this.shieldInfoArr.length; i++) {
			value += this.shieldInfoArr[i].value;
		}
		return value;
	}

	//重写放入缓存函数
	public onSetToCache() {
		super.onSetToCache();
		if (this.hpBar) {
			PoolTools.cacheItem(PoolCode.POOL_HPBAR + this.camp, this.hpBar)
			this.hpBar.onSetToCache()
			this.hpBar = null;
		}
		if (this.buffBar) {
			PoolTools.cacheItem(PoolCode.POOL_BUFFBAR + this.camp, this.buffBar)
			this.buffBar.onSetToCache()
			this.buffBar = null;
		}
	}

	//初始化小红点（ / 小蓝点）到小地图
	initPointOnSmallMap() {
		this.mapPoint = this.controler.battleUI.createOneMapPoint(this);
	}

	//销毁小地图上的小红点（ / 小蓝点）
	destroyPoint() {
		if (!this.mapPoint) return;
		var type = this.lifeType;
		if (this.camp == BattleConst.ROLEGROUP_MYSELF) {
			if (type == BattleConst.LIFE_JIDI) {
				PoolTools.cacheItem(PoolCode.SELF_MAP_HOME_POINT_POOL, this.mapPoint);
			} else if (type == BattleConst.LIFE_AIRHERO) {
				PoolTools.cacheItem(PoolCode.SELF_MAP_SKY_POINT_POOL, this.mapPoint);
			} else {
				PoolTools.cacheItem(PoolCode.SELF_MAP_POINT_POOL, this.mapPoint);
			}
		} else {
			if (type == BattleConst.LIFE_JIDI) {
				PoolTools.cacheItem(PoolCode.ENEMY_MAP_HOME_POINT_POOL, this.mapPoint);
			} else if (type == BattleConst.LIFE_AIRHERO) {
				PoolTools.cacheItem(PoolCode.ENEMY_MAP_SKY_POINT_POOL, this.mapPoint);
			} else {
				PoolTools.cacheItem(PoolCode.ENEMY_MAP_POINT_POOL, this.mapPoint);
			}
		}
		this.mapPoint && this.mapPoint.removeSelf();
		this.mapPoint = null;
	}

	public showBornAni() {
		var eff = this.createEfect(ResourceConst.EFFECT_BORN_LANDROLE, 0, false, 0, 0, 0, false, 2, 0, 120);
	}

	//销毁
	public dispose() {
		super.dispose();
		if (this.hpBar) {
			PoolTools.cacheItem(PoolCode.POOL_HPBAR + this.camp, this.hpBar)
			this.hpBar.onSetToCache()
			this.hpBar = null;
		}
		if (this.buffBar) {
			PoolTools.cacheItem(PoolCode.POOL_BUFFBAR + this.camp, this.buffBar)
			this.buffBar.onSetToCache()
			this.buffBar = null;
		}
		this.campArr = null
		this.toCampArr = null
	}


}