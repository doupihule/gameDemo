import BaseFunc from "../../../framework/func/BaseFunc";


export default class DailyDiamondFunc extends BaseFunc {
	private static _instance: DailyDiamondFunc;
	public static get instance(): DailyDiamondFunc {
		if (!this._instance) {
			this._instance = new DailyDiamondFunc();
		}
		return this._instance;
	}

	getCfgsPathArr() {
		return [
			{name: "DailyDiamond_json"},
		]
	}

	getDataById(id) {
		return this.getCfgDatas("DailyDiamond_json", id);
	}

	getMaxId() {
		var allData = this.getAllCfgData("DailyDiamond_json");
		var dataKeys = Object.keys(allData);
		var maxId = "0";
		for (var i = 0; i < dataKeys.length; i++) {
			if (Number(dataKeys[i]) >= Number(maxId)) {
				maxId = dataKeys[i];
			}
		}
		return Number(maxId);
	}

	/**
	 * 获取下一次显示的次数
	 * @param currentStep
	 */
	getNextShowTime(currentStep) {
		currentStep = Number(currentStep);
		for (var i = 0; i <= this.getMaxId() - currentStep; i++) {
			if (this.getDataById(currentStep).showDiamond == 1) {
				break;
			} else {
				currentStep += 1;
			}
		}

		return currentStep;
	}
}