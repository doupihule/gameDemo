import InstanceLogical from "../instance/InstanceLogical";
import SkillActionData from "../data/SkillActionData";
import BattleBuffData from "../data/BattleBuffData";

import BattleFunc from "../../sys/func/BattleFunc";
import ConditionTrigger from "./ConditionTrigger";
import BattleConst from "../../sys/consts/BattleConst";
import PassiveSkillData from "../data/PassiveSkillData";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import BattleFormulaTrigger from "./BattleFormulaTrigger";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";

/**
 * buff触发器.
 * 触发buff时 执行的事情
 *
 */
export default class BuffTrigger {

	public static buff_logical_dmage: number = 1;    //伤害buff
	public static buff_logical_prop: number = 2; //属性buff
	public static buff_logical_otherprop: number = 3; //额外提升效果
	public static buff_logical_xuanyun: number = 4; //眩晕
	public static buff_logical_bingdong: number = 5; //冰冻
	public static buff_logical_jitui: number = 6; //击退
	public static buff_logical_jifei: number = 7; //击飞
	public static buff_logical_chenmo: number = 8; //沉默
	public static buff_logical_nuqi: number = 9; //怒气
	public static buff_logical_hudun: number = 10; //护盾
	public static buff_logical_wudi: number = 11; //无敌
	public static buff_logical_mianyi: number = 12; //免疫
	public static buff_logical_biedong: number = 13; //获得被动
	public static buff_logical_change_skill: number = 14; //变更技能
	public static buff_logical_add_skill: number = 15; //技能释放加速
	public static buff_logical_chaofeng: number = 16; //嘲讽
	public static buff_logical_safe: number = 19;        //无法被敌人选中
	public static buff_logical_safe_all: number = 20;        //无法被所有人选中


	//buff对应的bit 用来记录角色当前拥有的控制型buff状态
	public static buffTypeToBit: any = {
		[4]: 1, [5]: 2, [6]: 4, [7]: 8, [8]: 16,
		[19]: 512, [20]: 1024
	}

	//控制形buffbit
	public static ctrlBuffBit: number;
	//强控性的. 会禁掉我所有的操作的buff;
	public static forceCtrlBuffBit: number;

	//安全性buff,无法被敌人选中的bit
	public static safeBuffBit: number;

	//无法被所有人选中的bit
	public static safeByAllBuffBit: number;

	private static _hasInit = false;

	//初始化
	public static init() {
		if (this._hasInit) {
			return;
		}
		this._hasInit = true;
		//安全的buff 表示不可被选中
		this.safeBuffBit = this.buffTypeToBit[this.buff_logical_safe];
		this.safeByAllBuffBit = this.buffTypeToBit[this.buff_logical_safe_all];

		this.forceCtrlBuffBit = this.buffTypeToBit[this.buff_logical_bingdong] | this.buffTypeToBit[this.buff_logical_xuanyun] |
			this.buffTypeToBit[this.buff_logical_jifei] | this.buffTypeToBit[this.buff_logical_jitui] |
			this.buffTypeToBit[this.buff_logical_chaofeng]
		//控制类型的buff
		this.ctrlBuffBit = this.forceCtrlBuffBit & this.buffTypeToBit[this.buff_logical_chenmo]
	}


