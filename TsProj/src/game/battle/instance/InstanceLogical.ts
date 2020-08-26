import InstanceMove from "./InstanceMove";
import InstanceLife from "./InstanceLife";
import BattleConst from "../../sys/consts/BattleConst";
import BattleSkillData from "../data/BattleSkillData";
import SkillActionData from "../data/SkillActionData";
import BattleFunc from "../../sys/func/BattleFunc";
import ChooseTrigger from "../trigger/ChooseTrigger";
import SkillActionTrigger from "../trigger/SkillActionTrigger";
import BuffTrigger from "../trigger/BuffTrigger";
import GameConsts from "../../sys/consts/GameConsts";
import ConditionTrigger from "../trigger/ConditionTrigger";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import SkillExpandTrigger from "../trigger/SkillExpandTrigger";

export default class InstanceLogical extends InstanceLife {

	//这个类主要用来做逻辑和表现的.比如被击飞 挨打

	//剩余等待帧数  开始入场后 设置一个剩余等待时间 等待时间过了之后才可以入场 . 设置给单个角色的目的是为了灵活控制.还可以使用在其他地方
	public leftWaitFrame: number = 0;

	//---------------------------ai逐帧刷新相关-----------------------------------------
	public doAiLogical() {
		super.doAiLogical();
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR && BattleFunc.curGameState != BattleConst.WARSTATE_INFIGHT) return;
		//如果等待帧数大于0 return
		if (this.leftWaitFrame > 0) {
			this.leftWaitFrame--;
			return;
		}
		//判断是移动还是攻击
		this.checkMoveOrAttack();

