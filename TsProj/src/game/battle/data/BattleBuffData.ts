import BattleFunc from "../../sys/func/BattleFunc";

export default class BattleBuffData {
	public _id: string;
	public cfgData: any;
	//剩余时间
	public leftFrame: number = -1;

	//生效次数
	public leftTimes: number = 0;
	//生效间隔
	public interval: number = 0;


	//增益还是减益
	public type: number = 1;
	public group: number = 1;

	//逻辑效果类型
	public logicType: number;

	//叠加层数
	public layerNums: number = 1

	public repeatNum: number

	//逻辑效果参数 二维数组
	public skillLogicalParams: any[];
	//buff的作用着
	public onwer: any;
	public skillAction: any;

	public objectRange: number;

	public chooseTartgetCfg: any;


	public constructor(id: string) {
		this._id = String(id);
		this.cfgData = BattleFunc.instance.getCfgDatas("Buff", id);
		this.type = this.cfgData.type;
		this.logicType = this.cfgData.logicType;
		this.group = this.cfgData.group;
		this.interval = Number(this.cfgData.interval);


		if (this.interval > 0) {
			this.interval = BattleFunc.instance.turnMinisecondToframe(this.interval);
		}
	}

	//设置数据 buff数据也是会复用的 repeatNum:叠加层数
	public setData(owner: any, targetSkillAction: any, repeatNum: number = 1) {
		this.onwer = owner;
		this.layerNums = repeatNum;

		var targetSkill = targetSkillAction.relyonSkill || targetSkillAction.skill;
		this.leftFrame = targetSkill.getSkillValue(this.cfgData.existTime);
		if (this.leftFrame != -1) {
			if (this.leftFrame) {
				this.leftFrame = BattleFunc.instance.turnMinisecondToframe(this.leftFrame);
			} else {
				this.leftFrame = 0;
			}

		}
		this.skillAction = targetSkillAction;
		var skillDataId = this.skillAction.cfgData.numId;
		var targetLevel = owner.getCfgSkillLevel(skillDataId);
		this.leftTimes = Number(this.cfgData.effectiveTimes);
		var tempArr = this.cfgData.logicParams
		//获取这个技能效果的作用值  比如加攻击力,是读技能表的还是读自身的等.
		var tagStr = "Buff:" + this._id
		if (tempArr) {
			this.skillLogicalParams = []
			for (var i = 0; i < tempArr.length; i++) {
				this.skillLogicalParams[i] = [];
				var temp = tempArr[i];
				for (var s = 0; s < temp.length; s++) {
					// this.skillLogicalParams[i][s] = targetSkill.getSkillValue(temp[s],tagStr);
					this.skillLogicalParams[i][s] = BattleFunc.instance.getSkillValueByParams(temp[s], skillDataId, targetLevel, null, tagStr);
				}
			}
		}
	}


	//给buff叠加
	public addLayer(value: number) {
		this.layerNums += value;
		if (this.layerNums > this.cfgData.maxLayer) {
			this.layerNums = this.cfgData.maxLayer
		}
	}

	//获取最大层数
	public getMaxLayer() {
		return this.cfgData.maxLayer || 1;
	}


}