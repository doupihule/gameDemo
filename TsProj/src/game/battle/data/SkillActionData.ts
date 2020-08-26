import BattleFunc from "../../sys/func/BattleFunc";
import LogsManager from "../../../framework/manager/LogsManager";


//技能效果数据
export default class SkillActionData {
	public cfgData: any;
	public skillEffectId: string;

	//逻辑效果参数
	public skillLogicalParams: any[];
	public targetSkill: any;
	//触发条件;是二维数组 [ [conditionId,condiitionId ]...]
	public condition: any[];

	//触发次数
	public trigTimes: number = 0;

	//延迟时间
	public delay: number = 0;
	//触发间隔帧
	public interval: number = 0;

	//恢复的能量
	public resumeEnergy: number = 0;

	//选择目标配置
	public chooseTartgetCfg: any;

	//当前的技能对象
	public skill: any;
	//依赖的技能
	public relyonSkill: any;
	public owner: any;

	//触发时机
	public opportunity: number = 0;

	//临时选择的数组
	public tempChooseArr: any[];

	//技能效果id
	public constructor(id: string, owner: any, skill: any, delay: number, trigTimes: number, interval: number, resumeEnergy: number, opportunity: number = 0, relyOnSill: any = null) {
		this.skillEffectId = id;
		//存储触发时机
		this.opportunity = opportunity;
		this.trigTimes = trigTimes;
		this.delay = BattleFunc.instance.turnMinisecondToframe(delay);
		this.interval = BattleFunc.instance.turnMinisecondToframe(interval);
		this.resumeEnergy = resumeEnergy;
		this.cfgData = BattleFunc.instance.getCfgDatas("SkillEffect", id);
		this.tempChooseArr = [];

		//更新数据
		this.updateData(owner, skill, relyOnSill);
		this.condition = this.cfgData.condition;
	}

	//刷新数据
	public updateData(owner: any, skill: any, relyonSkill: any = null) {
		if (!skill) {
			LogsManager.echo("noSkill------------------")
		}
		//存储当前的技能对象
		this.skill = skill;
		this.relyonSkill = relyonSkill;
		this.owner = owner;

		//选择目标需要走依赖技能
		if (!this.cfgData.target) {
			this.chooseTartgetCfg = null;
		} else {
			this.chooseTartgetCfg = BattleFunc.instance.getCfgDatas("Target", String(this.cfgData.target));
		}

		//获取这个技能效果的作用值  比如加攻击力,是读技能表的还是读自身的
		var tempArr = this.cfgData.logicParams
		if (tempArr) {
			if (!this.skillLogicalParams) {
				this.skillLogicalParams = []
			}
			var targetSkillId = String(this.cfgData.numId)
			var tagStr = "SkillEffect:" + this.skillEffectId;
			//如果自己配置的数值
			if (targetSkillId == this.skill._skillId) {
				for (var i = 0; i < tempArr.length; i++) {
					if (!this.skillLogicalParams[i]) {
						this.skillLogicalParams[i] = [];
					}

					var temp = tempArr[i];
					for (var s = 0; s < temp.length; s++) {
						this.skillLogicalParams[i][s] = this.skill.getSkillValue(temp[s], tagStr)
					}
				}
			} else {
				//读取角色对应技能等级的数值
				var level = this.owner.getCfgSkillLevel(targetSkillId);
				for (var i = 0; i < tempArr.length; i++) {
					if (!this.skillLogicalParams[i]) {
						this.skillLogicalParams[i] = [];
					}
					var temp = tempArr[i];
					for (var s = 0; s < temp.length; s++) {
						this.skillLogicalParams[i][s] = BattleFunc.instance.getSkillValueByParams(temp[s], targetSkillId, level, null, tagStr);
					}
				}


			}


		}
	}

}