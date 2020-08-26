import InstanceLogical from "../instance/InstanceLogical";
import PassiveSkillData from "../data/PassiveSkillData";
import LogsManager from "../../../framework/manager/LogsManager";
import BattleFunc from "../../sys/func/BattleFunc";
import SkillActionData from "../data/SkillActionData";
import BattleConst from "../../sys/consts/BattleConst";
import BattleBuffData from "../data/BattleBuffData";
import ChooseTrigger from "./ChooseTrigger";
import TableUtils from "../../../framework/utils/TableUtils";
import BattleSkillData from "../data/BattleSkillData";

/**
 * 被动技能生效后的事件
 *
 */
export default class PassiveSkillTrigger {


	//执行某条被动的     targetRole,指定角色. 如果不指定. 那么就根据选到的角色全部执行
	public static runOnePassiveGlobalAttr(passive: PassiveSkillData, attrMap: any[], targtRole: InstanceLogical = null, way: number = 1) {
		if (!attrMap) {
			attrMap = passive.skillLogicalParams;
		}
		var onwer: InstanceLogical = passive.owner
		var tempArr = BattleFunc.getOneTempArr()
		for (var i = 0; i < attrMap.length; i++) {
			var attrInfo = attrMap[i];
			var attrId = attrInfo[0];
			var fixValue = attrInfo[1] * way
			var percentValue = attrInfo[2] * way;
			var useType = attrInfo[3];
			var compareValue = attrInfo[4];
			tempArr.length = 0;
			ChooseTrigger.getRoleByType(onwer, useType, compareValue, tempArr);

			for (var s = 0; s < tempArr.length; s++) {
				var tempInstance: InstanceLogical = tempArr[s];
				if ((!targtRole) || tempInstance == targtRole) {
					tempInstance.attrData.updateOneAttr(attrId, fixValue, percentValue, tempInstance.attrData.extraAttr);
				}
			}

		}
		BattleFunc.cacheOneTempArr(tempArr)

	}

	//执行一个角色当前所有的 被动光环加成 .创建一个角色时候 需要使用这个
	public static runAllPassiveGlobalAttr(globalAttr: any[], targetRole: InstanceLogical, way: number = 1) {
		for (var i = 0; i < globalAttr.length; i++) {
			var info = globalAttr[i];
			this.runOnePassiveGlobalAttr(info.passive, info.attr, targetRole, way);
		}
	}


	//使用或者移除自身被动的属性
	public static useSelfPassiveAttr(instance: InstanceLogical, passive: PassiveSkillData, way: number = 1, outRecount: boolean = false) {
		var type = passive.cfgData.effectType;
		if (type != BattleConst.passive_effect_attr) {
			return;
		}
		var effectParams = passive.skillLogicalParams;
		for (var s = 0; s < effectParams.length; s++) {
			var tempAttr = effectParams[s];
			var attrId = tempAttr[0];
			instance.attrData.updateOneAttr(attrId, tempAttr[1] * way, tempAttr[2] * way, instance.attrData.extraAttr, outRecount);
		}
	}


	//被动技能效果触发器
	public static runOnePassiveSkill(attacker: InstanceLogical, skill: PassiveSkillData, p1, p2, p3, p4) {
		var type = skill.cfgData.effectType;
		var func = this["runPassiveSkill_" + type];

		// 重置被动技能cd
		if (skill.cfgData.cdTime) {
			skill.leftSkillCd = BattleFunc.instance.turnMinisecondToframe(Number(skill.cfgData.cdTime));
		}
		if (!func) {
			LogsManager.errorTag("PassiveSkillCfgError", "错误的被动技能效果类型,id:", skill._skillId, "effecttype:", type);
			return 0
		} else {
			//有些地方可能会用到返回值. p1,p2,p3,p4根据需要调用 p1固定 useArr,p2 skillActionData
			return func.call(this, attacker, skill, p1, p2, p3, p4);
		}
	}


	//触发技能效果 选择目标并触发技能效果 参数1: 额外触发的效果id, 参数2:触发延迟时间（毫秒）;
	private static runPassiveSkill_1(attacker: InstanceLogical, skill: PassiveSkillData) {
		this.useSkillActions(attacker, skill, null)
		return null
	}


