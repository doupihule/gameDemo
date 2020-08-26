import BattleFunc from "../../sys/func/BattleFunc";
import TableUtils from "../../../framework/utils/TableUtils";
import SkillActionData from "./SkillActionData";
import BattleConst from "../../sys/consts/BattleConst";
import BattleDebugTool from "../controler/BattleDebugTool";
import FogFunc from "../../sys/func/FogFunc";

//战斗中的技能数据对象. 抽象成数据是为了方便访问以及数据管理
export default class BattleSkillData {
	public cfgData: any;
	public skillData: any;
	//技能升级对应的属性
	public skillPropParams: any[];
	//对应的技能扩展ai;
	public skillExpand: any;
	public _skillId: string;

	//存储的技能效果数组
	public skillActionArr: SkillActionData[];
	//技能载体角色.
	public owner: any;

	//技能类型  1普攻 2小技能 3大招 4被动
	public skillType: number;

	//剩余技能cd
	public leftSkillCd: number = 0;
	//技能cd
	protected _cfgSkillCd: number = 0;
	//技能标签
	public skillLabel: any[];

	//选择目标数据
	public chooseTartgetCfg: any;
	public level: number;
	public isActive: boolean = false;
	//数值依赖的技能. 比如临时附加的被动技能的一些数值是会依赖主动技的
	public relyonSkill: any;

	//临时选中的敌人数组
	public tempChooseArr: any[]

	//技能播放完毕后的停顿时间
	public skillWaitFrame: number = 0;
	private parentLifeType;


	//传入技能id 和等级 skillType 主动技还是被动技
	public constructor(skillId: string, level: number, role: any, skillType: number, relyonSkill: any = null, lifeType = null) {
		this._skillId = skillId;
		this.owner = role;
		this.skillType = skillType;
		this.relyonSkill = relyonSkill;
		this.parentLifeType = lifeType
		this.updateLevel(level);
		this.tempChooseArr = [];

	}

	//更新等级
	public updateLevel(level: number) {
		if (this.parentLifeType == BattleConst.LIFE_PLAYER) {
			this.isActive = true;
		} else {
			if (level == 0) {
				level = 1
				this.isActive = false;
			} else {
				this.isActive = true;
			}
		}
		//如果是技能免cd的 那么就强制激活所有技能
		if (BattleDebugTool.isNoHeroCd()) {
			this.isActive = true;
		}

		if (!this.isActive) {
			this.level = level;
		} else {
			//如果等级没有变化 不执行
			if (this.level == level) {
				return;
			}
		}

		this.level = level;

		//技能参数
		if (this.relyonSkill) {
			this.skillPropParams = BattleFunc.instance.getCfgDatasByMultyKey("SkillUpdate", this.relyonSkill._skillId, String(this.relyonSkill.level), "params", true);
		} else {
			this.skillPropParams = BattleFunc.instance.getCfgDatasByMultyKey("SkillUpdate", this._skillId, String(level), "params", true);

		}

		//被动技走单独的配置
		if (this.skillType != BattleConst.skill_kind_passive) {
			this.cfgData = BattleFunc.instance.getCfgDatas("Skill", this._skillId);
			var value = this.cfgData.action && this.cfgData.action[4];

			if (value) {
				this.skillWaitFrame = BattleFunc.instance.turnMinisecondToframe(Number(value));
			}

			this.chooseTartgetCfg = BattleFunc.instance.getCfgDatas("Target", String(this.cfgData.target));
			if (!this.skillLabel) {
				if (this.cfgData.action) {
					this.skillLabel = TableUtils.copyOneArr(this.cfgData.action);
					for (var i = 1; i < this.skillLabel.length; i++) {
						this.skillLabel[i] = Number(this.skillLabel[i]);
					}
				}

			}

			//效果ID1,效果触发延迟时间,效果触发次数,效果触发间隔,每次触发获得的能量值
			var skillEffect: any[] = this.cfgData.skillEffect
			if (skillEffect) {
				if (!this.skillActionArr) {
					this.skillActionArr = []
					for (var i = 0; i < skillEffect.length; i++) {
						var info = skillEffect[i];
						var actionData: SkillActionData = new SkillActionData(info[0], this.owner, this, Number(info[1]), Number(info[2]), Number(info[3]), Number(info[4]), 0);
						this.skillActionArr.push(actionData);
					}
				} else {
					//否则只需要更新数据
					for (var i = 0; i < skillEffect.length; i++) {
						var actionData: SkillActionData = this.skillActionArr[i];
						actionData.updateData(this.owner, this);
					}
				}

			}
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR && FogFunc.warHomeSkillCd[this._skillId]) {
				this._cfgSkillCd = Math.ceil(FogFunc.warHomeSkillCd[this._skillId] * BattleFunc.miniSecondToFrame);
			} else {
				if (this.cfgData.cdTime) {
					this._cfgSkillCd = Math.ceil(this.cfgData.cdTime * BattleFunc.miniSecondToFrame);
				}
			}
		}
	}


	//根据id获取skillaction
	public getActionById(id: string) {
		for (var i = 0; i < this.skillActionArr.length; i++) {
			var act = this.skillActionArr[i];
			if (act.skillEffectId == id) {
				return act;
			}
		}
		return null;
	}


	//重置数据
	public resetData() {
		this.leftSkillCd = 0;
	}


	//获取cd
	public get skillInitCd() {
		return Math.ceil(this._cfgSkillCd * this.owner.attrData.getSkillCdAdded(this._skillId) / 10000);
	}


	//获取技能参数
	public getSkillValue(key: string, tag: string = null) {
		if (!this.skillPropParams) {
			return Number(key);
		}
		return BattleFunc.instance.getSkillValueByParams(key, this.relyonSkill && this.relyonSkill._skillId || this._skillId, this.level, this.skillPropParams, tag);

	}

	//销毁
	public dispose() {
		this.skillData = null;
		this.skillData = null;
		this.skillPropParams = null;
	}

}