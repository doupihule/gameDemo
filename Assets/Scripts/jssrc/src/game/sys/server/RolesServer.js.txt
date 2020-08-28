"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const RolesFunc_1 = require("../func/RolesFunc");
const RolesModel_1 = require("../model/RolesModel");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const UserModel_1 = require("../model/UserModel");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const BattleFunc_1 = require("../func/BattleFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const PiecesModel_1 = require("../model/PiecesModel");
/*
角色系统
 */
class RolesServer {
    //英雄解锁
    static unlockRole(params, callBack, thisObj) {
        var upData = {};
        var deData = {};
        var role = {};
        var allRole = RolesModel_1.default.instance.getInLineRole();
        var unlockLine = GlobalParamsFunc_1.default.instance.getUnlockLineCount();
        //还能上阵的数量
        var leftCount = unlockLine - allRole.length;
        var item = BattleFunc_1.default.instance.getCfgDatas("Role", params.roleId);
        var info = item.unlockCondition;
        var temp = info[0].split(",");
        if (Number(temp[0]) == RolesFunc_1.default.ROLE_UNLOCK_TYPE_LEVEL) {
            //如果当前解锁等级等于当前过了的关卡并且还未解锁过此角色 解锁此角色
            if (Number(temp[1]) <= UserModel_1.default.instance.getMaxBattleLevel() && !RolesModel_1.default.instance.getIsHaveRole(params.roleId)) {
                role[params.roleId] = {
                    "id": params.roleId,
                    "level": 1,
                };
                if (leftCount > 0) {
                    role[params.roleId] = {
                        "id": params.roleId,
                        "level": 1,
                        "inLine": 1
                    };
                }
                else {
                    role[params.roleId] = {
                        "id": params.roleId,
                        "level": 1,
                    };
                }
            }
        }
        upData["roles"] = role;
        //货币更新
        if (params.costType && params.costType == DataResourceFunc_1.DataResourceType.COIN) {
            upData["coin"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(params.costNum));
        }
        if (params.costType && params.costType == DataResourceFunc_1.DataResourceType.GOLD) {
            var golds = UserModel_1.default.instance.costGold(BigNumUtils_1.default.round(params.costNum));
            upData["giftGold"] = golds[0];
            upData["gold"] = golds[1];
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //英雄升级
    static upgradeRole(params, callBack, thisObj) {
        // var params = {
        //     "roleId": this.oldRoleId,
        //     "costType": DataResourceType.COIN,
        //     "costNum": cost
        // };
        var upData = {};
        var ext = {};
        var extData = {};
        if (!params || !params.roleId) {
            return;
        }
        var roleId = params["roleId"];
        var updateLevel = 1;
        if (params.updateLevel) {
            updateLevel = params.updateLevel;
        }
        //货币更新
        if (params.costType && params.costType == DataResourceFunc_1.DataResourceType.COIN) {
            upData["coin"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(params.costNum));
        }
        if (params.costType && params.costType == DataResourceFunc_1.DataResourceType.GOLD) {
            var golds = UserModel_1.default.instance.costGold(BigNumUtils_1.default.round(params.costNum));
            upData["giftGold"] = golds[0];
            upData["gold"] = golds[1];
        }
        //更新英雄等级
        var maxLevel;
        if (Number(roleId) == GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId")) {
            maxLevel = GlobalParamsFunc_1.default.instance.getDataNum("flatMaxLevel");
        }
        else {
            maxLevel = GlobalParamsFunc_1.default.instance.getDataNum("roleMaxLevel");
        }
        var upLevel = Math.min(RolesModel_1.default.instance.getRoleLevelById(roleId) + updateLevel, maxLevel);
        ext[roleId] = {
            "level": upLevel,
            "id": roleId
        };
        upData["roles"] = ext;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**更新角色上阵信息 */
    static upDataRoleInfo(data, callBack = null, thisObj = null) {
        var upData = {};
        //兼容有角色的id不存在了 原因未知
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var item = data[key];
                if (!item.id) {
                    LogsManager_1.default.errorTag("errorId", "无效的角色id", item);
                    item.id = key;
                    data[key] = item;
                }
            }
        }
        upData["roles"] = data;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**合成装备 */
    static composeEquip(data, callBack = null, thisObj = null) {
        var upData = {};
        var role = {};
        var equip = {};
        var equipId = data.equipId;
        equip[equipId] = 1;
        role[data.roleId] = {};
        role[data.roleId]["equip"] = equip;
        upData["roles"] = role;
        var cost = RolesFunc_1.default.instance.getCfgDatasByKey("Equip", equipId, "cost");
        for (var i = 0; i < cost.length; i++) {
            var costItem = cost[i].split(",");
            if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.COIN) {
                upData["coin"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getCoin(), costItem[1]);
            }
            else if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
                upData["giftGold"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getGiftGold(), costItem[1]);
            }
            else if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.PIECE) {
                var count = PiecesModel_1.default.instance.getPieceCount(costItem[1]);
                upData["pieces"] = {};
                upData["pieces"][costItem[1]] = {
                    count: count - Number(costItem[2])
                };
            }
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**角色进化 */
    static roleEvolution(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var role = {};
        var deRole = {};
        //删除之前的装备
        deRole[data.roleId] = {
            equip: 1
        };
        deData["roles"] = deRole;
        role[data.roleId] = {};
        role[data.roleId]["starLevel"] = RolesModel_1.default.instance.getRoleStarLevel(data.roleId) + 1;
        upData["roles"] = role;
        var costItem = data.cost;
        if (costItem) {
            if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.COIN) {
                upData["coin"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getCoin(), costItem[1]);
            }
            else if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
                upData["giftGold"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getGiftGold(), costItem[1]);
            }
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = RolesServer;
RolesServer.incomeCoin = 0;
//# sourceMappingURL=RolesServer.js.map