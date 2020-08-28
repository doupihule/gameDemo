import SkillActionData from "./SkillActionData";
import BattleFunc from "../../sys/func/BattleFunc";
import InstanceLogical from "../instance/InstanceLogical";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import ChooseTrigger from "../trigger/ChooseTrigger";
import SkillActionTrigger from "../trigger/SkillActionTrigger";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import SkillExpandTrigger from "../trigger/SkillExpandTrigger";
import InstanceBullet from "../instance/InstanceBullet";
import VectorTools from "../../../framework/utils/VectorTools";

/**
 * 战斗重点aoe对象数据.
 * 主要用来检测aoe敌人
 */
export default class BattleAoeData {

	public aoeId: string;
	public skillActionArr: SkillActionData[];
	public cfgData: any;
	//aoe相对目标
	public targetInstance: any;
	//目标子弹
	public targetBullet: any;
	public skill: any;
	public delayFrame: number = 0;
	public effectiveTimes: number = 0;
	public intervalFrame: number = 0;
	public existFrame: number = 0;
	public owner: InstanceLogical;
	public chooseTartgetCfg: any;
	public attacker;

	//独立特效扩展参数
	private static _aloneEffectExpandParams: any = {
		isAlone: true
	}

	//初始坐标
	public _initTargtPos: any;

	//初始化
	constructor(id: string) {
		this.aoeId = id;
		this.cfgData = BattleFunc.instance.getCfgDatas("AoeEffect", id);
		this.delayFrame = BattleFunc.instance.turnMinisecondToframe(this.cfgData.delayTime);
		this.intervalFrame = BattleFunc.instance.turnMinisecondToframe(this.cfgData.interval);
		this.existFrame = BattleFunc.instance.turnMinisecondToframe(this.cfgData.existTime);
		if (this.cfgData.target) {
			this.chooseTartgetCfg = BattleFunc.instance.getCfgDatas("Target", String(this.cfgData.target));
		}

		this.effectiveTimes = Number(this.cfgData.effectiveTimes);
		this._initTargtPos = VectorTools.createVec3();

	}

	//更新数据
	public setData(skillAction: SkillActionData, attacker) {
		this.owner = skillAction.owner;
		this.attacker = attacker
		this.skill = skillAction.skill
		if (!this.skillActionArr) {
			var actArr = this.cfgData.skillEffect;
			this.skillActionArr = [];
			for (var i = 0; i < actArr.length; i++) {
				var actionData: SkillActionData = new SkillActionData(actArr[i], skillAction.owner, skillAction.skill, 0, 1, 0, 0, 0);
				this.skillActionArr.push(actionData);
			}
		} else {
			for (var i = 0; i < this.skillActionArr.length; i++) {
				this.skillActionArr[i].updateData(skillAction.owner, skillAction.skill);
			}
		}
	}


	//执行aoe效果
	public doAoeAction(targetInstance: InstanceLogical, pos: any = null, targetBullet: InstanceBullet = null) {
		if (!pos) {
			pos = targetInstance.pos;
		}
		this._initTargtPos.x = pos.x
		this._initTargtPos.y = pos.y
		this._initTargtPos.z = pos.z
		this.targetInstance = targetInstance;
		this.targetBullet = targetBullet;
		//如果是子弹的.优先从子弹那里创建特效
		var expandParams = {
			ignoreScale: this.attacker.ignoreTimeScale
		}
		if (targetBullet) {
			targetBullet.createEffByParams(this.cfgData.specialEffect, false, false, expandParams);
		} else {
			//在目标身上播放特效
			targetInstance.createEffByParams(this.cfgData.specialEffect, false, false, expandParams);
		}

		//执行aoe 检测事件
		targetInstance.controler.setLastCallBack(this.delayFrame, this.intervalFrame, this.effectiveTimes, this.checkAoe, this)
		targetInstance.controler.setCallBack(this.existFrame, this.onAoeEnd, this);
		var chooseArr;
		var tempChooseArr

		if (this.cfgData.expand && this.cfgData.expand[0][0] == SkillExpandTrigger.EXPAND_TYLE_LINEEFFECT) {
			if (!this.chooseTartgetCfg) {
				chooseArr = this.skill.tempChooseArr;
			} else {
				tempChooseArr = BattleFunc.getOneTempArr();
				//选择aoe攻击目标
				ChooseTrigger.getAoeTargetRole(this, this.owner, this.targetInstance, tempChooseArr);
				chooseArr = tempChooseArr;
			}
		}
		//是否剔除目标本身
		if (chooseArr) {
			if (this.cfgData.type) {
				var index = chooseArr.indexOf(targetInstance);
				if (index != -1) {
					chooseArr.splice(index, 1);
				}
			}
		}
		SkillExpandTrigger.onCheckExpand(targetInstance, this.skill, this.cfgData.expand, chooseArr, true)
		if (tempChooseArr) {
			BattleFunc.cacheOneTempArr(tempChooseArr);
		}
	}

	//aoe结束
	protected onAoeEnd() {
		//把自己放入缓存数组
		this.targetInstance = null;
		PoolTools.cacheItem(PoolCode.POOL_AOEDATA + this.aoeId, this);
	}

	//检测aoe
	protected checkAoe() {
		if (!this.targetInstance) {
			BattleLogsManager.battleEcho("battle没有设置目标instance");
			return;
		}
		//执行aoe效果
		for (var i = 0; i < this.skillActionArr.length; i++) {
			var chooseArr;
			var tempChooseArr
			if (!this.chooseTartgetCfg) {
				chooseArr = this.skill.tempChooseArr;
			} else {
				tempChooseArr = BattleFunc.getOneTempArr();
				//选择aoe攻击目标
				ChooseTrigger.getAoeTargetRole(this, this.owner, this.targetInstance, tempChooseArr);
				chooseArr = tempChooseArr;
			}
			if (chooseArr.length > 0) {
				//是否剔除目标本身
				if (this.cfgData.type) {
					var index = chooseArr.indexOf(this.targetInstance);
					if (index != -1) {
						chooseArr.splice(index, 1);
					}
				}
				if (chooseArr.length > 0) {
					// 对所有被选中的目标直接执行效果
					SkillActionTrigger.checkSkillAction(this.owner, this.skillActionArr[i], chooseArr);
				}
			}
			if (tempChooseArr) {
				BattleFunc.cacheOneTempArr(tempChooseArr);
			}

		}
	}


}