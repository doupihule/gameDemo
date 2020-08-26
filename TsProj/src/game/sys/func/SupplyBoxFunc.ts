import BaseFunc from "../../../framework/func/BaseFunc";

export default class SupplyBoxFunc extends BaseFunc {

	getCfgsPathArr() {
		return [
			{name: "LevelBox_json"},
		];
	}

	static _instance: SupplyBoxFunc;
	static get instance() {
		if (!this._instance) {
			this._instance = new SupplyBoxFunc();
		}
		return this._instance;
	}

	private _dataArr: any[] = null;

	getInfo() {
		return this.getAllCfgData("LevelBox_json");
	}

	getInfoByArenaId(arenaId) {
		return this.getCfgDatas("LevelBox_json", arenaId);
	}
}