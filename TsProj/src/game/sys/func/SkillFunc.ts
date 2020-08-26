import BaseFunc from "../../../framework/func/BaseFunc";
import GameUtils from "../../../utils/GameUtils";

/**技能相关 */
export default class SkillFunc extends BaseFunc {
	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "Skill_json"},
		];
	}

	static _instance: SkillFunc;
	static get instance() {
		if (!this._instance) {
			this._instance = new SkillFunc();
		}
		return this._instance;
	}

	getSkillDataById(id1, ignore = false) {
		return this.getCfgDatas("Skill_json", id1, ignore);
	}

	getSkillDataByTwoId(id1, id2, ignore = false) {
		return this.getCfgDatasByKey("Skill_json", id1, id2, ignore);
	}

	getSkillInfoById(SkillId) {
		return this.getCfgDatas("Skill_json", SkillId);
	}

	/**获取显示的属性值 */
	getShowParamValue(param) {
		var value;
		switch (Number(param[0])) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				value = param[1];
				if (Number(param[1]) > 10000) {
					value = GameUtils.getShowNum(Number(param[1]));
				}
				break;
			case 8:
			case 9:
				value = Number(param[1]) / 100 + "%";
				break;
		}
		return value;
	}

	getSkillIcon(icon) {
		return "uisource/skill/skill/" + icon + ".png";
	}
}
