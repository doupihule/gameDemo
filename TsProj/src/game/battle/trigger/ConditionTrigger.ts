import InstanceLogical from "../instance/InstanceLogical";
import SkillActionData from "../data/SkillActionData";
import BattleConditionData from "../data/BattleConditionData";
import BattleSkillData from "../data/BattleSkillData";
import BattleBuffData from "../data/BattleBuffData";
import BattleFunc from "../../sys/func/BattleFunc";
import RandomUtis from "../../../framework/utils/RandomUtis";
import BattleConst from "../../sys/consts/BattleConst";
import LogsManager from "../../../framework/manager/LogsManager";
import PassiveSkillData from "../data/PassiveSkillData";
import PassiveSkillTrigger from "./PassiveSkillTrigger";
import InstanceLife from "../instance/InstanceLife";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";

/**
 * 条件触发器. 当某个技能满足某个时机以及条件时 执行技能对应的效果.
 *
 */
export default class ConditionTrigger {
	//条件触发器
	public static opportunity_refreshMonster: number = 1; //当刷一波怪
	public static opportunity_startBattle: number = 2; //开战
	public static opportunity_onRoleDied: number = 3; //出现死亡
	public static opportunity_giveSkill: number = 4; //释放技能
	public static opportunity_createAction: number = 5; //产生效果之前
	public static opportunity_action_usedBefore: number = 6; //效果生效之前
	public static opportunity_action_usedAfter: number = 8; //效果生效之后
	public static opportunity_buffUsed: number = 7; //施法者创建buff时
	public static opportunity_ownerbuffRemoved: number = 9; //Buff移除时  施法者触发
	public static opportunity_relive: number = 10; //触发复活时
	public static opportunity_onDied: number = 11; //触发死亡时
	public static opportunity_offskill: number = 12; //技能被打断时
	public static opportunity_checkDmgBefore: number = 13; //伤害检测之前  暴击闪避判定之前
	public static opportunity_addhp: number = 14; //受到回血时
	public static opportunity_getbuff: number = 15; //获得buff后
	public static opportunity_checkDmgAfter: number = 18;    //伤害检测之后 暴击闪避已经判定
	public static opportunity_createMySelf: number = 19; //当我出生时

	public static opportunity_beUsedBuff: number = 16;   //当被buff作用时 buff效果会触发n次
	public static opportunity_usedbuffRmoved: number = 17;   //当被作用着buff移除时 被作用者触发

	//某一个对象判断是否触发被动技能 根据不同的时机传入不同的参数 必带的参数是前面3个,
	// p1: InstanceLogicalArr 被作用的数组 p2:SkillActionData(如果有)  p3,p4 自行扩展
	public static onOpportunityByInstance(opportunity, selfInstance: InstanceLogical, p1: any = null, p2: any = null, p3: any = null, p4: any = null) {
		//拿到所有的被动,判断哪些符合触发条件.并执行技能效果
		var passiveSkills: PassiveSkillData[] = selfInstance.passiveSkills;
		var rtValue: number = 0;
		if (passiveSkills) {
			for (var i = 0; i < passiveSkills.length; i++) {
				//判断技能cd是否为0
				var passive: PassiveSkillData = passiveSkills[i];
				//如果没有激活也不执行
				if (!passive.isActive) {
					continue;
				}
				if (passive.leftSkillCd != 0) {
					continue;
				}
				if (passive.cfgData.opportunity == opportunity) {
					if (passive.triggerNums == 9) {
						BattleLogsManager.battleEcho(1111);
					}
					if (this.checkOneOpportunity(selfInstance, passive, passive.cfgData.condition, p1, p2, p3, p4)) {
						if (passive.triggerFrame != selfInstance.controler.updateCount) {
							passive.triggerNums = 0;
							passive.triggerFrame = selfInstance.controler.updateCount
						}
						passive.triggerNums += 1;
						if (passive.triggerNums >= 10) {
							LogsManager.errorTag("passiveError", "被动技能死循环了,id:", passive._skillId, "opportunity:", opportunity);
							continue;
						}
						var rt = PassiveSkillTrigger.runOnePassiveSkill(selfInstance, passive, p1, p2, p3, p4);
						if (typeof (rt) == "number") {
							rtValue += rt;
						}
					}
				}
			}
		}
		return rtValue;
	}

