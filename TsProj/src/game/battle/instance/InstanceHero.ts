import InstanceLogical from "./InstanceLogical";
import BattleConst from "../../sys/consts/BattleConst";
import BattleFunc from "../../sys/func/BattleFunc";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import PassiveSkillData from "../data/PassiveSkillData";
import PassiveSkillTrigger from "../trigger/PassiveSkillTrigger";
import ChooseTrigger from "../trigger/ChooseTrigger";
import BattleSkillData from "../data/BattleSkillData";
import BattleDebugTool from "../controler/BattleDebugTool";
import BuffTrigger from "../trigger/BuffTrigger";
import WindowManager from "../../../framework/manager/WindowManager";
import TranslateFunc from "../../../framework/func/TranslateFunc";


//英雄类
export default class InstanceHero extends InstanceLogical {

	private _leftReliveFrame: number = 0;


	constructor(controler) {
		super(controler);
		this.classModel = BattleConst.model_role;
	}


	// 当数据发生变化  目前主要是刷新技能等级或者用户数据
	public onDataChange(changeData: any) {
		super.onDataChange(changeData);

		var hasPassiveChange: boolean = false;
		var tempPrassArr = BattleFunc.getOneTempArr();
		var tempPassiveData = BattleFunc.getOneTempArr()
		if (changeData.passiveSkills) {
			for (var i in changeData.passiveSkills) {
				var level = changeData.passiveSkills[i];
				if (level > 0) {
					var skill = this.getSkillById(i, BattleConst.skill_kind_passive);
					if (skill) {
						hasPassiveChange = true;
						//扣除这个被动的buff 因为后面会重算
						if (skill.isActive) {
							PassiveSkillTrigger.useSelfPassiveAttr(this, skill as PassiveSkillData, -1, true);
						}

						skill.updateLevel(changeData.passiveSkills[i]);
						//重新插入这个技能的被动.(先移除后插入)
						// this.controler.insterGlobalPassive(skill as PassiveSkillData);
						tempPrassArr.push(skill);
					}
				}

			}
		}

		//如果等级或者进阶次数变化了 获得被动技能变化了 需要重新算属性
		if (changeData.level || changeData.advance || hasPassiveChange) {
			var oldHp: number = 0;
			//那么可能需要重算数据了
			if (changeData.level) {
				oldHp = this.maxHp;
			}

			this.attrData.updateData(this._data);
			if (changeData.level) {
				var addHp = this.maxHp - oldHp;
				if (addHp > 0) {
					if (this.hp == 0) {
						BattleLogsManager.battleEcho("死亡状态升级不回血")
					} else {
						//升级增加血量
						this.changeHp(addHp);
					}

				}
			}
			//给这个角色执行全局被动
			PassiveSkillTrigger.runAllPassiveGlobalAttr(this.controler.globalPassiveAttrMap, this, 1);
			//被动属性需要放后设置. 否则升级加的属性会失效
			if (hasPassiveChange) {
				for (var s = 0; s < tempPrassArr.length; s++) {
					//重新添上这个被动的属性
					PassiveSkillTrigger.useSelfPassiveAttr(this, skill as PassiveSkillData, 1, false);
					this.controler.insterGlobalPassive(tempPrassArr[s]);
				}
			}

		}
		//缓存临时数组
		BattleFunc.cacheOneTempArr(tempPrassArr);
		BattleFunc.cacheOneTempArr(tempPassiveData);


		//如果 有技能变化
		if (changeData.normalSkills) {
			for (var i in changeData.normalSkills) {
				var level = changeData.normalSkills[i];
				if (level > 0) {
					var skill = this.getSkillById(i, BattleConst.skill_kind_noraml);
					if (skill) {
						skill.updateLevel(changeData.normalSkills[i]);
					}
				}

			}
		}

		//最后在更新技能数据
		if (changeData.energySkill && changeData.energySkill.level) {
			var skill = this.energySkill;
			//更新大招等级
			this.energySkill.updateLevel(changeData.energySkill.level);
		}


	}


	//点击某个角色技能 是手动放还是自动放
	public onCheckGiveEnergySkill(isAuto: boolean = false) {
		var energySkill: BattleSkillData = this.energySkill;
		//如果是免cd的
		if (!BattleDebugTool.isNoHeroCd()) {
			if (this.energy < this.maxEnergy) {
				return false;
			}
			//如果是未激活
			if (!energySkill.isActive) {
				return false;
			}
			//如果有控制类型的buff 不能执行
			if (this.ctrlBuffBit & BuffTrigger.ctrlBuffBit) {
				return false;
			}

			//自动放的需要加大招距离限制
			if (isAuto) {
				if (!this.checkIsInAttackDis()) {
					return false;
				}
			}
			var tempArr = energySkill.tempChooseArr;
			//获取能够检测到的人数量
			ChooseTrigger.getSkillTargetRole(this, energySkill, energySkill.chooseTartgetCfg, tempArr);
			if (tempArr.length == 0) {
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_battle_emptyskill"));
				return false;
			}

			if (energySkill.leftSkillCd > 0) {
				return false;
			}
		}

		// 打断自身技能
		this.interruptSkill(this);
		this.giveOutSkill(energySkill);
		return true;
	}


}