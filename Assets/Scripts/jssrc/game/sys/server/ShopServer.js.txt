"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const GameUtils_1 = require("../../../utils/GameUtils");
const FogFunc_1 = require("../func/FogFunc");
const ShopFunc_1 = require("../func/ShopFunc");
const ShopModel_1 = require("../model/ShopModel");
/*
商店系统
 */
class ShopServer {
    //更新商店数据
    static updateShopGoods(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var good = {};
        var goods = {};
        var list = ShopFunc_1.default.instance.getCfgDatasByKey("DailyShop", data.shopId, "shopCells");
        //局外商店
        for (var i = 0; i < list.length; i++) {
            var result = GameUtils_1.default.getWeightItem(FogFunc_1.default.instance.getCfgDatasByKey("ShopCell", list[i], "shopCells"))[0];
            good = {
                "id": result,
            };
            goods[i + 1] = good;
        }
        deData["shops"] = {
            shopList: 1
        };
        upData["shops"] = {
            "shopList": goods,
            "expireTime": GameUtils_1.default.getNextRefreshTByTime(4)
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //购买商品
    static buyGoods(data, callBack = null, thisObj = null) {
        var deData = {};
        var reward = [];
        var cost = [];
        if (data.reward) {
            reward = data.reward;
        }
        if (data.cost) {
            cost = data.cost;
        }
        var upData = FogFunc_1.default.instance.getFogUpdata(reward, cost);
        var index = data.index;
        var id = data.id;
        var goods = {};
        goods[index] = {
            id: data.id,
            count: ShopModel_1.default.instance.getGoodsCountByIndex(index) + 1
        };
        var list = {};
        list["shopList"] = goods;
        upData["shops"] = list;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = ShopServer;
//# sourceMappingURL=ShopServer.js.map