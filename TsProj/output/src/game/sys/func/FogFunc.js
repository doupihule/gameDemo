"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const GlobalParamsFunc_1 = require("./GlobalParamsFunc");
const UserExtModel_1 = require("../model/UserExtModel");
const FogModel_1 = require("../model/FogModel");
const CountsModel_1 = require("../model/CountsModel");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("./ShareTvOrderFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
const RolesFunc_1 = require("./RolesFunc");
const DataResourceFunc_1 = require("./DataResourceFunc");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const ResourceConst_1 = require("../consts/ResourceConst");
const UserModel_1 = require("../model/UserModel");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const PiecesModel_1 = require("../model/PiecesModel");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const FogConst_1 = require("../consts/FogConst");
const RolesModel_1 = require("../model/RolesModel");
const BattleFunc_1 = require("./BattleFunc");
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const ScreenAdapterTools_1 = require("../../../framework/utils/ScreenAdapterTools");
const StringUtils_1 = require("../../../framework/utils/StringUtils");
const FogPropTrigger_1 = require("../../fog/trigger/FogPropTrigger");
const Message_1 = require("../../../framework/common/Message");
const FogEvent_1 = require("../event/FogEvent");
const TaskServer_1 = require("../server/TaskServer");
const WorkModel_1 = require("../model/WorkModel");
/*
* Author: TODO
* Date:2020-05-23
* Description: TODO
*/
class FogFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Layer_json" },
            { name: "EventsGroup_json" },
            { name: "GlobalEvents_json" },
            { name: "BusUpGrade_json" },
            { name: "Item_json" },
            { name: "ItemUpGrade_json" },
            { name: "DropGroup_json" },
            { name: "Event_json" },
            { name: "Shop_json" },
            { name: "Box_json" },
            { name: "ShopCell_json" },
            { name: "Goods_json" },
            { name: "Enemy_json" },
            { name: "RandomName_json" },
            { name: "NpcArray_json" },
            { name: "Ai_json" },
            { name: "TranslateEvent_json" },
            { name: "MarkReward_json" },
            { name: "TranslateGoods_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new FogFunc();
            FogFunc.initGlobalParams();
        }
        return this._instance;
    }
    //初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
    static initGlobalParams() {
        this.fogRoleScale = GlobalParamsFunc_1.default.instance.getDataNum("fogRoleScale") / 10000;
        this.fogBusSpeed = BattleFunc_1.default.instance.turnSpeedToFrame(GlobalParamsFunc_1.default.instance.getDataNum("fogBusSpeed"));
        var homeCd = GlobalParamsFunc_1.default.instance.getDataArray("warHomeSkillCd");
        FogFunc.warHomeSkillCd = {};
        for (var i = 0; i < homeCd.length; i++) {
            var item = homeCd[i].split(",");
            FogFunc.warHomeSkillCd[item[0]] = Number(item[1]);
        }
    }
    //根据坐标获取key
    getKeyByPos(x, y) {
        return x + "_" + y;
    }
    /**获取总层数 */
    getAllLayer() {
        if (!this.allLayer) {
            this.allLayer = Object.keys(this.getAllCfgData("Layer")).length;
        }
        return this.allLayer;
    }
    //获取迷雾街区开启等级
    getFogOpenLevel() {
        return GlobalParamsFunc_1.default.instance.getDataNum("fogStreetUnlock") || 1;
    }
    //判断迷雾街区功能是否开启
    checkFogOpen() {
        var fogStreetUnlock = this.getFogOpenLevel();
        var curLevel = UserExtModel_1.default.instance.getMaxLevel();
        if (Number(curLevel) >= fogStreetUnlock) {
            return [true];
        }
        return [false, fogStreetUnlock];
    }
    //获取迷雾街区的进入状态:1 功能未开启 2 可以直接进入 3 可以免费进入 4 可以视频进入  5 不可进入
    getFogEnterStatus() {
        //判断功能是否解锁
        var result = this.checkFogOpen();
        if (!result[0]) {
            return FogConst_1.default.FOG_STATUS_NOT_OPEN;
        }
        //判断是否有保存的数据
        var fogs = FogModel_1.default.instance.getData();
        if (Object.keys(fogs).length != 0 && Object.keys(FogModel_1.default.instance.getLine()).length != 0) {
            return FogConst_1.default.FOG_STATUS_ENTER;
        }
        //判断是否有免费次数
        var userFogStreetCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.fogStreetCount);
        var fogStreetTimes = GlobalParamsFunc_1.default.instance.getDataNum("fogStreetTimes");
        if (userFogStreetCount < fogStreetTimes) {
            return FogConst_1.default.FOG_STATUS_COST_FREE_COUNT;
        }
        else if (userFogStreetCount == fogStreetTimes && CountsModel_1.default.instance.getCountsById(CountsModel_1.default.fogStreetVideoCount) == 0) {
            return FogConst_1.default.FOG_STATUS_COST_FREE_COUNT_LIMIT;
        }
        //判断是否有视频次数
        var userFogStreetVideoCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.fogStreetVideoCount);
        var fogStreetVideoTimes = GlobalParamsFunc_1.default.instance.getDataNum("fogStreetVideoTimes");
        if (userFogStreetVideoCount >= fogStreetVideoTimes) {
            return FogConst_1.default.FOG_STATUS_NO_ENTER;
        }
        //判断能否视频
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_VIDEO_START);
        if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            return FogConst_1.default.FOG_STATUS_NO_ENTER;
        }
        else {
            return FogConst_1.default.FOG_STATUS_COST_VIDEO_COUNT;
        }
    }
    /**获取大巴车最大等级 */
    getBusMaxLevel() {
        if (!this.busMaxLevel) {
            this.busMaxLevel = Object.keys(this.getAllCfgData("BusUpGrade")).length;
        }
        return this.busMaxLevel;
    }
    /**根据id获取大巴车数据*/
    getBusAttribute(id) {
        return this.getCfgDatasByKey("BusUpGrade_json", id, "attribute");
    }
    /**根据id获取道具info*/
    getItemInfo(id) {
        return this.getCfgDatas("Item_json", id);
    }
    /**根据id和level获取道具UPinfo*/
    getItemUpGradeInfo(id, level) {
        return this.getCfgDatasByKey("ItemUpGrade_json", id, level);
    }
    /**根据id获取掉落奖励*/
    getDropGroupReward(id) {
        return this.getCfgDatasByKey("DropGroup_json", id, "reward");
    }
    getShopInfos(id) {
        return this.getCfgDatasByKey("Shop_json", id, "shopCells");
    }
    getShopCells(id) {
        return this.getCfgDatasByKey("ShopCell_json", id, "shopCells");
    }
    getGoodsInfo(id) {
        return this.getCfgDatas("Goods_json", id);
    }
    /**随机商店的商品 */
    genFogShop(shopId) {
        var goods = [];
        var shopInfo = FogFunc.instance.getShopInfos(shopId);
        var shopCells;
        var goodsId;
        for (var i = 0; i < shopInfo.length; i++) {
            var shopCellId = shopInfo[i];
            shopCells = FogFunc.instance.getShopCells(shopCellId);
            goodsId = GameUtils_1.default.getWeightItem(shopCells)[0];
            //排重
            if (goods.indexOf(goodsId) == -1) {
                goods.push(goodsId);
            }
            else {
                i--;
            }
        }
        return goods;
    }
    /**
     * 判断是否是数组类型
     */
    isArray(obj) {
        return (typeof obj == 'object') && obj.constructor == Array;
    }
    getEventInfo(id, id1) {
        return this.getCfgDatasByKey("Event_json", id, id1);
    }
    getEventInfoById(id) {
        return this.getCfgDatas("Event_json", id);
    }
    //获取迷雾币道具得icon
    getFogItemIcon(itemId) {
        var itemInfo = FogFunc.instance.getItemInfo(itemId);
        return "uisource/fogitemicon/fogitemicon/" + itemInfo.icon + ".png";
    }
    //获取碎片icon
    getEquipIcon(pieceId) {
        var pieceInfo = RolesFunc_1.default.instance.getCfgDatas("EquipMaterial", pieceId);
        return "uisource/equipicon/equipicon/" + pieceInfo.icon + ".png";
    }
    getResourceShowInfo(reward, isSmall = false, moneyExtPer = 1) {
        var result;
        var itemName;
        var itemIcon;
        var itemNum = 0;
        var itemDesc = "";
        var itemScale = 1;
        var userNum;
        var type;
        if (typeof (reward) == "string") {
            reward = reward.split(",");
        }
        type = Number(reward[0]);
        switch (Number(reward[0])) {
            //碎片
            case DataResourceFunc_1.DataResourceType.PIECE:
                var pieceId = reward[1];
                var pieceInfo = RolesFunc_1.default.instance.getCfgDatas("EquipMaterial", pieceId);
                itemName = TranslateFunc_1.default.instance.getTranslate(pieceInfo.name, "TranslateEquip");
                itemIcon = FogFunc.instance.getEquipIcon(pieceId);
                itemNum = reward[2] || 0;
                if (isSmall) {
                    itemScale = 0.5;
                }
                else {
                    itemScale = 1.1;
                }
                userNum = PiecesModel_1.default.instance.getPieceCount(pieceId);
                break;
            //金币
            case DataResourceFunc_1.DataResourceType.COIN:
                itemName = TranslateFunc_1.default.instance.getTranslate("#tid_coin_name");
                itemIcon = "uisource/video/video/video_image_lixianjinbi.png";
                itemNum = Math.floor(Number(reward[1]) * moneyExtPer);
                itemScale = 1;
                if (isSmall) {
                    itemScale = 0.5;
                }
                else {
                    itemScale = 1;
                }
                userNum = UserModel_1.default.instance.getCoin();
                break;
            //钻石
            case DataResourceFunc_1.DataResourceType.GOLD:
                itemName = TranslateFunc_1.default.instance.getTranslate("#tid_gold_name");
                itemIcon = "uisource/video/video/video_image_zuanshi.png";
                itemNum = Math.floor(Number(reward[1]) * moneyExtPer);
                ;
                if (isSmall) {
                    itemScale = 0.5;
                }
                else {
                    itemScale = 1.1;
                }
                userNum = UserModel_1.default.instance.getGold();
                break;
            //活跃度
            case DataResourceFunc_1.DataResourceType.TASKPOINT:
                itemName = TranslateFunc_1.default.instance.getTranslate("#tid_gold_name");
                itemIcon = "uisource/task/task/task_icon_huoyuedu.png";
                itemNum = reward[1];
                if (isSmall) {
                    itemScale = 0.5;
                }
                else {
                    itemScale = 1.1;
                }
                userNum = "";
                break;
            //体力
            case DataResourceFunc_1.DataResourceType.SP:
                itemName = TranslateFunc_1.default.instance.getTranslate("#tid_sp_name");
                itemIcon = "native/main/main/main_icon_tili.png";
                itemNum = reward[1];
                if (isSmall) {
                    itemScale = 0.5;
                }
                else {
                    itemScale = 1.1;
                }
                userNum = UserExtModel_1.default.instance.getNowSp();
                break;
            //行动力
            case DataResourceFunc_1.DataResourceType.ACT:
                itemName = TranslateFunc_1.default.instance.getTranslate("#tid_act_name");
                itemIcon = ResourceConst_1.default.ACT_PNG;
                itemNum = reward[1];
                itemScale = 0.7;
                userNum = FogModel_1.default.instance.getActNum();
                break;
            //零件
            case DataResourceFunc_1.DataResourceType.COMP:
                itemName = TranslateFunc_1.default.instance.getTranslate("#tid_comp_name");
                itemIcon = ResourceConst_1.default.COMP_PNG;
                itemNum = reward[1];
                itemScale = 0.6;
                userNum = FogModel_1.default.instance.getCompNum();
                break;
            //迷雾币
            case DataResourceFunc_1.DataResourceType.FOGCOIN:
                itemName = TranslateFunc_1.default.instance.getTranslate("#tid_fogcoin_name");
                itemIcon = ResourceConst_1.default.FOGCOIN_PNG;
                itemNum = reward[1];
                if (isSmall) {
                    itemScale = 0.3;
                }
                else {
                    itemScale = 0.7;
                }
                userNum = UserModel_1.default.instance.getFogCoinNum();
                break;
            //迷雾街区道具
            case DataResourceFunc_1.DataResourceType.FOGITEM:
                var itemInfo = FogFunc.instance.getItemInfo(reward[1]);
                itemName = TranslateFunc_1.default.instance.getTranslate(itemInfo.name, "TranslateItem");
                itemDesc = TranslateFunc_1.default.instance.getTranslate(itemInfo.desc, "TranslateItem");
                itemIcon = FogFunc.instance.getFogItemIcon(reward[1]);
                itemNum = reward[2] || 0;
                if (isSmall) {
                    itemScale = 0.3;
                }
                else {
                    itemScale = 0.7;
                }
                userNum = FogModel_1.default.instance.getPropNum(reward[1]);
                break;
            //名声
            case DataResourceFunc_1.DataResourceType.REPUTE:
                itemName = "";
                itemIcon = ResourceConst_1.default.REPUTE_PNG;
                itemNum = reward[1];
                if (isSmall) {
                    itemScale = 1;
                }
                else {
                    itemScale = 1.5;
                }
                userNum = WorkModel_1.default.instance.getReputeNum();
                break;
        }
        result = {
            name: itemName,
            icon: itemIcon,
            num: itemNum,
            desc: itemDesc,
            scale: itemScale,
            userNum: userNum,
            type: type
        };
        return result;
    }
    //根据获得和消耗获取最终的upData数据
    getFogUpdata(reward = [], cost = [], doubleRate = 1, moneyAddPer = 1) {
        var upData = {};
        var fog = {};
        var totalCoin = "0";
        var totalGold = "0";
        var totalFogCoin = 0;
        var totalSp = 0;
        var totalComp = 0;
        var totalAct = 0;
        var pieceTab = {};
        var propTab = {};
        var point = 0;
        var repute = 0;
        //购买获得
        var tempReward;
        var rewardArr = reward;
        for (var i = 0; i < rewardArr.length; i++) {
            tempReward = rewardArr[i];
            if (typeof (tempReward) == "string") {
                tempReward = tempReward.split(",");
            }
            switch (Number(tempReward[0])) {
                //钻石
                case DataResourceFunc_1.DataResourceType.GOLD:
                    totalGold = BigNumUtils_1.default.sum(totalGold, Math.floor(Number(tempReward[1]) * doubleRate * moneyAddPer));
                    break;
                //金币   
                case DataResourceFunc_1.DataResourceType.COIN:
                    totalCoin = BigNumUtils_1.default.sum(totalCoin, Math.floor(Number(tempReward[1]) * doubleRate * moneyAddPer));
                    break;
                //迷雾币    
                case DataResourceFunc_1.DataResourceType.FOGCOIN:
                    totalFogCoin += Number(tempReward[1]) * doubleRate;
                    break;
                //体力    
                case DataResourceFunc_1.DataResourceType.SP:
                    totalSp += Number(tempReward[1]) * doubleRate;
                    break;
                //零件    
                case DataResourceFunc_1.DataResourceType.COMP:
                    totalComp += Number(tempReward[1]) * doubleRate;
                    break;
                //行动力   
                case DataResourceFunc_1.DataResourceType.ACT:
                    totalAct += Number(tempReward[1]) * doubleRate;
                    break;
                //碎片
                case DataResourceFunc_1.DataResourceType.PIECE:
                    var piece = pieceTab[tempReward[1]] ? pieceTab[tempReward[1]] : 0;
                    pieceTab[tempReward[1]] = piece + Number(tempReward[2]) * doubleRate;
                    break;
                //迷雾街区道具
                case DataResourceFunc_1.DataResourceType.FOGITEM:
                    var propNum = propTab[tempReward[1]] ? propTab[tempReward[1]] : 0;
                    propTab[tempReward[1]] = propNum + Number(tempReward[2]) * doubleRate;
                    break;
                //活跃度
                case DataResourceFunc_1.DataResourceType.TASKPOINT:
                    point += Number(tempReward[1]);
                    break;
                //名声
                case DataResourceFunc_1.DataResourceType.REPUTE:
                    repute += Number(tempReward[1]);
                    break;
            }
        }
        //货币消耗
        if (cost.length != 0) {
            var costArr = cost;
            //货币消耗
            switch (Number(costArr[0])) {
                //钻石
                case DataResourceFunc_1.DataResourceType.GOLD:
                    totalGold = BigNumUtils_1.default.substract(totalGold, Number(costArr[1]));
                    break;
                //金币   
                case DataResourceFunc_1.DataResourceType.COIN:
                    totalCoin = BigNumUtils_1.default.substract(totalCoin, Number(costArr[1]));
                    break;
                //迷雾币    
                case DataResourceFunc_1.DataResourceType.FOGCOIN:
                    totalFogCoin -= Number(costArr[1]);
                    break;
                //零件    
                case DataResourceFunc_1.DataResourceType.COMP:
                    totalComp -= Number(costArr[1]);
                    break;
                //行动力    
                case DataResourceFunc_1.DataResourceType.ACT:
                    totalAct -= Number(costArr[1]);
                    break;
                //迷雾道具    
                case DataResourceFunc_1.DataResourceType.FOGITEM:
                    var costNum = propTab[costArr[1]] ? propTab[costArr[1]] : 0;
                    propTab[costArr[1]] = costNum - Number(costArr[2]);
                    break;
                //碎片  
                case DataResourceFunc_1.DataResourceType.PIECE:
                    var pieceId = costArr[1];
                    var costNum = pieces[pieceId] ? propTab[pieceId] : 0;
                    if (Number(costArr[2]) != 0) {
                        pieceTab[pieceId] = costNum - Number(costArr[2]);
                    }
                    break;
            }
        }
        if (totalCoin != "0") {
            upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), totalCoin);
        }
        if (totalGold != "0") {
            upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getGold(), totalGold);
        }
        if (totalFogCoin != 0) {
            upData["fogCoin"] = UserModel_1.default.instance.getFogCoinNum() + totalFogCoin;
        }
        if (totalSp != 0) {
            UserExtModel_1.default.instance.changeSp(totalSp);
            upData["userExt"] = { "sp": UserExtModel_1.default.instance.getNowSp() };
        }
        if (totalComp != 0) {
            fog["comp"] = FogModel_1.default.instance.getCompNum() + totalComp;
            upData["fog"] = fog;
        }
        if (totalAct != 0) {
            fog["act"] = FogModel_1.default.instance.getActNum() + totalAct;
            upData["fog"] = fog;
        }
        if (point != 0) {
            TaskServer_1.default.updateTaskPoint({ point: point }, null, null, false);
        }
        if (repute != 0) {
            upData["work"] = {
                repute: WorkModel_1.default.instance.getReputeNum() + repute
            };
        }
        if (Object.keys(pieceTab).length != 0) {
            var pieces = {};
            for (var id in pieceTab) {
                pieces[id] = { count: PiecesModel_1.default.instance.getPieceCount(id) + pieceTab[id] };
            }
            upData["pieces"] = pieces;
        }
        if (Object.keys(propTab).length != 0) {
            var prop = {};
            var propInfo;
            for (var id in propTab) {
                propInfo = FogFunc.instance.getItemInfo(id);
                if (propInfo.type == FogPropTrigger_1.default.ITEM_TYPE_CANUP) {
                    prop[id] = Math.min(FogModel_1.default.instance.getPropNum(id) + Number(propTab[id]), propInfo.maxLevel);
                }
                else {
                    prop[id] = FogModel_1.default.instance.getPropNum(id) + Number(propTab[id]);
                }
            }
            fog["prop"] = prop;
            upData["fog"] = fog;
        }
        return upData;
    }
    /**获取地图上的icon显示 */
    getMapIcon(icon) {
        return "fog/fog/" + icon + ".png";
    }
    //根据多组数组获得fog数据变更
    getFogUpDataByMultiArr(rewardArr = [], isAdd = true) {
        var upData = {};
        var tempReward;
        var totalCoin = "0";
        var totalGold = "0";
        var totalFogCoin = 0;
        var totalSp = 0;
        var totalComp = 0;
        var totalAct = 0;
        var pieceTab = {};
        var propTab = {};
        var fog = {};
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
                //体力    
                case DataResourceFunc_1.DataResourceType.SP:
                    totalSp += Number(tempReward[1]);
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
            if (isAdd) {
                upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), totalCoin);
            }
            else {
                upData["coin"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getCoin(), totalCoin);
            }
        }
        if (totalGold != "0") {
            if (isAdd) {
                upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), totalGold);
            }
            else {
                upData["giftGold"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getCoin(), totalGold);
            }
        }
        if (totalFogCoin != 0) {
            if (isAdd) {
                upData["fogCoin"] = UserModel_1.default.instance.getFogCoinNum() + totalFogCoin;
            }
            else {
                upData["fogCoin"] = UserModel_1.default.instance.getFogCoinNum() - totalFogCoin;
            }
        }
        if (totalSp != 0) {
            if (isAdd) {
                UserExtModel_1.default.instance.changeSp(totalSp);
            }
            else {
                UserExtModel_1.default.instance.changeSp(-totalSp);
            }
            upData["userExt"] = { "sp": UserExtModel_1.default.instance.getNowSp() };
        }
        if (totalComp != 0) {
            if (isAdd) {
                fog["comp"] = FogModel_1.default.instance.getCompNum() + totalComp;
            }
            else {
                fog["comp"] = FogModel_1.default.instance.getCompNum() - totalComp;
            }
            upData["fog"] = fog;
        }
        if (totalAct != 0) {
            if (isAdd) {
                fog["act"] = FogModel_1.default.instance.getActNum() + totalAct;
            }
            else {
                fog["act"] = FogModel_1.default.instance.getActNum() - totalAct;
            }
            upData["fog"] = fog;
        }
        if (Object.keys(pieceTab).length != 0) {
            var pieces = {};
            for (var id in pieceTab) {
                if (isAdd) {
                    pieces[id] = { count: PiecesModel_1.default.instance.getPieceCount(id) + Number(pieceTab[id]) };
                }
                else {
                    pieces[id] = { count: PiecesModel_1.default.instance.getPieceCount(id) - Number(pieceTab[id]) };
                }
            }
            upData["pieces"] = pieces;
        }
        if (Object.keys(propTab).length != 0) {
            var prop = {};
            var propInfo;
            var num1, num2;
            for (var id in propTab) {
                if (isAdd) {
                    num1 = FogModel_1.default.instance.getPropNum(id) + Number(propTab[id]);
                    propInfo = this.getItemInfo(id);
                    //可升级道具
                    if (propInfo.type == FogPropTrigger_1.default.ITEM_TYPE_CANUP) {
                        if (num1 > propInfo.maxLevel) {
                            num1 = propInfo.maxLevel;
                        }
                    }
                    prop[id] = num1;
                }
                else {
                    num2 = FogModel_1.default.instance.getPropNum(id) - Number(propTab[id]);
                    prop[id] = Math.max(num2, 0);
                }
            }
            fog["prop"] = prop;
            upData["fog"] = fog;
        }
        return upData;
    }
    //获取宝箱info
    getBoxInfo(id) {
        return this.getCfgDatas("Box_json", id);
    }
    //根据道具id获取能折算的零件
    getExchangeCompByItem(itemArr = []) {
        var compNum = 0;
        var itemInfo;
        var tempCompNum = 0;
        if (itemArr.length > 0) {
            for (var i = 0; i < itemArr.length; i++) {
                itemInfo = this.getItemInfo(itemArr[i]);
                tempCompNum = itemInfo.sellPrice ? itemInfo.sellPrice : 0;
                compNum += tempCompNum;
            }
        }
        return compNum;
    }
    getRandomNameById(id) {
        return this.getCfgDatasByKey("RandomName_json", id, "nameType");
    }
    //获取随机名字
    getRandomName() {
        var randomNames = this.getAllCfgData("RandomName_json");
        var rand = GameUtils_1.default.getRandomInt(1, Object.keys(randomNames).length);
        return TranslateFunc_1.default.instance.getTranslate(this.getRandomNameById(rand), "TranslateRandomName");
    }
    getEnemyCfg(id) {
        return this.getCfgDatas("Enemy_json", id);
    }
    //获取敌人的名字
    getEnemyName() {
        var enemyName = this.getRandomName();
        return enemyName;
    }
    //获取敌人的阵容
    getEnemyLine(enemyId, type) {
        var enemyArr = [];
        var enemyIdArr = [];
        //玩家敌人
        if (type == FogConst_1.default.FOG_EVENT_ENEMY_TYPE_PLAYER) {
            var enemyLine = FogModel_1.default.instance.getEnemyInfoById(enemyId).roles;
            for (var id in enemyLine) {
                if (enemyLine.hasOwnProperty(id) && enemyIdArr.indexOf(id) == -1) {
                    //去掉敌方基地
                    if (!enemyLine[id].inLine)
                        continue;
                    if (!BattleFunc_1.default.instance.getCfgDatas("Role", id, true)) {
                        //旧用户迷雾战斗随到新的角色
                        continue;
                    }
                    var data = {};
                    data = {
                        id: id,
                        level: Number(enemyLine[id].level || 1),
                        starLevel: Number(enemyLine[id].starLevel)
                    };
                    enemyIdArr.push(id);
                    enemyArr.push(data);
                }
            }
        }
        //npc敌人
        else if (type == FogConst_1.default.FOG_EVENT_ENEMY_TYPE_NPC) {
            var npcArrayInfo = this.getNpcArrayInfo(enemyId);
            var waveMap = npcArrayInfo.waveMap;
            //[id,怪物等级,怪物星级,怪物装备ID,……;
            for (var i = 0; i < waveMap.length; i++) {
                var waveArr = waveMap[i];
                if (enemyIdArr.indexOf(waveArr[0]) == -1) {
                    var data = {};
                    data = {
                        id: waveArr[0],
                        level: Number(waveArr[1]),
                        starLevel: Number(waveArr[2])
                    };
                    enemyIdArr.push(id);
                    enemyArr.push(data);
                }
            }
        }
        enemyArr.splice(6, enemyArr.length - 6);
        return enemyArr;
    }
    /**
         * 获取敌人最高等级的角色
         * @param line  阵容
         */
    getEnemyHighRole(line) {
        var highId;
        var highLevel;
        for (var id in line) {
            if (line.hasOwnProperty(id)) {
                var info = line[id];
                if (!info.inLine)
                    continue;
                var level = Number(info.level);
                if (!highLevel || highLevel < level) {
                    highId = id;
                    highLevel = level;
                }
            }
        }
        return highId;
    }
    /**获取和传入战力最接近的敌人NpcId */
    getNpcEnemyIdByForce(force) {
        var cfg = this.getAllCfgData("NpcArray");
        var offest = 0;
        var npcId;
        for (var key in cfg) {
            if (cfg.hasOwnProperty(key)) {
                var element = cfg[key];
                var enemyForce = element.power;
                var nowOffest = Math.abs(force - enemyForce);
                if (!offest || offest > nowOffest) {
                    offest = nowOffest;
                    npcId = key;
                }
            }
        }
        return npcId;
    }
    //获取npc阵容配置
    getNpcArrayInfo(id) {
        return this.getCfgDatas("NpcArray_json", id);
    }
    /**获取一个玩家角色id */
    getOneRoleId() {
        var result;
        var fogline = FogModel_1.default.instance.getLine();
        var roleLine = RolesModel_1.default.instance.getRolesList();
        var homeId = GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId");
        for (var id in roleLine) {
            if (Number(id) != homeId && !fogline[id]) {
                result = id;
                break;
            }
        }
        return result;
    }
    /**根据方向获取车的图片 */
    getBusImgByRotate(rotate) {
        return "fog/fog/fogstreet_bus0" + rotate + ".png";
    }
    /**根据方向获取出口的图片 */
    getExitImgByRotate(rotate) {
        return "fog/fog/fogstreet_box_exit_0" + rotate + ".png";
    }
    /**根据地块获取地图块的图片 */
    getMapImgBySign(name, xIndex, yIndex) {
        var url = "fog/fog/" + name;
        var index = 0;
        if (xIndex % 2 == 0) {
            //偶数列
            if (yIndex % 2 == 0) {
                //偶数行
                index = 4;
            }
            else {
                //奇数行
                index = 2;
            }
        }
        else {
            //奇数列
            if (yIndex % 2 == 0) {
                //偶数行
                index = 3;
            }
            else {
                //奇数行
                index = 1;
            }
        }
        url += "_0" + index + ".png";
        return url;
    }
    /**获取雾的前缀 */
    getMaskImgFrontBySign(xIndex, yIndex) {
        var name = "fog/fog/fogstreet_fog";
        var index = 0;
        if (yIndex % 2 == 0) {
            //偶数行
            index = xIndex + FogFunc.line;
        }
        else {
            index = xIndex;
        }
        if (index < 10) {
            return name + "0" + index;
        }
        else {
            return name + index;
        }
    }
    //用于迷雾模式飘奖励
    getResourceIcon(reward) {
        var itemIcon = "";
        switch (Number(reward[0])) {
            //碎片
            case DataResourceFunc_1.DataResourceType.PIECE:
                var pieceId = reward[1];
                itemIcon = FogFunc.instance.getEquipIcon(pieceId);
                break;
            //行动力
            case DataResourceFunc_1.DataResourceType.ACT:
                itemIcon = ResourceConst_1.default.ACT_PNG;
                break;
            //零件
            case DataResourceFunc_1.DataResourceType.COMP:
                itemIcon = ResourceConst_1.default.COMP_PNG;
                break;
            //迷雾币
            case DataResourceFunc_1.DataResourceType.FOGCOIN:
                itemIcon = ResourceConst_1.default.FOGCOIN_PNG;
                break;
            //迷雾街区道具
            case DataResourceFunc_1.DataResourceType.FOGITEM:
                itemIcon = FogFunc.instance.getFogItemIcon(reward[1]);
                break;
            //钻石
            case DataResourceFunc_1.DataResourceType.GOLD:
                itemIcon = "uisource/video/video/video_image_zuanshi.png";
                break;
            //金币   
            case DataResourceFunc_1.DataResourceType.COIN:
                itemIcon = "uisource/video/video/video_image_lixianjinbi.png";
                break;
        }
        return itemIcon;
    }
    //飘资源
    flyToMainIcon(resId, value, fromx, fromy, delay = 0, fromCtn = null, toPos = null, callBack = null, thisObj = null) {
        LogsManager_1.default.echo("获得资源:", resId, "value:", value, fromx, fromy);
        //获取金币icon
        var iconPath = FogFunc.instance.getResourceIcon([resId, value]);
        var cacheItem = PoolTools_1.default.getItem(iconPath);
        if (!cacheItem) {
            cacheItem = new Laya.Image(iconPath);
            cacheItem["cacheParams"] = {};
        }
        if (!fromCtn) {
            fromCtn = WindowManager_1.default.getUIByName("FogMainUI");
        }
        var tempPos = BattleFunc_1.default.tempClickPoint;
        tempPos.x = fromx;
        tempPos.y = fromy;
        cacheItem.name = iconPath;
        cacheItem.pos(tempPos.x, tempPos.y, true);
        fromCtn.addChild(cacheItem);
        cacheItem.visible = false;
        var toPosX;
        var toPosY;
        if (resId == DataResourceFunc_1.DataResourceType.FOGITEM) {
            toPosX = 90;
            toPosY = Laya.stage.height - 100;
            cacheItem.scale(0.7, 0.7);
        }
        else if (resId == DataResourceFunc_1.DataResourceType.COMP) {
            toPosX = 20;
            toPosY = 10 + ScreenAdapterTools_1.default.toolBarWidth;
            cacheItem.scale(0.4, 0.4);
        }
        else if (resId == DataResourceFunc_1.DataResourceType.ACT) {
            toPosX = 200;
            toPosY = 10 + ScreenAdapterTools_1.default.toolBarWidth;
            cacheItem.scale(0.4, 0.4);
        }
        else {
            if (toPos) {
                toPosX = toPos.x;
                toPosY = toPos.y;
            }
            else {
                var fogMainUI = WindowManager_1.default.getUIByName("FogMainUI");
                var toTempPos = BattleFunc_1.default.tempClickPoint;
                toTempPos.x = fromx;
                toTempPos.y = fromy;
                var toPosGlobal = fogMainUI.fogRewardGroup.localToGlobal(toTempPos, false, fogMainUI);
                toPosX = toPosGlobal.x;
                toPosY = toPosGlobal.y;
            }
            cacheItem.scale(0.7, 0.7);
        }
        var thisGlobalPos = fromCtn.localToGlobal(tempPos); //坐标转换
        var tweenParams = cacheItem["cacheParams"];
        tweenParams.x = toPosX;
        tweenParams.y = toPosY;
        tweenParams.globalX = thisGlobalPos.x;
        tweenParams.globalY = thisGlobalPos.y;
        tweenParams.initX = fromx;
        tweenParams.initY = fromy;
        //做缓动    
        if (delay) {
            TimerManager_1.default.instance.add(this.delayFlyItem, this, delay, 1, false, [cacheItem, callBack, thisObj]);
        }
        else {
            TimerManager_1.default.instance.add(this.delayFlyItem, this, 10, 1, false, [cacheItem, callBack, thisObj]);
        }
    }
    delayFlyItem(cacheItem, callBack = null, thisObj = null) {
        var initX = cacheItem["cacheParams"].initX;
        var initY = cacheItem["cacheParams"].initY;
        var toPosX = cacheItem["cacheParams"].x;
        var toPosY = cacheItem["cacheParams"].y;
        var globalX = cacheItem["cacheParams"].globalX;
        var globalY = cacheItem["cacheParams"].globalY;
        cacheItem.visible = true;
        cacheItem.x = initX;
        cacheItem.y = initY;
        Laya.Tween.to(cacheItem, { x: initX + toPosX - globalX, y: initY + toPosY - globalY }, 600, null, Laya.Handler.create(this, () => {
            this.onItemTweenEnd(cacheItem);
            callBack && callBack.call(this);
        }));
    }
    //缓动结束 移除icon
    onItemTweenEnd(cacheItem) {
        cacheItem.removeSelf();
        Laya.Tween.clearAll(cacheItem);
        PoolTools_1.default.cacheItem(cacheItem.name, cacheItem);
    }
    //闪烁效果
    resTwinkleTween(resId, count = 3, callBack = null, thisObj = null) {
        var obj = WindowManager_1.default.getUIByName("FogMainUI");
        var tweenItem;
        if (resId == DataResourceFunc_1.DataResourceType.COMP) {
            tweenItem = obj.conImg;
        }
        else if (resId == DataResourceFunc_1.DataResourceType.ACT) {
            tweenItem = obj.actImg;
        }
        else if (resId == DataResourceFunc_1.DataResourceType.FOGITEM) {
            tweenItem = obj.bagBtn;
        }
        tweenItem.alpha = 1;
        var index = 1;
        for (var i = 1; i <= count; i++) {
            TimerManager_1.default.instance.setTimeout(() => {
                Laya.Tween.to(tweenItem, { alpha: 0 }, 300, null, Laya.Handler.create(this, () => {
                    Laya.Tween.to(tweenItem, { alpha: 1 }, 300, null, Laya.Handler.create(this, () => {
                        index++;
                        if (index == count) {
                            Laya.Tween.clearAll(tweenItem);
                            callBack && callBack.call(thisObj);
                        }
                    }));
                }));
            }, this, (i - 1) * 600);
        }
    }
    //获得道具动画
    getFogItemTween(resId = DataResourceFunc_1.DataResourceType.FOGITEM, itemId, fromX = null, fromY = null, delay = 0, fromUI = null) {
        //默认是FogMain界面
        var fogMainUI = WindowManager_1.default.getUIByName("FogMainUI");
        if (!fromUI) {
            fromUI = fogMainUI;
        }
        //飘到背包位置，然后在背包按钮上方显示道具名字，并播放背包图标闪烁效果
        if ((fromX || fromX == 0) && (fromY || fromY == 0)) {
            FogFunc.instance.flyToMainIcon(resId, itemId, fromX, fromY, delay, fromUI);
        }
        else {
            FogFunc.instance.flyToMainIcon(resId, itemId, 0.4 * Laya.stage.width, 0.5 * Laya.stage.height, delay, fromUI);
        }
        //显示道具名字
        var itemInfo = FogFunc.instance.getItemInfo(itemId);
        var fogMainUI = WindowManager_1.default.getUIByName("FogMainUI");
        fogMainUI.itemName.text = TranslateFunc_1.default.instance.getTranslate(itemInfo.name, "TranslateItem");
        //背包图标闪烁
        this.resTwinkleTween(resId, 3, () => {
            fogMainUI.itemName.text = "";
        }, this);
    }
    //获得货币动画
    getFogResTween(resId, value, fromX = null, fromY = null, delay = 0, fromUI = null) {
        //默认是FogMain界面
        var fogMainUI = WindowManager_1.default.getUIByName("FogMainUI");
        if (!fromUI) {
            fromUI = fogMainUI;
        }
        //飘到顶部资源栏行动力的位置，然后播放资源图标闪烁+资源数字跳动效果。
        if ((fromX || fromX == 0) && (fromY || fromY == 0)) {
            FogFunc.instance.flyToMainIcon(resId, value, fromX, fromY, delay, fromUI);
        }
        else {
            FogFunc.instance.flyToMainIcon(resId, value, 0.4 * Laya.stage.width, 0.5 * Laya.stage.height, delay, fromUI);
        }
        //资源图标闪烁
        this.resTwinkleTween(resId);
        //资源文本滚动
        this.resTxtTween(resId, value);
    }
    //数字跳动
    resTxtTween(resId, value) {
        var thisObj = WindowManager_1.default.getUIByName("FogMainUI");
        if (resId == DataResourceFunc_1.DataResourceType.COMP) {
            thisObj.conNum.scaleX = thisObj.conNum.scaleY = 1;
            Laya.Tween.to(thisObj.conNum, { scaleX: 1.3, scaleY: 1.3 }, 100, null, Laya.Handler.create(this, () => {
                thisObj.conNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getCompNum() + "");
                thisObj.conNum.color = "#02a43c";
                //刷新大巴车购买红点
                Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_BUS);
            }));
            TimerManager_1.default.instance.setTimeout(() => {
                thisObj.conNum.scaleX = thisObj.conNum.scaleY = 1;
                thisObj.conNum.color = "#000000";
            }, this, 600);
        }
        else if (resId == DataResourceFunc_1.DataResourceType.ACT) {
            thisObj.actNum.scaleX = thisObj.actNum.scaleY = 1;
            Laya.Tween.to(thisObj.actNum, { scaleX: 1.3, scaleY: 1.3 }, 100, null, Laya.Handler.create(this, () => {
                thisObj.actNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getActNum() + "");
                thisObj.actNum.color = "#02a43c";
            }));
            TimerManager_1.default.instance.setTimeout(() => {
                thisObj.actNum.scaleX = thisObj.actNum.scaleY = 1;
                thisObj.actNum.color = "#000000";
            }, this, 600);
        }
    }
    //飘奖励
    flyResTween(rewardArr, fromX = null, fromY = null, fromUI = null) {
        var resId;
        var value;
        var index = 0;
        var oherRewardArr = [];
        //行动力、零件、迷雾道具展示
        for (var i = 0; i < rewardArr.length; i++) {
            resId = Number(rewardArr[i][0]);
            value = Number(rewardArr[i][1]);
            if (resId == DataResourceFunc_1.DataResourceType.FOGITEM) {
                FogFunc.instance.getFogItemTween(resId, value, fromX, fromY, index * 150, fromUI);
                index++;
            }
            else if (resId == DataResourceFunc_1.DataResourceType.ACT || resId == DataResourceFunc_1.DataResourceType.COMP) {
                FogFunc.instance.getFogResTween(resId, value, fromX, fromY, index * 150, fromUI);
                index++;
            }
            else {
                oherRewardArr.push(rewardArr[i]);
            }
        }
        //局外奖励展示
        for (var i = 0; i < oherRewardArr.length; i++) {
            this.getOtherFogRewardTween(oherRewardArr[i], i, fromX, fromY, fromUI);
        }
    }
    createResItem(reward, index, fromUI = null) {
        //底框
        var item = new Laya.Image("uisource/expedition/expedition/expedition_image_di.png");
        item.width = 149;
        item.height = 46;
        item.x = -50;
        item.y = index * (item.height + 38);
        //资源图标
        var result = this.getResourceShowInfo(reward, true);
        var resImg = new Laya.Image(result["icon"]);
        var userNum = result["userNum"];
        var addResNum = result["num"];
        resImg.scaleX = resImg.scaleY = result["scale"];
        resImg.x = resImg.y = 25;
        resImg.anchorX = resImg.anchorY = 0.5;
        resImg.name = "resImg";
        item.addChild(resImg);
        //当前资源文本
        var resNum = new Laya.Text();
        resNum.fontSize = 22;
        resNum.color = "#000000";
        resNum.bold = true;
        resNum.x = 54;
        resNum.y = 18;
        var showNum;
        if (Number(reward[0]) == DataResourceFunc_1.DataResourceType.COIN || Number(reward[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            showNum = BigNumUtils_1.default.substract(userNum, addResNum);
        }
        else {
            showNum = userNum - addResNum < 0 ? 0 : userNum - addResNum;
        }
        resNum.text = StringUtils_1.default.getCoinStr(showNum);
        resNum.name = "resNum";
        item.addChild(resNum);
        //获得资源增加
        var addNum = new Laya.Text();
        addNum.fontSize = 22;
        addNum.color = "#02a43c";
        addNum.bold = true;
        addNum.x = 39.5;
        addNum.y = 54;
        addNum.name = "addNum";
        addNum.text = " + " + StringUtils_1.default.getCoinStr(addResNum);
        item.addChild(addNum);
        var thisObj = WindowManager_1.default.getUIByName("FogMainUI");
        if (fromUI) {
            thisObj = fromUI;
        }
        var fogRewardGroup = new Laya.Image();
        fogRewardGroup.x = 0;
        fogRewardGroup.y = 210;
        thisObj.addChild(fogRewardGroup);
        fogRewardGroup.addChild(item);
        return [item, userNum, addResNum];
    }
    //局外奖励展示
    getOtherFogRewardTween(reward, index, fromX = null, fromY = null, fromCtn = null) {
        //默认FogMain界面
        var fromUI = WindowManager_1.default.getUIByName("FogMainUI");
        if (fromCtn) {
            fromUI = fromCtn;
        }
        //创建局外奖励item
        var result = this.createResItem(reward, index, fromUI);
        var item = result[0];
        var userNum = result[1];
        var addResNum = result[2];
        //播放item动画：在地图左上侧弹出；如果同时获得多个奖励，的弹出多个弹出条，按顺序向下排列
        TimerManager_1.default.instance.setTimeout(() => {
            //出现
            Laya.Tween.to(item, { x: 0 }, 100, null, Laya.Handler.create(this, () => {
                //飘资源
                var fromx;
                var fromy;
                if ((fromX || fromX == 0) && (fromY || fromY == 0)) {
                    fromx = fromX;
                    fromy = fromY;
                }
                else {
                    fromx = 0.4 * Laya.stage.width;
                    fromy = 0.5 * Laya.stage.height;
                }
                var toTempPos = BattleFunc_1.default.tempClickPoint;
                toTempPos.x = item.x;
                toTempPos.y = item.y;
                var toPosGlobal = item.localToGlobal(toTempPos, false, fromUI);
                var toPosX = toPosGlobal.x;
                var toPosY = toPosGlobal.y;
                this.flyToMainIcon(Number(reward[0]), Number(reward[1]), fromx, fromy, 0, fromUI, { "x": toPosX, "y": toPosY }, () => {
                    this.txtTween(item, userNum, addResNum);
                }, this);
            }));
        }, this, index * 100);
    }
    txtTween(item, userNum, addResNum) {
        //然后播放数字变化效果。最后弹回消失。
        var resNum = item.getChildByName("resNum");
        var addNum = item.getChildByName("addNum");
        resNum.scaleX = resNum.scaleY = 1;
        Laya.Tween.to(resNum, { scaleX: 1.3, scaleY: 1.3 }, 100, null, Laya.Handler.create(this, () => {
            resNum.text = StringUtils_1.default.getCoinStr(userNum);
            resNum.color = "#02a43c";
            addNum.visible = false;
        }));
        TimerManager_1.default.instance.setTimeout(() => {
            resNum.scaleX = resNum.scaleY = 1;
            resNum.color = "#000000";
        }, this, 600);
        TimerManager_1.default.instance.setTimeout(() => {
            Laya.Tween.to(item, { x: -50 }, 100, null, Laya.Handler.create(this, () => {
                Laya.Tween.clearAll(item);
                item.removeSelf();
            }));
        }, this, 800);
    }
    //将奖励数组转换成table： rewardArr:[[], [], []]
    vertRewardArrToTable(rewardArr) {
        var reward = {};
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
            reward[DataResourceFunc_1.DataResourceType.COIN] = totalCoin;
        }
        if (totalGold != "0") {
            reward[DataResourceFunc_1.DataResourceType.GOLD] = totalGold;
        }
        if (totalFogCoin != 0) {
            reward[DataResourceFunc_1.DataResourceType.FOGCOIN] = totalFogCoin;
        }
        if (totalComp != 0) {
            reward[DataResourceFunc_1.DataResourceType.COMP] = totalComp;
        }
        if (totalAct != 0) {
            reward[DataResourceFunc_1.DataResourceType.ACT] = totalAct;
        }
        if (Object.keys(pieceTab).length != 0) {
            reward[DataResourceFunc_1.DataResourceType.PIECE] = pieceTab;
        }
        if (Object.keys(propTab).length != 0) {
            reward[DataResourceFunc_1.DataResourceType.FOGITEM] = propTab;
        }
        return reward;
    }
    //将奖励Table转换成数组
    vertRewardTableToArr(reward) {
        var rewardArr = [];
        for (var resId in reward) {
            if (reward.hasOwnProperty(resId)) {
                if (Number(resId) == DataResourceFunc_1.DataResourceType.FOGITEM || Number(resId) == DataResourceFunc_1.DataResourceType.PIECE) {
                    if (Object.keys(reward[resId]).length != 0) {
                        var items = reward[resId];
                        for (var id in items) {
                            rewardArr.push([resId, id, items[id]]);
                        }
                    }
                }
                else {
                    rewardArr.push([resId, reward[resId]]);
                }
            }
        }
        return rewardArr;
    }
    //道具总积分
    getItemScore() {
        var score = 0;
        var props = FogModel_1.default.instance.getProp();
        var marks = 1;
        if (Object.keys(props).length != 0) {
            for (var propId in props) {
                marks = this.getCfgDatasByKey("Item_json", propId, "marks");
                score += (props[propId] * marks);
            }
        }
        return score;
    }
    //事件总积分
    getEventScore() {
        return FogModel_1.default.instance.getCountsById(FogConst_1.default.fog_finish_event_score);
    }
    //获得总积分
    getScore() {
        // 总积分 = 本局最大层数 * A + 本局累计获得局内代币数量 * B + 本局道具总积分 + 本局事件总积分
        // 道具总积分 = 最终玩家身上携带的道具积分之和，单个道具的积分单独配置在道具升级表中。
        // 事件总积分 = 局内完成
        var totalScore = 0;
        var maxLayer = FogModel_1.default.instance.getCurLayer();
        var compNum = FogModel_1.default.instance.getCompNum();
        var layerMark = GlobalParamsFunc_1.default.instance.getDataNum("layerMark");
        var componentMark = GlobalParamsFunc_1.default.instance.getDataNum("componentMark");
        var itemScore = this.getItemScore();
        var eventScore = this.getEventScore();
        //总计分
        totalScore = maxLayer * layerMark + compNum * componentMark + itemScore + eventScore;
        return totalScore;
    }
    //计算结算获得的金币和迷雾币
    calcuResultReward(score, addPercent = 1) {
        if (!this.allMarks) {
            this.allMarks = this.getAllCfgData("MarkReward");
        }
        var powerRange = [0, 10000];
        var coin = [0, 150];
        var fogCoin = [0, 15];
        for (var id in this.allMarks) {
            powerRange = this.allMarks[id].powerRange;
            if (score >= Number(powerRange[0]) && score < Number(powerRange[1])) {
                coin = this.allMarks[id].coin;
                fogCoin = this.allMarks[id].fogCoin;
                break;
            }
        }
        //奖励数值=本区间基础奖励+（积分-本区间积分下限）*每点积分额外奖励
        var rewardCoin = Math.floor((coin[0] + Math.floor((score - powerRange[0]) * coin[1] / 10000)) * addPercent);
        var rewardFogCoin = Math.floor((fogCoin[0] + Math.floor((score - powerRange[0]) * fogCoin[1] / 10000)) * addPercent);
        return [rewardCoin, rewardFogCoin];
    }
    //判断是否有满级的道具
    hasItemFullLevel() {
        var itemArr = [];
        var props = FogModel_1.default.instance.getProp();
        if (Object.keys(props).length != 0) {
            var propInfo;
            for (var propId in props) {
                propInfo = this.getItemInfo(propId);
                //可升级道具
                if (propInfo.type == FogPropTrigger_1.default.ITEM_TYPE_CANUP) {
                    if (Number(props[propId]) > propInfo.maxLevel) {
                        itemArr.push(propId);
                    }
                }
            }
        }
        if (itemArr.length != 0) {
            return [true, itemArr];
        }
        return [false];
    }
    getRandomRoleId(index) {
        var roleId = "";
        //从随机池中取前两个角色
        var fogRoleRandom = GlobalParamsFunc_1.default.instance.getDataArray("fogRoleRandom");
        var fogRoleRandomFirstStr = fogRoleRandom[index];
        var roleIdArr = fogRoleRandomFirstStr.split(",");
        //排除掉没有解锁的角色
        var roleArr = [];
        var allRole = RolesModel_1.default.instance.getRolesList();
        for (var i = 0; i < roleIdArr.length; i++) {
            if (allRole.hasOwnProperty(roleIdArr[i])) {
                roleArr.push(roleIdArr[i]);
            }
        }
        if (roleArr.length != 0) {
            var firstIndex = GameUtils_1.default.getRandomInt(0, roleArr.length - 1);
            roleId = roleArr[firstIndex];
        }
        return roleId;
    }
    //初始化迷雾开场用的角色
    initFogRoles() {
        var roleIdResultList = [];
        var firstRoleId = "";
        var secondRoleId = "";
        //从随机池中取前两个角色
        firstRoleId = this.getRandomRoleId(0);
        if (firstRoleId != "") {
            roleIdResultList.push(firstRoleId);
        }
        secondRoleId = this.getRandomRoleId(1);
        if (secondRoleId != "") {
            roleIdResultList.push(secondRoleId);
        }
        //从玩家所有已解锁角色中，随机2个作为初始角色；看视频，可随机获得第3个初始角色
        var roleIdList = [];
        if (firstRoleId == "" && secondRoleId != "") {
            roleIdList = FogModel_1.default.instance.randomRoleIdList(2, [secondRoleId]);
            for (var i = 0; i < roleIdList.length; i++) {
                roleIdResultList.push(roleIdList[i]);
            }
        }
        else if (firstRoleId != "" && secondRoleId == "") {
            roleIdList = FogModel_1.default.instance.randomRoleIdList(2, [firstRoleId]);
            if (roleIdList.length > 0) {
                var tempArr = [];
                if (roleIdList.length == 1) {
                    tempArr.push(roleIdList[0]);
                    tempArr.push(roleIdResultList[0]);
                }
                else {
                    tempArr.push(roleIdList[0]);
                    tempArr.push(roleIdResultList[0]);
                    tempArr.push(roleIdList[1]);
                }
                roleIdResultList = tempArr;
            }
        }
        else if (firstRoleId != "" && secondRoleId != "") {
            roleIdResultList.push(FogModel_1.default.instance.randomRoleIdList(1, [firstRoleId, secondRoleId])[0]);
        }
        else {
            roleIdResultList = FogModel_1.default.instance.randomRoleIdList(3);
        }
        return roleIdResultList;
    }
}
exports.default = FogFunc;
//地图的宽高
FogFunc.mapWidth = 640;
FogFunc.mapHeight = 896;
//行数
FogFunc.row = 7;
//列数
FogFunc.line = 5;
//单个格子的宽高
FogFunc.itemWidth = 128;
FogFunc.itemHeight = 128;
FogFunc.busWidth = 70;
FogFunc.busHeight = 120;
//ui中显示数量的数据类型
FogFunc.showNumInUI = [
    DataResourceFunc_1.DataResourceType.COIN,
    DataResourceFunc_1.DataResourceType.GOLD,
    DataResourceFunc_1.DataResourceType.FOGCOIN,
    DataResourceFunc_1.DataResourceType.COMP,
    DataResourceFunc_1.DataResourceType.ACT,
    DataResourceFunc_1.DataResourceType.PIECE
];
FogFunc.showTweenType = [
    DataResourceFunc_1.DataResourceType.COMP,
    DataResourceFunc_1.DataResourceType.ACT,
    DataResourceFunc_1.DataResourceType.FOGITEM
];
//局外奖励类型金币、钻石、装备、碎片。
FogFunc.fogOuterRewardType = [
    DataResourceFunc_1.DataResourceType.GOLD,
    DataResourceFunc_1.DataResourceType.COIN,
    DataResourceFunc_1.DataResourceType.FOGITEM,
    DataResourceFunc_1.DataResourceType.PIECE,
];
//# sourceMappingURL=FogFunc.js.map