"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const FogFunc_1 = require("../func/FogFunc");
const FogConst_1 = require("../consts/FogConst");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../func/ShareTvOrderFunc");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../consts/WindowCfgs");
const Message_1 = require("../../../framework/common/Message");
const FogEvent_1 = require("../event/FogEvent");
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const RolesModel_1 = require("./RolesModel");
const GameUtils_1 = require("../../../utils/GameUtils");
const FogPropTrigger_1 = require("../../fog/trigger/FogPropTrigger");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const BattleFunc_1 = require("../func/BattleFunc");
/*
* Author: TODO
* Date:2020-05-23
* Description: TODO
*/
class FogModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new FogModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        var compNum = FogModel.instance.getCompNum();
        var actNum = FogModel.instance.getActNum();
        super.updateData(d);
        /**数量减少, 刷新行动力和零件 */
        if (d.comp || d.comp == 0) {
            if (compNum > d.comp) {
                Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_COMP);
            }
        }
        if (d.act || d.act == 0) {
            if (actNum > d.act) {
                Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_ACT);
            }
        }
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    getData() {
        return this._data;
    }
    /**获取当前层数 */
    getCurLayer() {
        var data = this.getData();
        return Number(data && data.layer) || 0;
    }
    /**获取零件数 */
    getCompNum() {
        var data = this.getData();
        return Number(data && data.comp) || 0;
    }
    /**获取行动力数 */
    getActNum() {
        var data = this.getData();
        return Number(data && data.act) || 0;
    }
    getCellInfo() {
        var data = this.getData();
        return data && data.cell || null;
    }
    /**获取大巴车等级 */
    getBusLevel() {
        var data = this.getData();
        if (!data || !data.bus || !data.bus.level) {
            return 1;
        }
        return Math.min(Number(data.bus.level), FogFunc_1.default.instance.getBusMaxLevel());
    }
    /**获取大巴信息 */
    getBusInfo() {
        var data = this.getData();
        return data && data.bus;
    }
    /**获取角色阵容 */
    getLine() {
        var data = this.getData();
        if (!data || !data.line) {
            return {};
        }
        return data.line;
    }
    /**获取角色道具列表 */
    getProp() {
        var data = this.getData();
        if (!data || !data.prop) {
            return {};
        }
        return data.prop;
    }
    getCellInfoById(id) {
        var cell = this.getCellInfo();
        return cell && cell[id];
    }
    /**根据类型获取格子id */
    getCellIdByType(type) {
        var cell = this.getCellInfo();
        if (cell) {
            for (var key in cell) {
                if (cell.hasOwnProperty(key)) {
                    var item = cell[key];
                    if (item.type == type) {
                        return key;
                    }
                }
            }
        }
        return null;
    }
    /**获取全局事件列表 */
    getGlobalEvent() {
        var data = this.getData();
        return data && data.globalEvent;
    }
    /**获取次数 */
    getShopCountsById(id) {
        var data = this.getData();
        if (!data || !data.cell || !data.cell[id] || !data.cell[id].evt || !data.cell[id].evt.counts) {
            return 0;
        }
        return data.cell[id].evt.counts;
    }
    getFogShopStatus(id, goodsId) {
        var data = this.getData();
        if (!data || !data.cell || !data.cell[id] || !data.cell[id].evt || !data.cell[id].evt.fogShop || !data.cell[id].evt.fogShop[goodsId] || !data.cell[id].evt.fogShop[goodsId].status) {
            return 0;
        }
        return data.cell[id].evt.fogShop[goodsId].status;
    }
    /**获取次数 */
    getCountsById(id) {
        var data = this.getData();
        if (!data || !data.counts || !data.counts[id]) {
            return 0;
        }
        return Number(data.counts[id]);
    }
    getFogShopGoods(id) {
        var data = this.getData();
        var data = this.getData();
        if (!data || !data.cell || !data.cell[id] || !data.cell[id].evt || !data.cell[id].evt.fogShop) {
            return {};
        }
        return data.cell[id].evt.fogShop;
    }
    /**获取角色道具数量或者等级 */
    getPropNum(propId) {
        var data = this.getData();
        if (!data || !data.prop || !data.prop[propId]) {
            return 0;
        }
        var propInfo = FogFunc_1.default.instance.getItemInfo(propId);
        //可升级道具
        if (propInfo.type == FogPropTrigger_1.default.ITEM_TYPE_CANUP) {
            return Math.min(Number(data.prop[propId]), propInfo.maxLevel);
        }
        return data.prop[propId];
    }
    getIsHavePropByType(type) {
        var data = this.getData();
        if (!data || !data.prop) {
            return false;
        }
        var result = false;
        var prop = data.prop;
        for (var key in prop) {
            var cfg = FogFunc_1.default.instance.getCfgDatas("Item", key);
            if (cfg.logicType && cfg.logicType == type) {
                result = true;
                break;
            }
        }
        return result;
    }
    /**获取一个敌人 */
    getOneEnemy() {
        var data = this.getData();
        //没有敌人数据
        if (!data || !data.enemy)
            return;
        var enemy = data.enemy;
        var target;
        for (var id in enemy) {
            var userInfo = enemy[id];
            //如果没有被使用
            if (!userInfo.use) {
                target = id;
                break;
            }
        }
        return target;
    }
    freshEnemyArr() {
        FogModel.enemyArr = [];
        var data = this.getData();
        //没有敌人数据
        if (!data || !data.enemy)
            return;
        var enemy = Object.keys(data.enemy).sort();
        for (var i = 0; i < enemy.length; i++) {
            var userInfo = data.enemy[enemy[i]];
            //把没有使用的敌人id用顺序存起来
            if (!userInfo.use) {
                FogModel.enemyArr.push(enemy[i]);
            }
        }
    }
    /**获取一个玩家敌人id */
    getOneEnemyId(isSplice = false) {
        if (!FogModel.enemyArr || FogModel.enemyArr.length == 0)
            return null;
        var id = FogModel.enemyArr[0];
        if (isSplice) {
            FogModel.enemyArr.splice(0, 1);
        }
        return id;
    }
    /**跟进id获取敌人数据 */
    getEnemyInfoById(id) {
        var data = this.getData();
        //没有敌人数据
        if (!data || !data.enemy)
            return;
        var enemy = data.enemy[id];
        return enemy;
    }
    //判断是否弹出免费行动力
    checkFreeActShow() {
        var mobilityAdTimes = GlobalParamsFunc_1.default.instance.getDataNum("mobilityAdTimes");
        var curCount = FogModel.instance.getCountsById(FogConst_1.default.fog_free_act_count);
        //判断是否有免费次数
        if (curCount >= mobilityAdTimes) {
            return false;
        }
        //判断是否有视频或者分享
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_FREE_ACT);
        if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            return false;
        }
        return true;
    }
    /**获取攻击过的敌人列表 */
    getUsedEnemyList() {
        var data = this.getData();
        //没有敌人数据
        if (!data || !data.enemy)
            return [];
        var list = [];
        var enemy = data.enemy;
        for (var key in enemy) {
            var item = enemy[key];
            if (item.use) {
                list.push(key);
            }
        }
        return list;
    }
    //消耗行动力不足时，
    checkFreeAct() {
        if (this.checkFreeActShow()) {
            //弹出免费行动力界面
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogFreeActUI);
        }
        else {
            //弹tip
            // WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughact"));		
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogTipUI, { type: FogConst_1.default.FOG_VIEW_TYPE_NOACT });
        }
    }
    //获取FogReward数据
    getFogRewardNum(type) {
        var data = this.getData();
        //没有奖励数据
        if (!data || !data.reward)
            return 0;
        if (!data.reward.hasOwnProperty(type)) {
            return 0;
        }
        return data.reward[type];
    }
    //获取FogReward数据中的道具和碎片数量
    getFogRewardNumById(type, id) {
        var data = this.getData();
        //没有奖励数据
        if (!data || !data.reward)
            return 0;
        if (!data.reward.hasOwnProperty(type)) {
            return 0;
        }
        var reward = data.reward[type];
        if (!reward.hasOwnProperty(id)) {
            return 0;
        }
        return data.reward[type][id];
    }
    //获取局外奖励
    getFogOuterReward() {
        var data = this.getData();
        //没有奖励数据
        if (!data || !data.reward)
            return [];
        //判断是否有局外奖励：金币、钻石、装备、碎片。
        var reward = {};
        var rewardArr = [];
        for (var resId in data.reward) {
            if (FogFunc_1.default.fogOuterRewardType.indexOf(Number(resId)) != -1) {
                var tempReward = data.reward[resId];
                if (Number(resId) == DataResourceFunc_1.DataResourceType.FOGITEM || Number(resId) == DataResourceFunc_1.DataResourceType.PIECE) {
                    for (var id in tempReward) {
                        rewardArr.push([resId, id, tempReward[id]]);
                    }
                }
                else {
                    rewardArr.push([resId, tempReward]);
                }
                reward[resId] = tempReward;
            }
        }
        rewardArr.sort(this.sortFogOuterReward);
        return rewardArr;
    }
    //局外奖励数据排序:钻石、金币、装备碎片
    sortFogOuterReward(a, b) {
        var indexA = FogFunc_1.default.fogOuterRewardType.indexOf(Number(a[0]));
        var indexB = FogFunc_1.default.fogOuterRewardType.indexOf(Number(b[0]));
        if (indexA > indexB) {
            return Number(a[0]) - Number(b[0]);
        }
        else if (indexA < indexB) {
            return Number(b[0]) - Number(a[0]);
        }
        else {
            //判断id
            var idA = Number(a[1]);
            var idB = Number(b[1]);
            if (idA > idB) {
                return idA - idB;
            }
            else if (idA < idB) {
                return idB - idA;
            }
        }
    }
    /**获取迷雾道具总数 */
    getPropTotalNum() {
        var data = this.getData();
        if (!data || !data.prop) {
            return 0;
        }
        var totalNum = 0;
        for (var id in data.prop) {
            totalNum += Number(data.prop[id]);
        }
        return totalNum;
    }
    randomRoleIdList(count = 3, except = []) {
        var roleIdList = [];
        //随机选出三个角色
        var allRole = RolesModel_1.default.instance.getRolesList();
        var homeId = GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId");
        var allRoleList = Object.keys(allRole);
        var index = allRoleList.indexOf(homeId + "");
        if (index > -1) {
            allRoleList.splice(index, 1);
        }
        var index1;
        for (var i = 0; i < except.length; i++) {
            index1 = allRoleList.indexOf(except[i] + "");
            if (index1 > -1) {
                allRoleList.splice(index1, 1);
            }
        }
        var roleList = GameUtils_1.default.getRandomArrayElements(allRoleList, count);
        for (var i = 0; i < roleList.length; i++) {
            if (allRole.hasOwnProperty(roleList[i])) {
                roleIdList.push(roleList[i]);
            }
        }
        return roleIdList;
    }
    getLineRoles() {
        var list = [];
        var data = this.getLine();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                list.push(key);
            }
        }
        return list;
    }
    randomRole(arr, exceptArr = []) {
        if (arr.length == 0 || arr.length == exceptArr.length) {
            return "";
        }
        var randomArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (exceptArr.indexOf(Number(arr[i])) != -1 || exceptArr.indexOf(String(arr[i])) != -1) {
                continue;
            }
            randomArr.push(String(arr[i]));
        }
        var randomNum = GameUtils_1.default.getRandomInt(0, randomArr.length - 1);
        return randomArr[randomNum];
    }
    checkFogRandomRole() {
        //迷雾上阵角色
        var fogRoles = FogModel.instance.getLineRoles();
        //已解锁角色
        var roles = RolesModel_1.default.instance.getUnlockRoles();
        if (fogRoles.length >= roles.length) {
            return [false];
        }
        //从玩家已解锁，但本局迷雾街区尚未获得的角色中随机1个出战
        var randomRoleId = this.randomRole(roles, fogRoles);
        if (randomRoleId == "") {
            return [false];
        }
        //判断能否看视频或者分享
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_BATTLE_ADDROLE);
        if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            return [false];
        }
        return [true, randomRoleId];
    }
    /**获取迷雾上阵角色 */
    getFogRoleWithRandom() {
        //判断能否随机
        var result = this.checkFogRandomRole();
        var list = [];
        var role = FogModel.instance.getLine();
        var info;
        if (result[0]) {
            var randomRoleId = result[1];
            info = TableUtils_1.default.copyOneTable(BattleFunc_1.default.instance.getCfgDatas("Role", randomRoleId));
            info.level = RolesModel_1.default.instance.getRoleLevelById(randomRoleId);
            info.isRandom = 1;
            list.push(info);
        }
        for (var id in role) {
            info = TableUtils_1.default.copyOneTable(BattleFunc_1.default.instance.getCfgDatas("Role", id));
            info.level = RolesModel_1.default.instance.getRoleLevelById(id);
            list.push(info);
        }
        list.sort(RolesModel_1.default.instance.sortRoleQual);
        return list;
    }
}
exports.default = FogModel;
FogModel.enemyArr = [];
/**迷雾战斗心灵鸡汤加的能量值 */
FogModel.fogAddEnergy = 0;
//# sourceMappingURL=FogModel.js.map