	// 刷怪权重提高  某种怪物刷出权重提高	位置,	概率改变比率		刷出一波怪
	private static runPassiveSkill_2(attacker: InstanceLogical, skill: PassiveSkillData) {
		//boss关不生效
		if (attacker.controler.gameMode == BattleConst.battle_game_mode_boss) {
			return
		}
		var params = skill.skillLogicalParams[0];
		attacker.controler.refreshControler.setFormationWeight(params[0], params[1] / 10000);

	}

	//技能释放时间变更	技能释放时间增加/缩短	增加/缩短的时长
	private static runPassiveSkill_3(attacker: InstanceLogical, skill: PassiveSkillData) {
		//@搁置
	}

	//效果加成	生成的某个效果造成额外万分比伤害/回血	加成万分比
	private static runPassiveSkill_4(attacker: InstanceLogical, skill: PassiveSkillData) {
		//设置最终额外伤害
		attacker.attrData.changeOneTempAttr(BattleConst.attr_final_damage, skill.skillLogicalParams[0][0], 0);
		return skill.skillLogicalParams[0][0];
	}

	//触发额外效果	额外触发指定id的效果，如果不配目标，则目标继承	额外触发的效果id,触发延迟时间（毫秒）;
	private static runPassiveSkill_5(attacker: InstanceLogical, skill: PassiveSkillData, useArr: InstanceLogical[], targetSkillAction: SkillActionData) {
		//所有被动触发的技能选择都依赖于当前的主动技能
		return this.useSkillActions(attacker, skill, targetSkillAction);
	}

	//buff加成	buff产生额外万分比伤害/回血	"加成范围：1.指定ID的buff，2.指定类型的buff 3.指定组的buff"	  buffId/buff类型ID/buff组ID	加成万分比
	private static runPassiveSkill_6(attacker: InstanceLogical, skill: PassiveSkillData, useArr: InstanceLogical[], targetSkillAction: SkillActionData, buffData: BattleBuffData) {
		var tempArr = skill.skillLogicalParams;
		var addValue: number = 0;
		for (var i = 0; i < tempArr.length; i++) {
			var info = tempArr[i];
			var type = info[0];
			var params = (info[1]);
			if (type == 1) {
				if (buffData._id == String(params)) {
					addValue += info[2];
					break;
				}
			} else if (type == 2) {
				//逻辑效果匹配
				if (buffData.logicType == params) {
					addValue += info[2];
					break;
				}
			} else if (type == 3) {
				if (buffData.group == params) {
					addValue += info[2];
					break;
				}
			}
		}
		//buff计算伤害时会产生额外的万份比伤害
		attacker.attrData.changeOneTempAttr(BattleConst.attr_final_damage, addValue, 0);
		//添加buff产生额外万分比伤害回血每次计算的时候都附带上
		//返回加成万分比
		return addValue;
	}

	//额外万分比伤害	最终伤害=（1+被动万分比）*应受伤害值	效果万分比
	private static runPassiveSkill_7(attacker: InstanceLogical, skill: PassiveSkillData) {
		attacker.attrData.changeOneTempAttr(BattleConst.attr_final_damage, skill.skillLogicalParams[0][0], 0);

	}

	//额外万分比血量回复		效果万分比
	private static runPassiveSkill_8(attacker: InstanceLogical, skill: PassiveSkillData) {
		attacker.attrData.changeOneTempAttr(BattleConst.attr_final_betreated, skill.skillLogicalParams[0][0], 0);
	}

	//额外万分比伤害减免		效果万分比
	private static runPassiveSkill_9(attacker: InstanceLogical, skill: PassiveSkillData) {
		attacker.attrData.changeOneTempAttr(BattleConst.attr_final_relief, skill.skillLogicalParams[0][0], 0);
	}

	//本次计算伤害时增加额外属性		提高的属性类型id，固定值,万分比；……    outMap:输出的表
	private static runPassiveSkill_10(attacker: InstanceLogical, skill: PassiveSkillData) {
		var tempArr = skill.skillLogicalParams;
		var tempOnceAttr: any = attacker.attrData.tempOnceAttr;
		for (var i = 0; i < tempArr.length; i++) {
			var info = tempArr[i];
			var id = info[0];
			attacker.attrData.changeOneTempAttr(id, info[1], info[2]);
		}

		return tempOnceAttr;
	}