	//给某一组对象判断被动技触发
	public static onOpportunityByArr(opportunity, campArr: InstanceLogical[], p1 = null, p2 = null, p3 = null, p4 = null) {
		var rtValue: number = 0;
		for (var i = campArr.length - 1; i >= 0; i--) {
			rtValue += this.onOpportunityByInstance(opportunity, campArr[i], p1, p2, p3, p4);
		}
		return rtValue;
	}


	// 触发时机
	public static checkOneOpportunity(instance: InstanceLogical, skill: BattleSkillData, conditionArr: any[], p1: any = null, p2: any = null, p3: any = null, p4 = null) {
		//没有生效条件 表示必定触发
		if (!conditionArr) {
			return true;
		}
		for (var i = 0; i < conditionArr.length; i++) {
			//需要连续满足判定条件的数组
			var tempArr = conditionArr[i];
			var isAllSuccess: boolean = true;
			for (var j = 0; j < tempArr.length; j++) {
				var condition: BattleConditionData = this.getCacheConditionData(tempArr[j], skill);
				var rt = this.checkOneCondition(instance, condition, skill, p1, p2, p3, p4);
				if (!rt) {
					isAllSuccess = false;
					break
				}
			}
			//并行的必须都成功直接返回触发成功
			if (isAllSuccess) {
				return true;
			}
		}
		return false;
	}


	//判断技能一个生效条件;
	private static checkOneCondition(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, p1: any, p2: any, p3: any, p4: any) {
		var type = condition.type;
		//根据条件类型动态拿方法
		var func = this["checkCondition_" + type];
		if (!func) {

			LogsManager.errorTag("battleCfgError", "错误的条件类型,id:", condition._id, "type:", condition.type);
			return false;
		} else {
			return func.call(this, selfInstance, condition, skill, p1, p2, p3, p4);
		}
	}


	//----------------------判定条件生效------------------------------------
	//----------------------固定3个参数,selfInstance自身判定着,, condition,skill(判定的技能)------------------------------------
	//----------------------判定条件生效------------------------------------

	//概率触发
	private static checkCondition_1(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData) {
		var ratio: number = condition.conditionLogicalParams[0][0];
		if (ratio >= 10000) {
			return true;
		}
		var random: number = RandomUtis.getOneRandom(BattleFunc.battleRandomIndex);
		if (random <= ratio / 10000) {
			return true;
		}
		return false
	}

	//按自身血量触发
	private static checkCondition_2(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData) {
		var hpRatio = selfInstance.hp / selfInstance.maxHp * 10000;
		var rt = this.compareValue(hpRatio, Number(condition.conditionLogicalParams[0][1]), Number(condition.conditionLogicalParams[0][0]));
		return rt;
	}

