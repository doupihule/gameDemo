import BaseFunc from "./BaseFunc";

/**
 * @author: NightmareRevisited
 * @project: hifive_basic
 * @file: Plaque
 * @time: 2019/10/14 10:37
 * @Software: WebStorm
 */
export default class PlaqueFunc extends BaseFunc {
	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "Plaque_json"},
		];
	}

	private static _instance: PlaqueFunc;
	static get instance() {
		if (!this._instance) {
			this._instance = new PlaqueFunc();
		}
		return this._instance;
	}

	getPlaqueInfoById(skinId) {
		return this.getCfgDatas("Plaque_json", skinId);
	}
}