		//刷新一些cd
		this.updateCds();
		this.updateAutoMissHp();
		this.updateTxtCreateFrame();
	}

	//更新当前文本创建的时间
	updateTxtCreateFrame() {
		if (this.txtUpdateCount > 0) {
			this.txtUpdateCount--;
		}
	}

	//更新一些cd
	protected updateCds() {
		this.updateSkillCd();
		if (this.skillWaitFrame > 0) {
			this.skillWaitFrame--;
		}

		//能量恢复
		if (this.updateCount % GameConsts.gameFrameRate == 0) {
			if (this.energyResumeValue > 0 && this.energy < this.maxEnergy) {
				this.changeEnergy(this.energyResumeValue)
			}

		}
	}

	/**更新建筑的自动掉血 */
	updateAutoMissHp() {
		if (this.lifeType != BattleConst.LIFE_LANDBUILD) return;
		if (this.hp <= 0) return;
		if (this.buildCheckFrame <= 0) {
			this.buildCheckFrame = BattleFunc.buildAutoFrame;
			//每到扣血帧数扣血
			this.changeHp(-this.reduceBlood)
		}
		this.buildCheckFrame--;


	}


	//更新技能cd
	protected updateSkillCd() {
		var cdcheck = 20;
		//每半秒 可以提升运算性能
		if (this.updateCount % cdcheck != 0) {
			return;
		}
		//更新普通技能
		for (var i = 0; i < this.normalSkills.length; i++) {
			var skill = this.normalSkills[i];
			if (skill.leftSkillCd > 0) {
				skill.leftSkillCd -= cdcheck;
				if (skill.leftSkillCd < 0) {
					skill.leftSkillCd = 0;
				}
			}
		}
		//被动技能
		if (this.passiveSkills) {
			for (var i = 0; i < this.passiveSkills.length; i++) {
				var skill2 = this.passiveSkills[i];
				if (skill2.leftSkillCd > 0) {
					skill2.leftSkillCd -= cdcheck;
					if (skill2.leftSkillCd < 0) {
						skill2.leftSkillCd = 0;
					}
				}
			}
		}

		//大招
		if (this.energySkill) {
			if (this.energySkill.leftSkillCd > 0) {
				this.energySkill.leftSkillCd -= cdcheck;
				if (this.energySkill.leftSkillCd < 0) {
					this.energySkill.leftSkillCd = 0;
				}
			}
		}
	}

	//检测移动或者攻击
	public checkMoveOrAttack(force: boolean = false) {
		if (this.controler && this.controler.isGameOver) return;
		//没有生命了不能检测攻击
		if (this.hp <= 0) {
			return;
		}
		//如果敌方没人了不执行
		if (this.toCampArr.length == 0) {
			return;
		}

		//如果 有强控类型的buff 表示不能移动
		if (this.ctrlBuffBit & BuffTrigger.forceCtrlBuffBit) {
			return;
		}
		//如果正在施法或者挨打或者死亡期间
		if (this.label != BattleConst.LABEL_IDLE && this.label != BattleConst.LABEL_WALK) {
			return;
		}
		//20帧检测一次
		if ((!force) && this.updateCount % 3 != 0) {
			return;
		}
		//如果是有其他运动行为的
		if (this.movePointType != InstanceMove.moveType_none) {
			return;
		}

		this.checkAttack()

	}


	//---------------------------攻击交互相关-----------------------------------------


	//当敌方阵营人死光了 给子类重写
	public onToCampAllDied() {
		if (this.camp == 2) {
			if (this._myState != BattleConst.state_jump) {
				this.initStand()
				this.resumeIdleAction()

			}
		} else {
			//暂时什么都不做. 等下一波
		}
	}


	//我被受击  dmgresult:[结果类型(闪避,暴击),伤害值,额外伤害]
	public onBeHit(attacker: InstanceLogical, skill: BattleSkillData, skillAction: SkillActionData, dmgResult: any[], isFanshang: boolean = false) {
		//如果是无敌状态 不执行
		if (this.invincibleNum > 0) {
			return;
		}
		//记录上一次攻击自己的人
		this.lastAttacker = attacker;
		var rt = dmgResult[0];
		var dmgValue = dmgResult[1];
		if (this.camp == 2) {
			this.controler.statistControler.onDmage(dmgValue);
		}
		var otherValue = dmgResult[2];
		//护盾抵消的伤害
		var resistValue: number = 0;
		var leftDmg = dmgValue;
		if (rt != BattleConst.damage_miss) {
			//如果有护盾的
			if (this.shieldInfoArr.length > 0) {
				//计算抵消伤害
				for (var i = this.shieldInfoArr.length - 1; i >= 0; i--) {
					var value = this.shieldInfoArr[i].value;
					if (value > leftDmg) {
						//护盾抵挡.
						this.shieldInfoArr[i].value -= dmgValue;
						leftDmg = 0;
						resistValue += dmgValue
						break;
					} else {
						this.shieldInfoArr[i].value = 0;
						leftDmg -= value;
						resistValue += value;
						//销毁这个buff  销毁时机是 护盾为0
						this.clearOneBuff(this.shieldInfoArr[i].buff, BattleConst.buff_remove_hudun);
					}
				}
			}
		}


		if (!isFanshang) {
			//判断攻击者是否有反伤
			var fanshangValue = this.attrData.getOneAttr(BattleConst.attr_fanshang);
			if (fanshangValue > 0) {
				//那么让攻击者承受反伤
				BattleLogsManager.debugByRole(this.dataId, "造成反伤,反伤率", fanshangValue, "受到的伤害:", dmgValue);
				attacker.onBeFanshang(Math.ceil(fanshangValue * dmgValue / 10000), this);
			}
		}


		//让自己掉血
		this.changeHp(-leftDmg);
		if (this.hp <= 0) {
			attacker.killOneRole(this);
		}
		if (leftDmg == 0 && resistValue > 0) {
			this.controler.performanceControler.createNumEff(BattleConst.effect_label_hudun, dmgValue, this);
		} else {
			if (rt == BattleConst.damage_baoji) {
				this.controler.performanceControler.createNumEff(BattleConst.effect_label_crit, dmgValue, this);
			} else if (rt == BattleConst.damage_miss) {
				this.controler.performanceControler.createNumEff(BattleConst.effect_label_miss, 0, this);
			} else {
				this.controler.performanceControler.createNumEff(BattleConst.effect_label_dmg, dmgValue, this);
			}
		}

		//闪红
		this.hitedflash();

	}

	//反伤扣血
	public onBeFanshang(dmg: number, fromRole: InstanceLogical) {
		//有可能这个时候我已经挂了
		if (this.hp == 0) {
			// 触发反伤的时候刚好死亡了
			BattleLogsManager.battleEcho("触发反伤时 死亡了-", this.dataId);
			return;
		}
		//反生不能致死
		if (dmg > this.hp) {
			dmg = this.hp - 1
		}
		var tempArr = BattleFunc.getOneTempArr();
		tempArr[0] = BattleConst.damage_normal
		tempArr[1] = dmg;
		this.onBeHit(fromRole, null, null, tempArr, true);
		BattleFunc.cacheOneTempArr(tempArr);

	}


	//被治疗
	public onBeTrit(attacker: InstanceLogical, skill: BattleSkillData, skillAction: SkillActionData, dmgResult: any[]) {
		var rt = dmgResult[0];
		var value = dmgResult[1];
		//如果血量为0 治疗不生效.必须先复活
		if (this.hp <= 0) {
			BattleLogsManager.battleEcho("在血量为0的情况下收到治疗效果了,id:", this.dataId, "skillId:", skill._skillId);
			return;
		}
		//让自己回血掉血
		this.changeHp(value);
		if (rt == BattleConst.damage_baoji) {
			this.controler.performanceControler.createNumEff(BattleConst.effect_label_tritCrit, value, this);
		} else {
			this.controler.performanceControler.createNumEff(BattleConst.effect_label_trit, value, this);
		}
	}

	//吸血
	public onXixue(value: number) {
		if (this.hp <= 0) {
			BattleLogsManager.battleEcho("在血量为0的情况下吸血了:", this.dataId, "skillId:", value);
			return;
		}
		//让自己回血掉血
		this.changeHp(value);
		this.controler.performanceControler.createNumEff(BattleConst.effect_label_trit, value, this);
	}

	//当我击杀了人
	public killOneRole(beKilled: InstanceLogical) {
		//击杀恢复能量
		this.changeEnergy(this.killResumeEnergy);
	}


	//重写落地函数
	protected onHitLand() {
		//如果有击飞或者击退效果
		if (this.checkHasOneBuff(BuffTrigger.buff_logical_jifei)) {
			this.initMove(this.speed.x, 0, this.speed.z, true);
		}
	}


	//------------------------------技能检测相关--------------------------------------------
	//-------------------------------------------------------------------------------------
	//------------------------------技能检测相关--------------------------------------------


	//检测攻击
	public checkAttack() {
		//如果技能停顿时间还没到 那么不执行 超级武器不算
		var tempArr = BattleFunc.getOneTempArr();
		ChooseTrigger.chooseSkillToOut(this, tempArr);
		var rt: number = tempArr[0];
		//如果一个可攻击的技能都没.那么朝最近的目标运动 理论上不应该存在
		if (rt == -2) {
			BattleLogsManager.battleWarn("没有可攻击的技能,不应该走到这里来,id:", this.dataId, "lifeType:", this.lifeType);
			this.moveFollowNearRole(null);
			return;
		}
		var skill: BattleSkillData = tempArr[1];
		if (this.skillWaitFrame > 0) {
			rt = -2;
		} else {
			//如果是有技能的
			if (rt == 0) {
				this.initStand();
				this.giveOutSkill(skill);
			} else if (rt == -1) {
				tempArr.length = 0;
				ChooseTrigger.getSkillTargetRole(this, skill, skill.chooseTartgetCfg, tempArr, null, null, true);
				if (this.checkCanMove()) {
					if (tempArr.length > 0) {
						var nearHero = tempArr[0];
						//先判断是否在battledis
						var disx = nearHero.pos.x - this.pos.x;
						var absDis = Math.abs(disx);
						//判断距离是否在保持距离内  基地和建筑不会移动
						if (absDis > this.battleKeepDis) {
							if (this._myState != BattleConst.state_jump) {
								this.initMove(this.walkSpeed * absDis / disx)
								this.playAction(BattleConst.LABEL_WALK, true);
							}
							return;
						}
					}
				}
				//基地和建筑不能移动
				if (skill && skill.leftSkillCd == 0) {
					if (this.checkCanMove()) {
						this.moveFollowNearRole(tempArr[0]);
					}
				}

			}

		}
		BattleFunc.cacheOneTempArr(tempArr);
		//如果没有可攻击目标  那么就闲置.
		if (rt == -2) {
			if (this._myState == BattleConst.state_move) {
				this.initStand();
				this.playAction(BattleConst.LABEL_IDLE, true);
			}
		}


		return rt
	}


	//释放技能  ignoreScale 忽略战斗速度缩放值 默认不忽略
	public giveOutSkill(skill: BattleSkillData) {
		//如果有控制类型的buff 不能执行
		if (this.ctrlBuffBit) {
			return false;
		}
		this.currentSkill = skill;
		if (skill == this.energySkill) {
			//把能量清空
			this.changeEnergy(-this.maxEnergy);
			if (this.blackFrame > 0) {
				this.controler.performanceControler.showBlackScreen(this, this.blackFrame);
			}
		}
		var skillSpeedValue = this.getSkillSpeedUpValue(skill._skillId);
		skill.leftSkillCd = this.getSkillLeftCd(skill);
		var skillLabel = skill.skillLabel;
		this.initStand();

		if (skillLabel) {
			//动作名;循环时长（毫秒，-1表示不循环）,循环开始时间,循环结束时间;结束后停顿时长
			var sysTime = Number(skillLabel[1])
			this.controler.clearCallBack(this, this.resumeIdleAction);
			if (sysTime == -1) {
				this.playAction(skillLabel[0], false);
				this.setAniPlaySpeed(skillSpeedValue);
			} else {
				this.setAniPlaySpeed(skillSpeedValue);
				this.playSpecialSysAction(skillLabel[0], sysTime, Number(skillLabel[2]), Number(skillLabel[3]), this.getActionFrame(skillLabel[0]))
			}


		}
		//额外参数：不独立特效 跟随角色
		var expandParams = {
			follow: BattleFunc.EFFECT_NOALLOW,
			ignoreScale: this.ignoreTimeScale
		}
		//播放技能特效
		this.createEffByParams(skill.cfgData.specialEffect, false, false, expandParams, skillSpeedValue);
		this.createSoundByParams(skill.cfgData.sound);
		SkillExpandTrigger.onCheckExpand(this, skill, skill.cfgData.expand, skill.tempChooseArr);
		//执行技能效果
		var skillActions = skill.skillActionArr;
		for (var i = 0; i < skillActions.length; i++) {
			var skillact = skillActions[i];
			this.controler.setLastCallBack(Math.round(skillact.delay / skillSpeedValue), Math.round(skillact.interval / skillSpeedValue), skillact.trigTimes, this.checkSkillEffect, this, skillact);
		}


	}

	//判断技能效果 被打断需要清除将要执行的 技能效果
	public checkSkillEffect(skillAction: SkillActionData) {
		//如果已经死亡了
		if (this.hp == 0) {
			BattleLogsManager.debugByRole(this.dataId, "检测的是死亡技", skillAction.skillEffectId);
			// return;
		}
		SkillActionTrigger.checkSkillAction(this, skillAction, null);

	}


	//被打断
	public interruptSkill(targetRole: InstanceLogical) {
		//如果当前有技能 那么就判定被打断
		if (this.currentSkill) {
			//技能被打断的时候 把打断者传递进去
			ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_offskill, this, BattleFunc.emptyArr, null, targetRole);
			this.controler.clearCallBack(this, this.checkSkillEffect)
			//取消音效播放
			this.controler.clearCallBack(this, this.playSound)
		}

	}

	//---------------------------其他交互ai----------------------------------------------

	// //进入下一波
	// public onEnterNextWave() {
	//     this.clearControlBuff();
	//     if (this._myState != BattleConst.state_jump) {
	//         // this.resumeIdleAction();
	//         //清除技能回调
	//         // this.controler.clearCallBack(this, this.checkSkillEffect);
	//         // this.initStand();
	//     }
	//     this.checkMoveOrAttack(true);
	// }


	//朝最近的敌人运动
	public moveFollowNearRole(targetRole: InstanceLogical) {
		//先判断是否有被嘲讽目标
		if (this.beTauntTargetInfo.target) {
			targetRole = this.beTauntTargetInfo.target
		}
		if (!targetRole) {
			targetRole = ChooseTrigger.chooseAbsNearRole(this, this.toCampArr);
		}
		if (!targetRole) {
			return;
		}
		var dx = targetRole.pos.x - this.pos.x;
		var dz = targetRole.pos.z - this.pos.z;
		//如果距离足够近了 那么不需要在走了 防止角色重叠 最少20像素
		if (dx * dx + dz * dz < 400) {
			this.initStand();
			this.playAction(BattleConst.LABEL_IDLE, true);
			return;
		}

		var ang = Math.atan2(dz, dx);
		var spdx = this.walkSpeed * Math.cos(ang);
		var spdz = this.walkSpeed * Math.sin(ang);
		this.initMove(spdx, 0, spdz);
		//播放行走动画
		this.playAction(BattleConst.LABEL_WALK, true);

	}

	//判断地方最前面一个人是否在站位距离内
	public checkIsInAttackDis() {
		var nearHero = ChooseTrigger.chooseNearRole(this, this.toCampArr);
		if (!nearHero) {
			return false;
		}
		var disx = nearHero.pos.x - this.pos.x;
		var absDis = Math.abs(disx);
		//判断距离是否在保持距离内
		if (absDis > this.battleKeepDis) {
			return false
		}
		return true;
	}

	//设置等待帧数
	public setWaitFrame(value: number) {
		this.leftWaitFrame = value;
	}


}