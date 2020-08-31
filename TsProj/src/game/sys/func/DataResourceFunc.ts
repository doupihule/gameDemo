import BaseFunc from "../../../framework/func/BaseFunc";
import ResourceConst from "../consts/ResourceConst";
import WindowManager from "../../../framework/manager/WindowManager";
import RolesFunc from "./RolesFunc";
import DataResourceConst from "../consts/DataResourceConst";

export default class DataResourceFunc extends BaseFunc {
	private static _instance: DataResourceFunc;
	public static get instance(): DataResourceFunc {
		if (!this._instance) {
			this._instance = new DataResourceFunc();
		}
		return this._instance;
	}

	getCfgsPathArr() {
		return [
			{name: "DataResource_json"},
		]
	}

	/**根据id获取resource数据*/
	public getIconById(id: number): any {
		var icon = this.getCfgDatasByKey("DataResource_json", id, "icon");
		icon = "native/main/main/" + icon + ".png";
		return icon;
	}

	//根据资源字符串返回资源图片和数量
	getDataResourceInfo(dataArr) {
		var result = {};



		return result;

	}

	showTip(reward) {
		if (Number(reward[0]) == DataResourceConst.COIN) {
			WindowManager.ShowTip("获得金币 x" + reward[1])
		} else if (Number(reward[0]) == DataResourceConst.GOLD) {
			WindowManager.ShowTip("获得钻石 x" + reward[1])
		}
	}
}