	//按目标血量触发
	private static checkCondition_3(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {
		var params = condition.conditionLogicalParams;
		if (!useArr || useArr.length == 0) {
			return false;
		}

		for (var i = 0; i < useArr.length; i++) {
			var targetInstance: InstanceLogical = useArr[i];
			var hpRatio = targetInstance.hp / targetInstance.maxHp * 10000;
			var rt = this.compareValue(hpRatio, Number(condition.conditionLogicalParams[0][1]), Number(condition.conditionLogicalParams[0][0]));
			if (rt) {
				return true;
			}
		}
		return false;
	}

	//按目标类型触发
	private static checkCondition_4(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {
		var params = condition.conditionLogicalParams;
		if (!useArr || useArr.length == 0) {
			return false;
		}
		for (var i = 0; i < useArr.length; i++) {
			//如果符合目标生命类型的
			if (this.checkIsTargetLife(useArr[i], params)) {
				return true
			}
		}


		return false;
	}

	//产生暴击
	private static checkCondition_5(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {
		if (!useArr || useArr.length == 0) {
			return false;
		}
		for (var i = 0; i < useArr.length; i++) {
			var tempInstance: InstanceLogical = useArr[i];
			var tempResultInfo = tempInstance.tempBeUsedValue;
			if (tempResultInfo[0] == BattleConst.damage_baoji) {
				return true;
			}
		}
		return false;
	}

	//产生闪避
	private static checkCondition_6(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {

		var tempInstance: InstanceLogical = selfInstance
		var tempResultInfo = tempInstance.tempBeUsedValue;
		if (!tempResultInfo) {
			LogsManager.errorTag("checkCondition_6", "检查是否配置条件错误.还没有判定结果,condition:", condition._id, "skill:", skill && skill._skillId || "none");
			return false
		}
		if (tempResultInfo[0] == BattleConst.damage_miss) {
			return true;
		}

		return false;
	}

	//对目标造成击杀
	private static checkCondition_7(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {

		var targetLifeType = condition.conditionLogicalParams[0][0]
		var params = condition.conditionLogicalParams;
		if (!useArr || useArr.length == 0) {
			return false;
		}

		for (var i = 0; i < useArr.length; i++) {
			var tempInstance: InstanceLogical = useArr[i];
			//必须生命小于0表示被击杀
			if (tempInstance.hp <= 0) {
				//如果符合目标生命类型的
				if (this.checkIsTargetLife(tempInstance, params)) {
					return true
				}
			}

		}
		return false;
	}


	//有指定己方单位在场
	private static checkCondition_8(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData) {
		var campArr: InstanceLogical[] = selfInstance.campArr;
		var targetId: string = String(condition.conditionLogicalParams[0][0]);
		var params = condition.conditionLogicalParams;
		for (var s = 0; s < params.length; s++) {
			var id = String(params[s]);
			for (var i = 0; i < campArr.length; i++) {
				var tempInstance: InstanceLogical = campArr[i];
				if (tempInstance.dataId == targetId) {
					return true;
				}
			}
		}
		return false;

	}

	//目标身上有指定ID的buff且满足层数条件
	private static checkCondition_9(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {
		if (!useArr || useArr.length == 0) {
			return false;
		}
		for (var i = 0; i < useArr.length; i++) {
			if (this.checkBuffLayer(useArr[i], condition)) {
				return true;
			}
		}
		return false;

	}

	//目标身上有指定类型的buff
	private static checkCondition_10(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {
		if (!useArr || useArr.length == 0) {
			return false;
		}
		for (var i = 0; i < useArr.length; i++) {
			if (this.checkHasBuff(useArr[i], condition)) {
				return true;
			}
		}

		return false;
	}

	//目标身上有指定组的buff
	private static checkCondition_11(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[]) {
		if (!useArr || useArr.length == 0) {
			return false;
		}
		for (var i = 0; i < useArr.length; i++) {
			if (this.checkHasBuffGroup(useArr[i], condition)) {
				return true;
			}
		}
		return false;
	}

	//目标身上指定ID的buff被移除
	private static checkCondition_12(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[], skillData: SkillActionData, buff: BattleBuffData, removeType: number = 1) {
		if (!useArr || useArr.length == 0) {
			return false;
		}
		for (var i = 0; i < useArr.length; i++) {
			if (this.checkBuffRemove(useArr[i], condition, buff)) {
				return true;
			}
		}
		return false;
	}

	//自己身上有指定类型的buff
	private static checkCondition_13(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData) {
		return this.checkHasBuff(selfInstance, condition);
	}

	//自己身上有指定组的buff
	private static checkCondition_14(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData) {
		return this.checkHasBuffGroup(selfInstance, condition)
	}

	//自己身上有指定ID的buff且满足层数条件
	private static checkCondition_15(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData) {
		return this.checkBuffLayer(selfInstance, condition);
	}


	//自己身上指定ID的buff被移除，并满足特定的移除原因移除原因：1.任何方式移除2.护盾类血量为0,3.被敌方技能驱散4.buff持续时间结束
	private static checkCondition_16(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[], skillAction: SkillActionData, buff: BattleBuffData, removeType: number = 1) {
		return this.checkBuffRemove(selfInstance, condition, buff, removeType);
	}

	//判断目标是否有指定buff
	private static checkHasBuff(targetInstance: InstanceLogical, condition: BattleConditionData) {
		var arr1 = condition.conditionLogicalParams;
		for (var i = 0; i < arr1.length; i++) {
			var arr2 = arr1[i];
			var buff: BattleBuffData = targetInstance.getBuffById(arr2[0]);
			if (buff) {
				return true;
			}
		}
		return false;
	}

	//判断目标是否有指定buff 组
	private static checkHasBuffGroup(targetInstance: InstanceLogical, condition: BattleConditionData) {
		var arr1 = condition.conditionLogicalParams;
		for (var i = 0; i < arr1.length; i++) {
			var arr2 = arr1[i];
			var buff: BattleBuffData = targetInstance.getBuffByGroup(arr2[0]);
			if (buff) {
				return true;
			}
		}
		return false;
	}

	//自己身上有指定ID的buff且满足层数条件
	private static checkBuffLayer(targetInstance: InstanceLogical, condition: BattleConditionData) {
		var arr1 = condition.conditionLogicalParams;
		for (var i = 0; i < arr1.length; i++) {
			var tempArr = arr1[i];
			var buff: BattleBuffData = targetInstance.getBuffById(String(tempArr[0]));
			if (buff) {
				//比较buff层数
				var rt = this.compareValue(buff.layerNums, tempArr[2], tempArr[1]);
				if (rt) {
					return rt;
				}
			}
		}


		return false;
	}

	//自己身上指定ID的buff被移除，并满足特定的移除原因移除原因：1.任何方式移除2.护盾类血量为0,3.被敌方技能驱散4.buff持续时间结束
	private static checkBuffRemove(instance: InstanceLogical, condition: BattleConditionData, buff: BattleBuffData, removeType: number = 1) {
		var arr1 = condition.conditionLogicalParams;
		for (var i = 0; i < arr1.length; i++) {
			var tempArr = arr1[i];
			if (buff._id == String(tempArr[0])) {
				if (!removeType || removeType == 1) {
					return true;
				}
			}
		}
		return false;
	}

	//死亡者满足特定阵营和类型，可配多种类型 阵营id 1.己方 2.敌方 3.不限. 类型ID;
	private static checkCondition_17(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[], skillAction: BattleSkillData, diedInstance: InstanceLogical) {
		for (var i = 0; i < condition.conditionLogicalParams.length; i++) {
			var tempParams = condition.conditionLogicalParams[i];
			var campType = tempParams[0];
			var lifetype = tempParams[1];
			//必须类型符合 和阵营符合
			if (lifetype == diedInstance.lifeType) {
				if (campType == 3) {
					return true;
				} else if (campType == 2) {
					if (diedInstance.camp != selfInstance.camp) {
						return true
					}
				} else {
					if (diedInstance.camp == selfInstance.camp) {
						return true;
					}
				}
			}
		}

		return false;
	}

	//目标技能满足指定条件 技能类型：1.普攻 2.小技能 3.怒气大招 4 被动 5.不限 6.指定id
	private static checkCondition_18(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[], skillAction: SkillActionData) {
		var arr1: number[] = condition.conditionLogicalParams;
		if (!skillAction.skill) {
			LogsManager.errorTag("paramserror", "参数错误")
		}
		for (var i = 0; i < arr1.length; i++) {
			var tempArr = arr1[i];
			var tempSkillType = tempArr[0];
			if (tempSkillType == 5) {
				return true;
			} else if (tempSkillType == 6) {
				//如果是指定的id
				if (skillAction.skill._skillId == String(tempArr[1])) {
					return true;
				}
				//如果是满足指定的技能类型
			} else if (skillAction.skill.skillType == tempSkillType) {
				return true;
			}

		}
		return false;

	}

	//产生的技能效果满足指定条件  参数1:加成范围：1.指定ID的效果，2.指定类型的效果 ,参数2:效果id/效果类型ID
	private static checkCondition_19(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[], targetSkillAction: SkillActionData) {
		var arr1: number[] = condition.conditionLogicalParams;
		for (var i = 0; i < arr1.length; i++) {
			var tempArr = arr1[i];
			var type = tempArr[0];
			//指定ID的效果
			if (type == 1) {
				if (targetSkillAction.skillEffectId == String(tempArr[1])) {
					return true;
				}
			} else if (type == 2) {
				if (targetSkillAction.cfgData.logicType == String(tempArr[1])) {
					return true;
				}
			}
		}
	}

	//按目标属性与自身属性的比较结果触发. 参数1:比较方式.参数2 比较属性名
	private static checkCondition_20(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[], targetInstance: InstanceLogical) {

		//多组属性是或的关系
		var paramsArr = condition.conditionLogicalParams;
		for (var s = 0; s < paramsArr.length; s++) {
			var params = paramsArr[s];
			var propId = String(params[1]);
			var compareType: number = params[0]
			if (!propId) {
				LogsManager.errorTag("conditionError", "condtion配置错误,id:", condition._id), "没有属性id";
				return false;
			}
			if (!useArr || useArr.length == 0) {
				return false;
			}
			for (var i = 0; i < useArr.length; i++) {
				var tempInstance: InstanceLogical = useArr[i];
				var value1: number;     //目标属性
				var value2: number       //我的属性
				if (propId == BattleConst.attr_hp) {
					value1 = tempInstance.hp;
					value2 = selfInstance.hp;
				} else if (propId == BattleConst.attr_enegry) {
					value1 = tempInstance.energy;
					value2 = selfInstance.energy;
				} else {
					value1 = tempInstance.attrData.getOneAttr(propId);
					value2 = selfInstance.attrData.getOneAttr(propId);
				}
				var rt = this.compareValue(value2, value1, compareType);
				if (rt) {
					return true
				}
			}
		}


		return false;
	}

	//按照指定的id触发
	private static checkCondition_21(selfInstance: InstanceLogical, condition: BattleConditionData, skill: BattleSkillData, useArr: InstanceLogical[], targetInstance: InstanceLogical) {
		var paramsArr = condition.conditionLogicalParams;
		for (var s = 0; s < paramsArr.length; s++) {
			var rid = String(paramsArr[s][1]);
			var lifeType = Number(paramsArr[s][0]);
			for (var i = 0; i < useArr.length; i++) {
				var targetRole = useArr[i];
				if (targetRole.dataId == rid && targetRole.lifeType == lifeType) {
					return true;
				}
			}
		}
		return false;

	}


	//比较对象  compareType 1 大于, 2 小于, 3等于, 4大于等于, 5 小于等于
	public static compareValue(value1: number, value2: number, compareType: number) {
		var disValue = value1 - value2;
		if (compareType == 1) {
			return disValue > 0
		} else if (compareType == 2) {
			return disValue < 0
		} else if (compareType == 3) {
			return disValue == 0
		} else if (compareType == 4) {
			return disValue >= 0
		} else if (compareType == 5) {
			return disValue <= 0
		}
	}

	//判断是否满足目标生命类型
	private static checkIsTargetLife(instance: InstanceLife, logicalParams: any[]) {
		if (!logicalParams) {
			return false;
		}
		for (var i = 0; i < logicalParams.length; i++) {
			var targetLifeType = logicalParams[i][0];
			if (targetLifeType == 0) {
				return true;
			}
			if (instance.lifeType == targetLifeType) {
				return true
			}
		}
		return false;
	}


	//条件数据缓存
	private static _conditionDataCache: any = {}

	public static getCacheConditionData(id: string, skill: BattleSkillData) {
		var condition: BattleConditionData = this._conditionDataCache[id]
		if (!condition) {
			this._conditionDataCache[id] = new BattleConditionData(id);
			condition = this._conditionDataCache[id]
		}
		condition.setData(skill);
		return condition
	}


}