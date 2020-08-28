import BaseFunc from "../../../framework/func/BaseFunc";
import ResourceConst from "../consts/ResourceConst";
import WindowManager from "../../../framework/manager/WindowManager";
import RolesFunc from "./RolesFunc";

export enum DataResourceConst {
	COIN = 2,
	GOLD = 3,
	SP = 4,
	PIECE = 5,//碎片
	ACT = 6,//行动力
	COMP = 7,//零件
	FOGITEM = 8, //迷雾道具
	FOGCOIN = 9,//迷雾币
	TASKPOINT = 10, //活跃度
	REPUTE = 11 //声望
}

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

		if (dataArr[0]) {
			switch (Number(dataArr[0])) {
				//金币
				case DataResourceConst.COIN:
					result = {
						img: ResourceConst.COIN_PNG,
						num: dataArr[1],
					};
					break;
				//钻石
				case DataResourceConst.GOLD:
					result = {
						img: ResourceConst.GOLD_PNG,
						num: dataArr[1],
					};
					break;
				//体力
				case DataResourceConst.SP:
					result = {
						img: ResourceConst.SP_PNG,
						num: dataArr[1],
					};
					break;
				//碎片
				case DataResourceConst.PIECE:
					result = {
						img: RolesFunc.instance.getEquipIcon(RolesFunc.instance.getCfgDatasByKey("EquipMaterial", dataArr[1], "icon")),
						id: dataArr[1],
						num: dataArr[2],
					};
					break;
				//零件
				case DataResourceConst.COMP:
					result = {
						img: ResourceConst.COMP_PNG,
						num: dataArr[1],
					};
					break;
				//迷雾币
				case DataResourceConst.FOGCOIN:
					result = {
						img: ResourceConst.FOGCOIN_PNG,
						num: dataArr[1],
					};
					break;
				//行动力
				case DataResourceConst.ACT:
					result = {
						img: ResourceConst.ACT_PNG,
						num: dataArr[1],
					};
					break;
				//迷雾道具
				case DataResourceConst.FOGITEM:
					result = {
						img: RolesFunc.instance.getEquipIcon(RolesFunc.instance.getCfgDatasByKey("EquipMaterial", dataArr[1], "icon")),
						id: dataArr[1],
						num: dataArr[2],
					};
					break;

			}

		}

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