	//变更效果	将满足条件的效果变更为指定效果	变更后的效果id序列; 到时直接把效果变成返回的效果数组
	private static runPassiveSkill_11(attacker: InstanceLogical, skill: PassiveSkillData, useArr: InstanceLogical[], skillAction: SkillActionData, outArr: any[]) {
		var paramsArr = skill.skillLogicalParams;
		if (!outArr) {
			LogsManager.errorTag("passiveerror_11", "被动技能效果参数错误,skillId:", skill._skillId);
			return;
		}
		outArr.length = 0;
		for (var i = 0; i < paramsArr.length; i++) {
			var tempInfo = paramsArr[i];
			var id = tempInfo[0];
			var delayFrame = BattleFunc.instance.turnMinisecondToframe(tempInfo[1]);
			var act = skill.getActionById(id);
			//更换的技能效果 依赖于目标技能效果
			if (!act) {
				act = new SkillActionData(id, skill.owner, skillAction.skill, delayFrame, 1, 1, 0, 0, skill);
			}
			outArr.push(act);
		}
		return outArr;

	}


	//创建技能效果  因为1和5做的逻辑是一样的.所以提炼出来
	private static useSkillActions(attacker: InstanceLogical, skill: PassiveSkillData, targetSkillAction: SkillActionData = null) {
		var tempArr = skill.skillLogicalParams;
		for (var i = 0; i < tempArr.length; i++) {
			var tempInfo = tempArr[i];
			var id = tempInfo[0];
			var delayFrame = BattleFunc.instance.turnMinisecondToframe(tempInfo[1]);
			var act = skill.getActionById(id);
			var useSkill = attacker.currentSkill && attacker.currentSkill || skill;
			if (!act) {
				if (targetSkillAction) {
					act = new SkillActionData(id, skill.owner, targetSkillAction.skill, delayFrame, 1, 1, 0, 0, skill);
				} else {
					act = new SkillActionData(id, skill.owner, useSkill, delayFrame, 1, 1, 0, 0, skill);
				}

			}
			if (targetSkillAction != null) {
				//如果是选择目标继承的
				if (act.chooseTartgetCfg == null) {
					if (targetSkillAction.tempChooseArr.length > 0) {
						TableUtils.copyOneArr(targetSkillAction.tempChooseArr, act.tempChooseArr);
						act.chooseTartgetCfg = targetSkillAction.chooseTartgetCfg;
					} else {
						var tempSkill: BattleSkillData = targetSkillAction.skill
						if (tempSkill.tempChooseArr.length > 0) {
							TableUtils.copyOneArr(tempSkill.tempChooseArr, act.tempChooseArr);
						}
						act.chooseTartgetCfg = tempSkill.chooseTartgetCfg;
					}

				}
			}
			if (delayFrame > 0) {
				attacker.controler.setCallBack(delayFrame, attacker.checkSkillEffect, attacker, act);
			} else {
				//否则立马执行一次效果
				attacker.checkSkillEffect(act);
			}
		}
	}

	//------------------------战斗外的计算.函数空置-----------------------------------------------------
	//降低升级消耗	降低自身/全队升级消耗：按万分比降低	"降低的对象：1.自己 2.全队"	降低的万分比
	private static runPassiveSkill_101(attacker: InstanceLogical, skill: PassiveSkillData) {

	}

	//提高金币产出	提高怪物掉落或boss战结算或离线金币产出	"提高的对象：1.怪物掉落 2.boss战结算 3.离线金币"	提高的万分比
	private static runPassiveSkill_102(attacker: InstanceLogical, skill: PassiveSkillData) {

	}

	//提升属性	"提升自身/全队/前排/后排/指定队友属性。可同时配置多种属性。"	提高的属性类型id，固定值,万分比；……	"提升的对象：1.自身 2.全队 3.前排 4.后排 5.指定队友，队友ID"
	private static runPassiveSkill_103(attacker: InstanceLogical, skill: PassiveSkillData) {

	}


	//提升属性	"提升自身属性。可同时配置多种属性。"	提高的属性类型id，固定值,万分比；……显示在属性面板
	private static runPassiveSkill_104(attacker: InstanceLogical, skill: PassiveSkillData) {

	}

	//技能CD时间变更 技能释放的CD时间加长或缩短	影响的技能ID序列	增加/缩短的时长万分比	展示在技能描述中
	private static runPassiveSkill_105(attacker: InstanceLogical, skill: PassiveSkillData) {

	}

	//挂机战斗死亡后复活时间变更	时间加长或缩短	增加/缩短的时长万分比
	private static runPassiveSkill_106(attacker: InstanceLogical, skill: PassiveSkillData) {

	}
}