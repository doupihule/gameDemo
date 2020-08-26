"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const UserModel_1 = require("../model/UserModel");
const GameUtils_1 = require("../../../utils/GameUtils");
const FogFunc_1 = require("../func/FogFunc");
/*
迷雾商店系统
 */
class FogShopServer {
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
        if (data.buyGet) {
            reward = data.buyGet;
        }
        if (data.cost) {
            cost = data.cost;
        }
        var upData = FogFunc_1.default.instance.getFogUpdata(reward, cost);
        //局外商店
        var fogShopGoods = UserModel_1.default.instance.getFogShopGoods();
        if (fogShopGoods.hasOwnProperty(String(data.index))) {
            var fogOuterShop = {};
            var goods = {};
            goods[data.index] = {
                "status": 1
            };
            fogOuterShop = {
                "goods": goods,
                "expireTime": GameUtils_1.default.getNextRefreshTByTime(4)
            };
            upData["fogOuterShop"] = fogOuterShop;
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = FogShopServer;
//# sourceMappingURL=FogShopServer.js.map