	//buff触发器
	public static setOneBuff(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {

		var logicType = buff.logicType;
		var func = this["runBuff_" + logicType];
		//不能给死人在加buff
		if (defer.hp <= 0) {
			return;
		}
		//如果是 无敌状态 不受减溢buff
		if (defer.invincibleNum > 0 && buff.type == BattleConst.buff_jianyi) {
			return;
		}
		//如果是有免疫类型buff的
		if (this.checkMianyiBuff(defer, buff)) {
			return;
		}
		var oldBuff = defer.getBuffById(buff._id);
		var targetLayerNumer: number = 1;

		//如果有旧buff 判断覆盖逻辑
		if (oldBuff) {
			//如果是提升属性的buff
			var maxLayer = buff.getMaxLayer();
			if (maxLayer == -1) {
				maxLayer = 9999
			}
			if (maxLayer > 0) {
				targetLayerNumer = oldBuff.layerNums + buff.layerNums;
				if (targetLayerNumer > maxLayer) {
					targetLayerNumer = maxLayer
				}
				buff.layerNums = targetLayerNumer;
				//标记这个buff是被覆盖清除的
				defer.clearOneBuff(oldBuff, BattleConst.buff_remove_cover)
			} else if (maxLayer == -2) {
				//刷新某种id的剩余时间
				defer.refreshBuffTimeById(buff._id);

			}


		}


		//防守方插入一个buff
		defer.insterOneBuff(buff)
	}


	//判断是否免疫buff
	public static checkMianyiBuff(defer: InstanceLogical, buff: BattleBuffData) {
		//@test  后续扩展
		return false;
	}


	//延迟执行buff效果
	public static runOneBuffEffect(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		var logicType = buff.logicType;
		var func = this["runBuff_" + logicType];
		// //被作用着触发效果 每次buff的效果被作用时触发
		ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_beUsedBuff, defer, BattleFunc.emptyArr, buff.skillAction, buff);
		var tempArr = BattleFunc.getOneTempArr();
		tempArr.push(defer);
		// //施法者触发效果
		ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_buffUsed, attacker, tempArr, buff.skillAction, buff);

