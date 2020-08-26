import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import UserModel from "../model/UserModel";
import GameUtils from "../../../utils/GameUtils";
import FogFunc from "../func/FogFunc";


/* 
迷雾商店系统
 */
export default class FogShopServer {
    //更新商店数据
    static updateShopGoods(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        var goods = {};
        var good = {};

        var goodsList = data.goods;
        //局外商店
        for (var i = 0; i < goodsList.length; i++) {
            good = {
                "id": goodsList[i],
                "status": 0
            };
            goods[i + 1] = good;
        }

        upData["fogOuterShop"] = {
            "goods": goods,
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
   
		if (data.buyGet) {
			reward = data.buyGet;
		}
		if (data.cost) {
			cost = data.cost;
		}
		var upData = FogFunc.instance.getFogUpdata(reward, cost);


        //局外商店
        var fogShopGoods = UserModel.instance.getFogShopGoods();
        if (fogShopGoods.hasOwnProperty(String(data.index))) {
            var fogOuterShop = {};
            var goods = {};

            goods[data.index] = {
                "status": 1
            };
            fogOuterShop = {
                "goods": goods,
                "expireTime": GameUtils.getNextRefreshTByTime(4)
            };
            
            upData["fogOuterShop"] = fogOuterShop;
        }


        var backData = Client.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();

    }
}