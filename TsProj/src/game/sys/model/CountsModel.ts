import BaseModel from "./BaseModel";
import Client from "../../../framework/common/kakura/Client";

/*
* Author: TODO
* Date:2019-06-27
* Description: TODO
*/
export default class CountsModel extends BaseModel {
	public constructor() {
		super();
	}

	//单例
	static freeTurnableCount = "1"; //免费转盘次数
	static luckyCount = "2"; //兑换次数
	static talentFreeUpdateCount = "3"; //天赋免费升级次数
	static autoOpenAirDrop = "4";//空投宝箱自动打开详情
	static equipPieceFreeGet = "5"; //装备碎片免费获取次数
	static equipPieceAdCount = "6"; //装备碎片看视频获取次数
	static fogStreetCount = "7"; //迷雾街区进入次数
	static fogStreetVideoCount = "8"; //迷雾街区视频进入次数


	private static _instance: CountsModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new CountsModel()
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

	//根据id获取次数
	getCountsById(id) {
		var counts = this._data || {};
		var count = counts[id] && counts[id]["count"] || 0;
		if (count == 0)
			return 0;
		else {
			var time = (counts[id] && counts[id]["expireTime"]) || 0;
			var curT = Client.instance.serverTime;
			time = time - curT;
			if (time < 0)
				return 0;
			return count;
		}
	}
}
