import BaseFunc from "../../../framework/func/BaseFunc";
import GameTools from "../../../utils/GameTools";
import UserExtModel from "../model/UserExtModel";
import TalentSkillsModel from "../model/TalentSkillsModel";
import GlobalParamsFunc from "./GlobalParamsFunc";

/**天赋技能相关 */
export default class TalentFunc extends BaseFunc {

	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "Talent_json"},
			{name: "TalentSkill_json"},
			{name: "TalentUpdate_json"},
		];
	}

	static _instance: TalentFunc;
	static get instance() {
		if (!this._instance) {
			this._instance = new TalentFunc();
		}
		return this._instance;
	}

	getAllTalent() {
		return this.getAllCfgData("Talent_json");
	}

	getTalentById(id) {
		return this.getCfgDatas("Talent_json", id);
	}

	getTalentByTwo(id1, id2) {
		return this.getCfgDatasByKey("Talent_json", id1, id2);
	}

	//根据天赋id和等级获得talentInfo
	getTalentInfoByLevel(talentId, talentLevel) {
		return this.getCfgDatas("TalentSkill_json", talentId)[talentLevel];
	}

	//根据升级次数获取TalentUpdate详情
	getTalentUpdateInfo(num) {
		return this.getCfgDatas("TalentUpdate_json", num);
	}

	//判断天赋技能是否可以升级
	checkTalentSkillUpdate() {
		var needLevel = this.getTalentUpdateInfo(UserExtModel.instance.getTalentSkillUpgradeNum() + 1).needLevel;
		if (UserExtModel.instance.getMaxLevel() < needLevel) {
			return [false, needLevel];
		} else {
			return true;
		}
	}

	//判断天赋技能是否全部满级
	checkTalentSkillLevelFull() {
		var talentInfo = TalentFunc.instance.getAllTalent();
		var userTalentData = TalentSkillsModel.instance.getTalentSkills();
		var maxLevel = GlobalParamsFunc.instance.getDataNum("talentSkillMaxLeve");

		for (var i in talentInfo) {
			//判断是否有没有解锁的技能
			if (!userTalentData[i]) {
				return false;
			}
			//判断技能是否满级
			if (userTalentData[i] < maxLevel) {
				return false;
			}
		}

		return true;
	}

	//根据权重随机升级的talentId
	getRandomTalentId() {
		var talentInfo = Object.keys(this.getAllCfgData('Talent_json'));
		var weightArr = [];
		for (var i = 0; i < talentInfo.length; i++) {
			var skilllevel = TalentSkillsModel.instance.getTalentSkillLevel(talentInfo[i]);
			if (skilllevel >= GlobalParamsFunc.instance.getDataNum("talentSkillMaxLeve")) {
				continue;
			}
			var skillInfo = this.getTalentInfoByLevel(talentInfo[i], skilllevel + 1);
			weightArr.push(talentInfo[i] + "," + skillInfo.skillUpdateWeight);
		}
		var randResult = GameTools.getWeightItem(weightArr);
		return randResult[0];
	}
}
