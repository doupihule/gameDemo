import BattleFunc from "../../sys/func/BattleFunc";

export default class BattleConditionData {
	public _id: string;
	public cfgData: any;
	public conditionLogicalParams: any[];
	public type: number; //条件类型
	constructor(id: string) {
		this._id = id;
		this.cfgData = BattleFunc.instance.getCfgDatas("Condition", id);
		this.type = this.cfgData.type;
	}

	//设置数据
	public setData(skill: any) {
		var tempArr = this.cfgData.params
		if (!this.conditionLogicalParams) {
			this.conditionLogicalParams = [];
		}

		//获取这个技能效果的作用值  比如加攻击力,是读技能表的还是读自身的等.
		if (tempArr) {
			this.conditionLogicalParams = []
			var tagStr = "Condition:" + this._id
			for (var i = 0; i < tempArr.length; i++) {
				if (!this.conditionLogicalParams[i]) {
					this.conditionLogicalParams[i] = []
				}
				var temp = tempArr[i];
				for (var s = 0; s < temp.length; s++) {
					this.conditionLogicalParams[i][s] = skill.getSkillValue(temp[s], tagStr)
				}
			}
		}
	}

}