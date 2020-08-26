import BaseModel from "./BaseModel";
import TalentFunc from "../func/TalentFunc";


export default class TalentSkillsModel extends BaseModel {
	// 天赋技能列表：user.talentSkills
	// {
	//     1:2,//天赋位置：等级
	//     2:4,
	//  }
	public constructor() {
		super();
	}

	private static _instance: TalentSkillsModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new TalentSkillsModel()
		}
		return this._instance;
	}

	//初始化数据
	initData(d: any) {
		super.initData(d);
	}

	//更新数据
	updateData(d: any) {
		super.updateData(d);
	}

	//删除数据
	deleteData(d: any) {
		super.deleteData(d);
	}

	//获取已经解锁的天赋技能列表
	getTalentSkills() {
		return this._data || {};
	}

	//获取某个天赋技能的等级
	getTalentSkillLevel(talentId) {
		if (!this._data || !this._data[talentId]) {
			return 0;
		}
		return this._data[talentId];
	}

	//判断是否能够升级天赋
	checkTalentRedPoint() {

	}

	getBuff() {
		var userSkillData = this.getTalentSkills();
		var buff = {}
		for (var skillId in userSkillData) {
			var skillInfo = TalentFunc.instance.getTalentInfoByLevel(skillId, userSkillData[skillId]);
			buff[skillInfo.attributeType] = (buff[skillInfo.attributeType] || 0) + skillInfo.attributeNub;
		}
		return buff;
	}
}
