import BaseFunc from "../../../framework/func/BaseFunc";
import GameTools from "../../../utils/GameTools";

/**怪物相关 */
export default class MonsterFunc extends BaseFunc {
	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "Monster"},
			// { name: "MonsterName" },
			{name: "Role"},
		];
	}

	static _instance: MonsterFunc;
	static monsterIndex = 1;

	static get instance() {
		if (!this._instance) {
			this._instance = new MonsterFunc();
		}
		return this._instance;
	}

	/**
	 * 获取指定怪物某个属性
	 */
	getMonsterModelById(id) {
		var monsterInfo = this.getCfgDatas("Monster", id);
		return this.getCfgDatasByKey("Role", monsterInfo.level, "model");
	}

	/**
	 * 获取Monster的Role基础信息
	 * @param id monsterid
	 */
	getMonsterRoleById(id, level) {
		return this.getCfgDatasByKey("Monster", id, level);
	}

	getMonsterNameList() {
		var allList = this.getAllCfgData("MonsterName");
		var length = 0;
		for (var index in allList) {
			length++;
		}
		var id1 = GameTools.getRandomInt(1, length);
		var id2 = GameTools.getRandomInt(1, length);
		while (id2 == id1) {
			id2 = GameTools.getRandomInt(1, length);
		}
		var id3 = GameTools.getRandomInt(1, length);
		while (id3 == id1 || id3 == id2) {
			id3 = GameTools.getRandomInt(1, length);
		}
		return [allList[id1].name, allList[id2].name, allList[id3].name];
	}
}
