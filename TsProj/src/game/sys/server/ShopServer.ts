import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import GameUtils from "../../../utils/GameUtils";
import FogFunc from "../func/FogFunc";
import ShopFunc from "../func/ShopFunc";
import ShopModel from "../model/ShopModel";


/* 
商店系统
 */
export default class ShopServer {
	//更新商店数据
	static updateShopGoods(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var good = {};
		var goods = {}
		var list = ShopFunc.instance.getCfgDatasByKey("DailyShop", data.shopId, "shopCells")
		//局外商店
		for (var i = 0; i < list.length; i++) {
			var result = GameUtils.getWeightItem(FogFunc.instance.getCfgDatasByKey("ShopCell", list[i], "shopCells"))[0]
			good = {
				"id": result,
			};
			goods[i + 1] = good;
		}
		deData["shops"] = {
			shopList: 1
		}
		upData["shops"] = {
			"shopList": goods,
			"expireTime": GameUtils.getNextRefreshTByTime(4)
		};

		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	//购买商品
	static buyGoods(data: any, callBack: any = null, thisObj: any = null) {
		var deData = {};

		var reward = [];
		var cost = [];

		if (data.reward) {
			reward = data.reward;
		}
		if (data.cost) {
			cost = data.cost;
		}
		var upData = FogFunc.instance.getFogUpdata(reward, cost);
		var index = data.index;
		var id = data.id;
		var goods = {};
		goods[index] = {
			id: data.id,
			count: ShopModel.instance.getGoodsCountByIndex(index) + 1
		}
		var list = {};
		list["shopList"] = goods
		upData["shops"] = list
		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();

	}
}