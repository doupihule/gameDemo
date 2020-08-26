import BaseFunc from "../../../framework/func/BaseFunc";

export default class GuideFunc extends BaseFunc {
	private static _instance: GuideFunc;

	public static get instance(): GuideFunc {
		if (!this._instance) {
			this._instance = new GuideFunc();
		}
		return this._instance;
	}

	getCfgsPathArr() {
		return [
			{name: "Guide_json"},
			{name: "TranslateGuide_json"},
		]
	}

	/**根据id获取更新数据*/
	public getGuideInfo(id: number): any {
		// return this.cfg[id]["1"];
		return this.getCfgDatas("Guide_json", id);
	}
}