		BattleFunc.cacheOneTempArr(tempArr);
		//这些是被buff作用的人
		if (!func) {
			LogsManager.errorTag("buffError", "没有对应的buff效果类型:", logicType);
		} else {
			func.call(this, attacker, defer, skillAction, buff);
		}
	}

	//伤害buff
	public static runBuff_1(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		BattleFormulaTrigger.damage(attacker, defer, skillAction, buff.skillLogicalParams[0][0], buff.skillLogicalParams[0][1], buff);
	}

	//属性提升
	public static runBuff_2(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		var params = buff.skillLogicalParams;
		var tb = {};
		for (var i = 0; i < params.length; i++) {
			var tempInfo = params[i];
			var attrId = tempInfo[0];
			var value = this.getValueByFrom(attacker, defer, tempInfo[2], tempInfo[3], tempInfo[4]) + tempInfo[1];
			value = value * (buff.layerNums || 1);
			tb[attrId] = value
			defer.attrData.updateOneAttr(attrId, value, 0, defer.attrData.extraAttr);
		}

		defer.buffAttrInfo.push({buff: buff, attr: tb});
		//更新这一组属性
		// defer.attrData.changeExtraAttr(tb, 1, true);

	}

	//额外提升 合并到2改成属性提升
	public static runBuff_3(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		LogsManager.warn("暂时废弃的buff生效类型3,buffid:", buff._id);
	}

	//眩晕 不需要再处理
	public static runBuff_4(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		//晕眩 需要停止运动
		defer.initStand()
		//播放闲置动作
		defer.playAction(BattleConst.LABEL_IDLE, true);
		//被打断技能
		defer.interruptSkill(attacker);
	}

	//冰冻 需要停住角色动画
	public static runBuff_5(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		defer.changeViewPauseValue(1);
		//晕眩 需要停止运动
		defer.initStand()
		//被打断技能
		defer.interruptSkill(attacker);
	}

	//击退
	public static runBuff_6(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		var localParams = buff.skillLogicalParams
		var frame = Number(localParams[0][1]);
		frame = BattleFunc.instance.turnMinisecondToframe(frame);
		defer.interruptSkill(attacker);
		//清除正在执行的技能序列
		defer.onHitedBack(attacker, localParams[0][0], localParams[0][2] || 0, frame)
		defer.controler.setCallBack(frame, defer.clearOneBuff, defer, buff);
	}


	//击飞
	public static runBuff_7(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {

		var params = buff.skillLogicalParams[0];

		defer.onBeHitFly(params, attacker);


	}

	//沉默 不需要单独处理
	public static runBuff_8(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {

	}

	//怒气
	public static runBuff_9(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		var value = buff.skillLogicalParams[0][0];
		//降低怒气
		defer.changeEnergy(value);
	}

	//护盾
	public static runBuff_10(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		//计算护盾的值
		var value: number = 0;
		var params = buff.skillLogicalParams[0]
		value = this.getValueByFrom(attacker, defer, params[1], params[2], params[3]);
		value += params[0];
		BattleLogsManager.debugByRole(attacker.dataId, "获得护盾值:", value, "技能效果id:", skillAction.skillEffectId);
		defer.shieldInfoArr.push({value: value, buff: buff});
	}

	//无敌
	public static runBuff_11(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		defer.invincibleNum++;
		BattleLogsManager.debugByRole(attacker.dataId, attacker.dataId + "给" + defer.dataId + "添加无敌效果");
	}

	//免疫
	public static runBuff_12(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		//下个版本优化
	}

	//获得被动
	public static runBuff_13(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {

		var arr = buff.skillLogicalParams;
		for (var i = 0; i < arr.length; i++) {
			var passiveId = String(arr[i][0]);
			var level = skillAction.skill.level;
			var passiveSkill: PassiveSkillData = attacker.controler.createPassiveSkill(passiveId, level, defer, buff.skillAction.relyonSkill || buff.skillAction.skill);
			attacker.passiveSkills.push(passiveSkill);
			passiveSkill.fromValue = buff;
		}


	}

	//变更技能
	public static runBuff_14(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {

	}

	//技能释放加速
	public static runBuff_15(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		var params = buff.skillLogicalParams;
		for (var i = 0; i < params.length; i++) {
			var tempArr = params[i];
			var id = tempArr[0];
			var value = tempArr[1];
			defer.setSkillSpeedUpValue(id, value);
		}
	}

	//嘲讽
	public static runBuff_16(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		defer.beTauntTargetInfo.target = attacker;
		defer.beTauntTargetInfo.buff = buff;
	}

	//对作用目标释放技能效果	技能效果ID
	public static runBuff_17(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		//@test 还没实现
		var skill = skillAction.skill;
		var tempArr = buff.skillLogicalParams;
		for (var i = 0; i < tempArr.length; i++) {
			var tempInfo = tempArr[i];
			var id = tempInfo[0];
			var act = skill.getActionById(id);
			var useSkill = skill;
			act = new SkillActionData(id, skill.owner, useSkill, 0, 1, 1, 0, 0, skillAction.relyonSkill);
			//否则立马执行一次效果
			defer.checkSkillEffect(act);
		}
	}

	//回血	为作用对象回复生命	固定回血数值	回血万分比
	public static runBuff_18(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {
		var value = 0;
		var params = buff.skillLogicalParams[0]
		value = this.getValueByFrom(attacker, defer, params[1], params[2], params[3]);
		value += params[0];
		var tempArr = BattleFunc.getOneTempArr();
		tempArr[0] = BattleConst.damage_normal
		tempArr[1] = value
		defer.onBeTrit(attacker, skillAction.skill, skillAction, tempArr);
		BattleFunc.cacheOneTempArr(tempArr);
	}

	//不可被敌人选中
	public static runBuff_19(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {


	}

	//不可被所有人选中
	public static runBuff_20(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData) {

	}

	//根据配置来源读取数值
	public static getValueByFrom(attacker: InstanceLogical, defer: InstanceLogical, percentValue: number, fromType: number, attrId: string) {
		var value;
		if (!fromType) {
			return 0;
		}
		if (fromType == 1) {
			value = percentValue / 10000 * attacker.attrData.getOneBaseAttr(attrId);
		} else if (fromType == 2) {
			value = percentValue / 10000 * defer.attrData.getOneBaseAttr(attrId);
		} else if (fromType == 3) {
			//本次造成的伤害
			if (defer.tempUseValue) {
				if (defer.tempUseValue[1]) {
					value = Number(defer.tempUseValue[1]);
					if (!value) {
						value = 0;
					} else {
						value *= percentValue / 10000
					}
				} else {
					value = 0;
				}


			} else {
				value = 0;
			}
		} else if (fromType == 4) {
			value = percentValue / 10000 * defer.attrData.getOneBaseAttr(attrId);
		}
		return Math.floor(value);
	}

	//---------------------------------清除一个buff-----------------------------------------
	public static onClearBuff(defer: InstanceLogical, buff: BattleBuffData, removeChance: number = 1) {
		var logicalType = buff.logicType;
		var func = this["clearBuff_" + logicalType];
		if (!func) {
			return;
		}
		func.call(this, buff.onwer, defer, buff.skillAction, buff);
	}

	//伤害buff 不需要特殊处理
	public static clearBuff_1(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
	}

	//属性
	public static clearBuff_2(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		//这里需要还原属性
		for (var i = defer.buffAttrInfo.length - 1; i >= 0; i--) {
			var info = defer.buffAttrInfo[i];
			if (info.buff == buff) {
				var attr = info.attr;
				for (var s in attr) {
					//把里面的值 反向扣回去
					defer.attrData.updateOneAttr(s, -attr[s], 0, defer.attrData.extraAttr);
				}

				//同时从数组移除
				defer.buffAttrInfo.splice(i, 1);
			}
		}
	}

	//额外提升
	public static clearBuff_3(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		//还原额外提升的属性
	}

	//眩晕 不需要特殊处理
	public static clearBuff_4(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//冰冻
	public static clearBuff_5(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		//如果是动作暂停状态的 那么 就复原动作
		defer.changeViewPauseValue(-1);
		//复原为闲置动作
		defer.resumeIdleAction();
	}

	//击退 不需要特殊处理
	public static clearBuff_6(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}


	//击飞 不需要特殊处理
	public static clearBuff_7(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//沉默 不需要特殊处理
	public static clearBuff_8(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//怒气 不需要特殊处理
	public static clearBuff_9(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//护盾移除
	public static clearBuff_10(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		var arr = defer.shieldInfoArr
		if (arr.length > 0) {

			for (var i = arr.length - 1; i >= 0; i--) {
				var info = arr[i];
				//移除指定的buff
				if (info.buff == buff) {
					arr.splice(i, 1);
				}
			}
		}
	}

	//无敌
	public static clearBuff_11(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		//取消无敌效果
		if (defer.invincibleNum > 0) {
			defer.invincibleNum--;
		}
	}

	//免疫 不需要特殊处理
	public static clearBuff_12(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//获得被动
	public static clearBuff_13(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		//把这个被动技能从数组移除
		var arr = defer.passiveSkills;
		for (var i = arr.length - 1; i >= 0; i--) {
			var passSkill = arr[i];
			if (passSkill.fromValue == buff) {
				arr.splice(i, 1);
				PoolTools.cacheItem(PoolCode.POOL_PASSIVE, passSkill);
			}
		}

	}

	//变更技能 不需要特殊处理
	public static clearBuff_14(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//技能释放加速
	public static clearBuff_15(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		var params = buff.skillLogicalParams;
		for (var i = 0; i < params.length; i++) {
			var tempArr = params[i];
			var id = tempArr[0];
			var value = tempArr[1];
			defer.setSkillSpeedUpValue(id, -value);
		}

	}

	//嘲讽
	public static clearBuff_16(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {
		defer.beTauntTargetInfo.target = null;
		defer.beTauntTargetInfo.buff = null;
	}

	//对作用目标释放技能效果  不需要特殊处理
	public static clearBuff_17(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//回血buff 不需要特殊处理
	public static clearBuff_18(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

	//不可被选中
	public static clearBuff_19(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {


	}

	//不可被所有人选中
	public static clearBuff_20(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, buff: BattleBuffData, removeChance: number = 1) {

	}

}