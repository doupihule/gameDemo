"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const FogModel_1 = require("../model/FogModel");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const Client_1 = require("../../../framework/common/kakura/Client");
const FogFunc_1 = require("../func/FogFunc");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const GameHttpControler_1 = require("../../../framework/common/GameHttpControler");
const Method_1 = require("../common/kakura/Method");
const FogConst_1 = require("../consts/FogConst");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../consts/WindowCfgs");
const StatisticsManager_1 = require("../manager/StatisticsManager");
const TaskServer_1 = require("./TaskServer");
const TaskConditionTrigger_1 = require("../trigger/TaskConditionTrigger");
const FogPropTrigger_1 = require("../../fog/trigger/FogPropTrigger");
const UserModel_1 = require("../model/UserModel");
/*
* Author: TODO
* Date:2020-05-23
* Description: TODO
*/
class FogServer {
    /**添加资源 */
    static addSourceCount(data, callBack = null, thisObj = null) {
        var upData = {};
        var fog = {};
        var type = data.type;
        var count = Number(data.count);
        if (type == DataResourceFunc_1.DataResourceType.COMP) {
            fog["comp"] = FogModel_1.default.instance.getCompNum() + count;
        }
        else if (type == DataResourceFunc_1.DataResourceType.ACT) {
            fog["act"] = FogModel_1.default.instance.getActNum() + count;
        }
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**初始化格子数据 */
    static initCellInfo(data, callBack = null, thisObj = null, isAsyc = false) {
        var upData = {};
        var fog = {};
        var cell = {};
        fog["cell"] = cell;
        var cellItem = {};
        cell[data.id] = cellItem;
        if (data.ste) {
            cellItem["ste"] = data.ste;
        }
        if (data.evt) {
            cellItem["evt"] = data.evt;
        }
        if (data.type) {
            cellItem["type"] = data.type;
        }
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    /**设置全局事件 */
    static setGlobalEvent(data, callBack = null, thisObj = null) {
        var upData = {};
        var fog = {};
        fog["globalEvent"] = data.event;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**初始化事件 */
    static initCellEvent(data, callBack = null, thisObj = null) {
        var upData = {};
        var fog = {};
        fog["cell"] = data.cell;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**删除格子上的事件 */
    static delCellEvent(data, callBack = null, thisObj = null, isAsyc = false) {
        var deData = {};
        var fog = {};
        var cell = {};
        fog["cell"] = cell;
        var cellItem = {};
        cellItem["evt"] = 1;
        cell[data.id] = cellItem;
        deData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, null, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    /**添加格子上的事件 */
    static addCellEvent(data, callBack = null, thisObj = null, isAsyc = false) {
        var upData = {};
        var fog = {};
        var cell = {};
        fog["cell"] = cell;
        var cellItem = {};
        cellItem["evt"] = {
            id: data.id
        };
        if (data.role) {
            cellItem["evt"]["role"] = data.role;
        }
        if (data.name) {
            cellItem["evt"]["name"] = data.name;
        }
        if (data.ai) {
            cellItem["evt"]["ai"] = data.ai;
        }
        if (data.rewardArr) {
            var reward = FogFunc_1.default.instance.vertRewardArrToTable(data.rewardArr);
            cellItem["evt"]["reward"] = reward;
        }
        if (data.wrongIndexArr) {
            var wrongIndex = {};
            for (var i = 0; i < data.wrongIndexArr.length; i++) {
                wrongIndex[i + 1] = data.wrongIndexArr[i];
            }
            cellItem["evt"]["wrongIndex"] = wrongIndex;
        }
        if (data.isVideoGetRight) {
            cellItem["evt"]["isVideoGetRight"] = data.isVideoGetRight;
        }
        if (data.goodsIdArr) {
            var goods = {};
            for (var i = 0; i < data.goodsIdArr.length; i++) {
                var good = {
                    "id": data.goodsIdArr[i],
                    "status": 0
                };
                goods[i + 1] = good;
            }
            cellItem["evt"]["fogShop"] = goods;
            cellItem["evt"]["counts"] = 0;
        }
        cell[data.cellId] = cellItem;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    /**开启格子 */
    static openCell(data, callBack = null, thisObj = null, isAsyc = false) {
        var upData = {};
        var fog = {};
        fog["cell"] = data.cell;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    /**删除格子上的数据 */
    static delCellInfo(data, callBack = null, thisObj = null, isAsyc = false) {
        var deData = {};
        var fog = {};
        fog["cell"] = data.cell;
        deData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, null, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    //初始设置阵容
    static setInline(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fogInline = {};
        var line = data.line;
        if (FogFunc_1.default.instance.isArray(line)) {
            for (var i = 0; i < line.length; i++) {
                fogInline[line[i]] = line[i];
            }
        }
        else {
            fogInline[line] = line;
        }
        upData["fog"] = {
            "line": fogInline
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //升级大巴车
    static upgradeBus(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        var upLevel = 1;
        if (data && data.upLevel) {
            upLevel = data.upLevel;
        }
        fog["bus"] = {
            "level": Math.min(Number(FogModel_1.default.instance.getBusLevel()) + upLevel, FogFunc_1.default.instance.getBusMaxLevel())
        };
        //升级消耗
        var upCost = data.upCost || 0;
        if (upCost) {
            fog["comp"] = FogModel_1.default.instance.getCompNum() - upCost;
        }
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**设置bus的位置 */
    static setBusPos(data, callBack = null, thisObj = null, isAsyc = true) {
        var upData = {};
        var deData = {};
        var fog = {};
        fog["bus"] = {
            "pos": data.pos
        };
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    //更新局内商店数据
    static updateShopGoods(data, callBack = null, thisObj = null) {
        var upData = {};
        if (data.goodsIdArr) {
            var goods = {};
            for (var i = 0; i < data.goodsIdArr.length; i++) {
                var good = {
                    "id": data.goodsIdArr[i],
                    "status": 0
                };
                goods[i + 1] = good;
            }
            var cellItem = {};
            var temp = {};
            var fog = {};
            var cell = {};
            temp["id"] = data.id;
            temp["fogShop"] = goods;
            temp["counts"] = FogModel_1.default.instance.getShopCountsById(data.cellId) + 1;
            cellItem["evt"] = temp;
            cell[data.cellId] = cellItem;
            fog["cell"] = cell;
            upData["fog"] = fog;
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //购买局内商店商品
    static buyGoods(data, callBack = null, thisObj = null) {
        var deData = {};
        var cellItem = {};
        var cell = {};
        var reward = [];
        var cost = [];
        if (data.buyGet) {
            reward = data.buyGet;
        }
        if (data.cost) {
            cost = data.cost;
        }
        var upData = FogFunc_1.default.instance.getFogUpdata(reward, cost);
        // 局内商店
        var goods = {};
        var good = {};
        var item = {};
        var fogShopGoods = FogModel_1.default.instance.getFogShopGoods(data.cellId);
        if (fogShopGoods.hasOwnProperty(String(data.index))) {
            good["status"] = 1;
            goods[data.index] = good;
            item["fogShop"] = goods;
            cellItem["evt"] = item;
            cell[data.cellId] = cellItem;
        }
        if (!upData["fog"]) {
            upData["fog"] = {};
        }
        upData["fog"]["cell"] = cell;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //黑市商店领取或者购买
    static businessBuy(data, callBack = null, thisObj = null) {
        var deData = {};
        var reward = [];
        var cost = [];
        //获得奖励
        if (data.reward) {
            reward = data.reward;
        }
        //消耗
        if (data.cost) {
            cost = data.cost;
        }
        var upData = FogFunc_1.default.instance.getFogUpdata(reward, cost);
        //行动力消耗
        if (data.costAct) {
            if (!upData["fog"]) {
                upData["fog"] = {};
            }
            var act = FogModel_1.default.instance.getActNum();
            if (upData["fog"] && upData["fog"]["act"]) {
                act = upData["fog"]["act"];
            }
            upData["fog"]["act"] = act - Number(data.costAct);
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //二选一事件选择奖励
    static chooseReward(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var reward = data.reward ? data.reward : [];
        var cost = data.cost ? data.cost : [];
        upData = FogFunc_1.default.instance.getFogUpdata(reward, cost);
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //消耗行动力继续答题
    static continueAnswer(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        if (Number(data.cost)) {
            fog["act"] = FogModel_1.default.instance.getActNum() - Number(data.cost);
            upData["fog"] = fog;
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //上交东西
    static handIn(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        if (data.hand && data.hand.length != 0) {
            upData = FogFunc_1.default.instance.getFogUpDataByMultiArr(data.hand, false);
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //领取奖励
    static getReward(data, callBack = null, thisObj = null, isAsyc = true) {
        var upData = {};
        var deData = {};
        var reward = data.reward ? data.reward : [];
        var cost = data.cost ? data.cost : [];
        upData = FogFunc_1.default.instance.getFogUpdata(reward, cost, data.doubleRate || 1);
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    //扣除行动力
    static costAct(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        if (data.cost) {
            fog["act"] = FogModel_1.default.instance.getActNum() - Number(data.cost);
            upData["fog"] = fog;
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //获得免费行动力
    static getFreeAct(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var reward = data.reward;
        upData = FogFunc_1.default.instance.getFogUpdata(reward, []);
        if (!upData["fog"]) {
            upData["fog"] = {};
        }
        //更新次数
        var counts = {};
        counts[FogConst_1.default.fog_free_act_count] = FogModel_1.default.instance.getCountsById(FogConst_1.default.fog_free_act_count) + 1;
        upData["fog"]["counts"] = counts;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**同步战力 */
    static syncForce(data, callBack = null, thisObj = null) {
        var params = {
            capability: data.force
        };
        GameHttpControler_1.default.instance.sendRequest(Method_1.default.Fog_syncForce, params, callBack, thisObj);
    }
    /**获取敌人列表 */
    static getEnemyList(data, callBack = null, thisObj = null) {
        var params = {
            uidList: data.uidList,
            randNum: data.randNum
        };
        GameHttpControler_1.default.instance.sendRequest(Method_1.default.Fog_randomEnemy, params, callBack, thisObj);
    }
    /**退出迷雾 */
    static exitGame() {
        var deData = {};
        var fog = {};
        var data = FogModel_1.default.instance.getData();
        var upData = {};
        upData["fog"] = {
            act: 0
        };
        for (var key in data) {
            if (key != "act") {
                fog[key] = 1;
            }
        }
        deData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        SingleCommonServer_1.default.startSaveClientData();
        FogFunc_1.default.fogEndCellSign = null;
    }
    /**设置最高层 */
    static setMaxLayer() {
        var upData = {};
        var layer = FogModel_1.default.instance.getCurLayer() + 1;
        var allLayer = FogFunc_1.default.instance.getAllLayer();
        if (layer > allLayer) {
            layer = allLayer;
        }
        var maxLayer = UserModel_1.default.instance.getMaxFogLayer();
        if (layer > maxLayer) {
            upData["userExt"] = {
                maxFogLayer: layer
            };
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**进入下一层 */
    static enterNextLayer(data, callBack = null, thisObj = null) {
        var deData = {};
        var upData = {};
        var dfog = {};
        dfog["cell"] = 1;
        dfog["bus"] = {
            pos: 1
        };
        var ufog = {};
        var layer = FogModel_1.default.instance.getCurLayer() + 1;
        var allLayer = FogFunc_1.default.instance.getAllLayer();
        if (layer > allLayer) {
            layer = allLayer;
        }
        var maxLayer = UserModel_1.default.instance.getMaxFogLayer();
        if (layer > maxLayer) {
            upData["userExt"] = {
                maxFogLayer: layer
            };
        }
        ufog["layer"] = layer;
        deData["fog"] = dfog;
        upData["fog"] = ufog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        TaskServer_1.default.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_fogHighLayer, count: layer }, null, null, false);
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**消耗行动力带走角色 */
    static takenRole(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        if (data.cost) {
            fog["act"] = FogModel_1.default.instance.getActNum() - Number(data.cost);
        }
        if (data.roleId) {
            var userRoles = FogModel_1.default.instance.getLine();
            if (!userRoles.hasOwnProperty(data.roleId)) {
                var role = {};
                role[data.roleId] = data.roleId;
                fog["line"] = role;
            }
        }
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**更新敌人状态 */
    static updateEnemyState(data, callBack = null, thisObj = null) {
        var upData = {};
        var fog = {};
        var enemy = {};
        enemy[data.enemyId] = {
            use: 1
        };
        fog["enemy"] = enemy;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //保存玩家类敌人数据
    static savePlayerEnemyData(data = {}, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        var enemy = {};
        var deFog = {};
        //清除原有数据
        var fogData = FogModel_1.default.instance.getData();
        for (var key in fogData) {
            if (key == "enemy") {
                deFog[key] = 1;
            }
        }
        deData["fog"] = fog;
        if (Object.keys(data).length != 0) {
            var tempEnemyTab;
            for (var id in data) {
                tempEnemyTab = data[id];
                var enemyDetail = {};
                enemyDetail["roles"] = tempEnemyTab.roles;
                enemyDetail["userExt"] = { "force": tempEnemyTab.userExt.force };
                enemyDetail["name"] = FogFunc_1.default.instance.getEnemyName();
                enemy[id] = enemyDetail;
            }
        }
        fog["enemy"] = enemy;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //保存fog奖励数据
    static saveFogReward(data, callBack = null, thisObj = null, isAsyc = true) {
        var upData = {};
        var deData = {};
        var fog = {};
        var reward = {};
        //传参：数组格式
        var rewardArr = data.reward;
        var levelFullItemArr = [];
        var totalCoin = "0";
        var totalGold = "0";
        var totalFogCoin = 0;
        var totalComp = 0;
        var totalAct = 0;
        var pieceTab = {};
        var propTab = {};
        var tempReward;
        for (var i = 0; i < rewardArr.length; i++) {
            tempReward = rewardArr[i];
            switch (Number(tempReward[0])) {
                //钻石
                case DataResourceFunc_1.DataResourceType.GOLD:
                    totalGold = BigNumUtils_1.default.sum(totalGold, tempReward[1]);
                    break;
                //金币   
                case DataResourceFunc_1.DataResourceType.COIN:
                    totalCoin = BigNumUtils_1.default.sum(totalCoin, tempReward[1]);
                    break;
                //迷雾币    
                case DataResourceFunc_1.DataResourceType.FOGCOIN:
                    totalFogCoin += Number(tempReward[1]);
                    break;
                //零件    
                case DataResourceFunc_1.DataResourceType.COMP:
                    totalComp += Number(tempReward[1]);
                    break;
                //行动力   
                case DataResourceFunc_1.DataResourceType.ACT:
                    totalAct += Number(tempReward[1]);
                    break;
                //碎片
                case DataResourceFunc_1.DataResourceType.PIECE:
                    var piece = pieceTab[tempReward[1]] ? pieceTab[tempReward[1]] : 0;
                    pieceTab[tempReward[1]] = piece + Number(tempReward[2]);
                    break;
                //迷雾街区道具
                case DataResourceFunc_1.DataResourceType.FOGITEM:
                    var propNum = propTab[tempReward[1]] ? propTab[tempReward[1]] : 0;
                    propTab[tempReward[1]] = propNum + Number(tempReward[2]);
                    break;
            }
        }
        if (totalCoin != "0") {
            reward[DataResourceFunc_1.DataResourceType.COIN] = BigNumUtils_1.default.sum(FogModel_1.default.instance.getFogRewardNum(DataResourceFunc_1.DataResourceType.COIN), totalCoin);
        }
        if (totalGold != "0") {
            reward[DataResourceFunc_1.DataResourceType.GOLD] = BigNumUtils_1.default.sum(FogModel_1.default.instance.getFogRewardNum(DataResourceFunc_1.DataResourceType.GOLD), totalGold);
        }
        if (totalFogCoin != 0) {
            reward[DataResourceFunc_1.DataResourceType.FOGCOIN] = FogModel_1.default.instance.getFogRewardNum(DataResourceFunc_1.DataResourceType.FOGCOIN) + totalFogCoin;
        }
        if (totalComp != 0) {
            reward[DataResourceFunc_1.DataResourceType.COMP] = FogModel_1.default.instance.getFogRewardNum(DataResourceFunc_1.DataResourceType.COMP) + totalComp;
        }
        if (totalAct != 0) {
            reward[DataResourceFunc_1.DataResourceType.ACT] = FogModel_1.default.instance.getFogRewardNum(DataResourceFunc_1.DataResourceType.ACT) + totalAct;
        }
        if (Object.keys(pieceTab).length != 0) {
            var pieceData = {};
            for (var pieceId in pieceTab) {
                pieceData[pieceId] = FogModel_1.default.instance.getFogRewardNumById(DataResourceFunc_1.DataResourceType.PIECE, pieceId) + pieceTab[pieceId];
            }
            reward[DataResourceFunc_1.DataResourceType.PIECE] = pieceData;
        }
        if (Object.keys(propTab).length != 0) {
            var itemData = {};
            var propInfo;
            var num;
            for (var itemId in propTab) {
                propInfo = FogFunc_1.default.instance.getItemInfo(itemId);
                num = FogModel_1.default.instance.getFogRewardNumById(DataResourceFunc_1.DataResourceType.FOGITEM, itemId) + propTab[itemId];
                //可升级道具
                if (propInfo.type == FogPropTrigger_1.default.ITEM_TYPE_CANUP) {
                    if (num > propInfo.maxLevel) {
                        levelFullItemArr.push(itemId);
                        num = Math.min(num, propInfo.maxLevel);
                    }
                }
                itemData[itemId] = num;
                //获得局内道具打点
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_ITEM_GET, { "itemId": itemId });
            }
            reward[DataResourceFunc_1.DataResourceType.FOGITEM] = itemData;
        }
        fog["reward"] = reward;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
        //判断道具是否满级
        if (levelFullItemArr.length != 0) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBagItemFullLevelUI, { "item": levelFullItemArr });
        }
    }
    /**更新次数 */
    static updateFogCount(data, callBack = null, thisObj = null, isAsyc = false) {
        var upData = {};
        var fog = {};
        var counts = {};
        counts[data.type] = FogModel_1.default.instance.getCountsById(data.type) + (data.count || 1);
        fog["counts"] = counts;
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    /**删除某个的次数 */
    static delFogCount(data, callBack = null, thisObj = null, isAsyc = false) {
        var deData = {};
        var fog = {};
        var counts = {};
        counts[data.type] = 1;
        fog["counts"] = counts;
        deData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, null, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    //道具满级兑换
    static exchangeComp(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        var deFog = {};
        if (data && data.reward) {
            fog["comp"] = FogModel_1.default.instance.getCompNum() + Number(data.reward);
        }
        if (data && data.item) {
            var prop = {};
            var itemArr = data.item;
            for (var i = 0; i < itemArr.length; i++) {
                var propInfo = FogFunc_1.default.instance.getItemInfo(itemArr[i]);
                prop[itemArr[i]] = propInfo.maxLevel;
            }
            fog["prop"] = prop;
        }
        upData["fog"] = fog;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**道具消耗 */
    static itemCost(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var fog = {};
        var deFog = {};
        var id = data.id;
        var prop = {};
        var count = FogModel_1.default.instance.getPropNum(id);
        // 剩余数量大于1 则数量减1  数量为1 则删除这个道具
        if (count > 1) {
            prop[id] = count - 1;
            fog["prop"] = prop;
            upData["fog"] = fog;
        }
        else {
            prop[id] = 1;
            fog["prop"] = prop;
            deData["fog"] = fog;
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = FogServer;
//# sourceMappingURL=FogServer.js.map