"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Message_1 = require("../../../framework/common/Message");
const UserInfo_1 = require("../../../framework/common/UserInfo");
const Client_1 = require("../../../framework/common/kakura/Client");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
const CacheManager_1 = require("../../../framework/manager/CacheManager");
const StorageCode_1 = require("../consts/StorageCode");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const GameMainEvent_1 = require("../event/GameMainEvent");
const Global_1 = require("../../../utils/Global");
const RolesFunc_1 = require("../func/RolesFunc");
const UserGlobalModel_1 = require("../../../framework/model/UserGlobalModel");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const LevelFunc_1 = require("../func/LevelFunc");
const SceneReference_1 = require("../../../framework/consts/SceneReference");
const WhiteListFunc_1 = require("../../../framework/func/WhiteListFunc");
const UserEvent_1 = require("../event/UserEvent");
const SevenDayServer_1 = require("../server/SevenDayServer");
const UserExtServer_1 = require("../server/UserExtServer");
const InviteFunc_1 = require("../func/InviteFunc");
const FogEvent_1 = require("../event/FogEvent");
const UserExtModel_1 = require("./UserExtModel");
const TaskServer_1 = require("../server/TaskServer");
class UserModel extends BaseModel_1.default {
    constructor() {
        super(...arguments);
        this.incomeCoin = {};
        this.refuseAuth = "refuseWxAuth";
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new UserModel();
        }
        return this._instance;
    }
    //获取用户的rid
    getUserRid() {
        if (!this._data) {
            return "nologin";
        }
        return this._data.uid;
    }
    getRidMark() {
        return this._data.ridMark || 123456;
    }
    initData(d) {
        super.initData(d);
        UserInfo_1.default.platform.initChannelUserId(this.getUserRid());
        this.setGuideCache();
        SingleCommonServer_1.default.initData();
    }
    updateData(d) {
        var coinFlag = false;
        if (d.coin) {
            if (BigNumUtils_1.default.compare(d.coin, UserModel.instance.getLogicCoin())) {
                var oldNum = UserModel.instance.getLogicCoin();
                coinFlag = true;
            }
        }
        super.updateData(d);
        //根据需要发送事件通知ui刷新
        /**刷新主界面钱 */
        if (d.coin || d.coin == 0 || d.giftGold || d.giftGold == 0 || d.gold || d.gold == 0) {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY);
            if (coinFlag) {
                Message_1.default.instance.send(UserEvent_1.default.USER_EVET_COIN_CHANGE_TWEEN, { oldNum: oldNum });
            }
        }
        if (d.fogCoin || d.fogCoin == 0) {
            Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_FOGCOIN);
        }
        this.setGuideCache();
    }
    deleteData(d) {
        super.deleteData(d);
        //根据需要发送事件通知ui刷新
    }
    //获取名字
    getUserName() {
        // console.log("my name is. :", this._data.maxScore);
        return this._data.name;
    }
    getHeadImage() {
        // console.log("my headImg is :", this._data.headImage);
        var newPath = GameUtils_1.default.getHeadImg(this._data.userInfo.headImage);
        if (newPath) {
            return newPath;
        }
        else {
            return this._data.userInfo.headImage;
        }
    }
    /**获取真正的头像str */
    getUserHead() {
        return this._data.userInfo.headImage;
    }
    /**临时处理后续删除 */
    setNameAndImg(userInfo) {
        if (userInfo["name"]) {
            this._data.name = userInfo["name"];
        }
        if (userInfo["avatarUrl"]) {
            this._data.userInfo.headImage = userInfo["avatarUrl"];
        }
    }
    //获取用户的金币数
    getCoin() {
        return this._data.coin || "0";
    }
    //获取用户逻辑金币数
    getLogicCoin() {
        return "1";
    }
    //获取用户的钻石数
    getGold() {
        return BigNumUtils_1.default.sum((this._data.gold || "0"), (this._data.giftGold || "0"));
    }
    getGiftGold() {
        return this._data.giftGold || "0";
    }
    /**钻石，返回剩余值[giftGold,chargeGold] */
    costGold(num) {
        var giftGold = this._data.giftGold || "0";
        var chargeGold = this._data.gold || "0";
        if (!BigNumUtils_1.default.compare(BigNumUtils_1.default.sum(giftGold, chargeGold), String(num), true)) {
            return ["0", "0"];
        }
        giftGold = BigNumUtils_1.default.substract(giftGold, num);
        if (!BigNumUtils_1.default.compare(giftGold, 0)) {
            chargeGold = BigNumUtils_1.default.sum(chargeGold, giftGold);
            giftGold = "0";
        }
        return [giftGold, chargeGold];
    }
    getVideo() {
        if (this._data.userExt && this._data.userExt.video) {
            return this._data.userExt.video;
        }
        return 0;
    }
    getShopVideo(id) {
        if (this._data.userExt && this._data.userExt.shopVideo && this._data.userExt.shopVideo[id]) {
            return this._data.userExt.shopVideo[id];
        }
        return 0;
    }
    //获取用户的等级
    getLevel() {
        return this.getMaxBattleLevel(); //TODO
        // if (this._data.level) {
        // 	var curlevel = this._data.level <= 30 ? this._data.level : 30;
        // 	return curlevel;
        // }
        // return 1;
    }
    //获取合成单位的最高等级
    getMaxLevel(id) {
        if (this._data.userExt && this._data.userExt.goodsMaxLevel && this._data.userExt.goodsMaxLevel[id]) {
            // return (this._data.userExt.goodsMaxLevel;
            return Number(this._data.userExt.goodsMaxLevel[id]);
        }
        return 0;
    }
    //获取最高关卡等级
    getMaxBattleLevel() {
        if (this._data.userExt && this._data.userExt.maxStage) {
            return this._data.userExt.maxStage;
        }
        return 0;
    }
    /**获取迷雾最大层数 */
    getMaxFogLayer() {
        if (this._data.userExt && this._data.userExt.maxFogLayer) {
            return this._data.userExt.maxFogLayer;
        }
        return 0;
    }
    getRoleBuyInfo(type, roleId = null) {
        var time = 0;
        if (this._data.market) {
            if (roleId) {
                var info = this._data.market[roleId];
                if (info && info[type + "PurchaseTime"]) {
                    time += Number(info[type + "PurchaseTime"]);
                }
            }
            else {
                for (var id in this._data.market) {
                    var info = this._data.market[id];
                    if (info && info[type + "PurchaseTime"]) {
                        time += Number(info[type + "PurchaseTime"]);
                    }
                }
            }
        }
        return time;
    }
    getRoleBuyTimes() {
        if (this._data.userExt && this._data.userExt.buyTimes) {
            return this._data.userExt.buyTimes;
        }
        return 0;
    }
    //获取当前车
    getRole() {
        if (this._data.userExt && this._data.userExt.equipedGoods) {
            return this._data.userExt.equipedGoods;
        }
        return "1";
    }
    //判断当前关卡是否已经能复活过
    isLandDeathRevive(levelId) {
        if (this._data && this._data.levels && this._data.levels[levelId] && this._data.levels[levelId].deathRevive && this._data.levels[levelId].expireTime > Client_1.default.instance.serverTime) {
            return true;
        }
        return false;
    }
    //获取关卡情况
    getBattleLevelById(id) {
        if (this._data.battleLevel && this._data.battleLevel[id]) {
            return this._data.battleLevel[id];
        }
        return {};
    }
    getGoodsAccumuStartTime() {
        if (this._data.userExt && this._data.userExt.goodsAccumuStartTime) {
            return this._data.userExt.goodsAccumuStartTime;
        }
        return 0;
    }
    //获取用户的经验
    getExp() {
        return this._data.exp || 0;
    }
    getSpeedUpTime() {
        return (this._data && this._data.userExt && this._data.userExt.speedUpTime) || 0;
    }
    getSupplyBoxId() {
        return (this._data && this._data.userExt && this._data.userExt.supplyBoxId) || 0;
    }
    getSupplyBoxTime() {
        return (this._data && this._data.userExt && this._data.userExt.supplyBoxTime) || 0;
    }
    getTurnable() {
        return (this._data && this._data.userExt && this._data.userExt.turnable) || 0;
    }
    //判断是否为老用户
    checkIsOld() {
        return (this._data && this._data.userExt && this._data.userExt.isNew) || 0; //isNew认为是老玩家
    }
    //获取用户的新手引导标志
    getMainGuide() {
        var guide = Number((this._data && this._data.userExt && this._data.userExt.newGuide && Number(this._data.userExt.newGuide))) || 0;
        //兼容线上已经进入过迷雾街区并且存储的引导id小于9 默认引导结束
        if (UserExtModel_1.default.instance.getEnterFogFlag() && guide < 9)
            return 17;
        var level = this.getMaxBattleLevel();
        //兼容线上已经错过首个碎片引导的玩家 默认已经完成所有引导
        if (level >= GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock") && guide < 6)
            return 8;
        if (guide == 0) {
            //兼容老用户
            if (level >= 1) {
                return 2;
            }
        }
        return guide;
    }
    //获取用户打点类型（新用户/老用户）
    checkIsNew() {
        return (this._data && this._data.userExt && this._data.userExt.newGuide) || 0;
    }
    //获取用户的邮件列表
    getMails() {
        return this._data.mails;
    }
    //获取间接引导
    getSubGuide() {
        return this._data.guide || {};
    }
    getSubGuideById(id) {
        var guide = this.getSubGuide();
        return guide[id] || 0;
    }
    /**获取授权状态 */
    get isAuthorized() {
        return this._data.isAuthorized;
    }
    /**记录是否已经拒绝授权 */
    setRefuseAuth() {
        CacheManager_1.default.instance.setLocalCache(this.refuseAuth, true);
    }
    /**
     * 获取是否已经拒绝过授权
     * true为已经拒绝过
     */
    getRefuseAuth() {
        var authSta = CacheManager_1.default.instance.getLocalCache(this.refuseAuth);
        return authSta != "0";
    }
    /**根据用户数据记载是否已经授权 */
    setGuideCache() {
        // var guideNum = Number(this.getGuide());
        // if (guideNum >= 1) {
        // }
        //因为没有引导 所以登入后就判定为老用户
        // CacheManager.instance.setFileStorageCache(StorageCode.storage_wxGuide, true);
        if (Global_1.default.isNew()) {
            CacheManager_1.default.instance.setFileStorageCache(StorageCode_1.default.storage_isOldPlayer, true);
        }
    }
    getUserExt() {
        return this._data.userExt;
    }
    getIsNewAccount() {
        return this._data.isNewAccount;
    }
    getSimulateLand() {
        var simulateUnlock = GlobalParamsFunc_1.default.instance.getGlobalCfgDatas("runSiteUnlock").arr;
        var num = 0;
        for (var index in simulateUnlock) {
            if (Number(UserModel.instance.getLevel()) >= Number(simulateUnlock[index])) {
                num++;
            }
        }
        return num;
    }
    getIncomeTime() {
        return this._data && this._data.userExt && this._data.userExt.upCoinTime || 0;
    }
    /**
     * 根据id在裂变顺序表中取操作类型
     */
    getShareTvOrder(id) {
        return this._data.leadShare && this._data.leadShare[id] || 0;
    }
    login() {
        // 判断是否跨天
        if (this.checkIsNewDay()) {
            // 次日首次登陆，分享计数增加
            var signAddShareNum = GlobalParamsFunc_1.default.instance.getDataNum("shareDayNmb");
            UserGlobalModel_1.default.instance.setShareNum(signAddShareNum);
            TaskServer_1.default.delDailyTask();
            //设置登录天数
            SevenDayServer_1.default.setLoginStep();
            //删除每日邀请标识
            UserExtServer_1.default.setEverydayInvite(0);
            //删除每日进入迷雾标识
            UserExtServer_1.default.setDailyFirstEnterFog(0);
        }
        var upData = {};
        var upUserExtData = {};
        upUserExtData["loginTime"] = Date.parse((new Date()).toString());
        //登陆修改下宝箱累计时间
        if (this.getGoodsAccumuStartTime()) {
            if (this._data && this._data.sendTime && (Number(this._data.sendTime) * 1000 > this.getGoodsAccumuStartTime())) {
                LogsManager_1.default.echo("登陆修改宝箱累计时间，原累计时间：" + this.getGoodsAccumuStartTime());
                LogsManager_1.default.echo("最后一次同步数据时间：" + this._data.sendTime);
                var newGoodsAccumuStartTime = Client_1.default.instance.serverTimeMicro - (Number(this._data.sendTime) * 1000 - this.getGoodsAccumuStartTime());
                LogsManager_1.default.echo("新宝箱累计时间：" + newGoodsAccumuStartTime);
                upUserExtData["goodsAccumuStartTime"] = newGoodsAccumuStartTime;
            }
        }
        // 如果没有设置过黑名单，并且
        if (!this._data.sceneBlack && !SceneReference_1.default.checkWhiteSceneId(Global_1.default.currentSceneId, WhiteListFunc_1.default.TYPE_LOGIN)) {
            upData["sceneBlack"] = 1;
        }
        upData["userExt"] = upUserExtData;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        SingleCommonServer_1.default.startSaveClientData();
    }
    getLogoutTime() {
        return this._data.userExt.logoutTime;
    }
    checkIsNewDay() {
        if (!this._data.userExt.loginTime) {
            // 小红点
            // this._data.userExt.everydayInvite = 0;
            // this._data.userExt.everydayLotto = 0;
            return true;
        }
        var now_time = Date.parse((new Date()).toString());
        var newDayTime = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 4 * 60 * 60 * 1000)).toString());
        if (now_time > newDayTime && this._data.userExt.loginTime < newDayTime) {
            // this._data.userExt.everydayInvite = 0;
            // this._data.userExt.everydayLotto = 0;
            return true;
        }
        return false;
    }
    //获取关卡要求的最低车等级
    getLevelMinRoleLevel(levelId) {
        var levelInfo = LevelFunc_1.default.instance.getCfgDatas("Level", levelId);
        return levelInfo.minCar || 1;
    }
    /** 返回banner序列 */
    getBannerOrder() {
        return this._data.leadBanner || 0;
    }
    isSceneBlack() {
        return this._data.sceneBlack ? this._data.sceneBlack : 0;
    }
    getRecycleTime() {
        return this._data.getRecycleTime ? Number(this._data.getRecycleTime) : 0;
    }
    getLand() {
        var roleInfo = RolesFunc_1.default.instance.getAllRole();
        var landNum = 0;
        for (var id in roleInfo) {
            var maxLevel = UserModel.instance.getMaxLevel(id);
            for (var level in roleInfo[id]) {
                if (Number(level) <= Number(maxLevel)) {
                    if (roleInfo[id][level].land) {
                        landNum++;
                    }
                }
            }
        }
        return landNum;
    }
    getLastSendTime() {
        return this._data.lastSendTime * 1000;
    }
    //获取邀请奖励领取状态
    getInviteRewardStatus(id) {
        if (!this._data.inviteReward || !this._data.inviteReward[id]) {
            return false;
        }
        return this._data.inviteReward[id];
    }
    //获取首个邀请奖励没有领取的index
    getFirstNoGetInviteReward() {
        var data = InviteFunc_1.default.instance.getAll();
        var gainStatus;
        for (var i in data) {
            gainStatus = UserModel.instance.getInviteRewardStatus(i);
            if (!gainStatus) {
                return Number(i);
            }
        }
        return 0;
    }
    //判断是否有没有领取的奖励
    checkNoGetInviteReward() {
        var shareNum = Object.keys(UserGlobalModel_1.default.instance.getInviteInfo()).length;
        var data = InviteFunc_1.default.instance.getAll();
        var gainStatus;
        var info;
        for (var i in data) {
            info = InviteFunc_1.default.instance.getInviteInfo(i);
            if (Number(info.count) <= Number(shareNum)) {
                gainStatus = UserModel.instance.getInviteRewardStatus(i);
                if (!gainStatus) {
                    return true;
                }
            }
        }
        return false;
    }
    //获取局外商店列表
    getFogShopGoodsList() {
        var goodLsit = [];
        var data = this.getData();
        if (!data || !data.fogOuterShop || !Object.keys(data.fogOuterShop.goods).length) {
            return goodLsit;
        }
        //判断是否过期
        var expireTime = data.fogOuterShop.expireTime ? data.fogOuterShop.expireTime : GameUtils_1.default.getNextRefreshTByTime(4);
        if (expireTime < Client_1.default.instance.serverTime) {
            return goodLsit;
        }
        var goods = data.fogOuterShop.goods;
        for (var i = 0; i < Object.keys(goods).length; i++) {
            goodLsit.push(goods[i + 1].id);
        }
        return goodLsit;
    }
    //获取局外商店的过期时间
    getFogShopExpireTime() {
        var data = this.getData();
        if (!data || !data.fogOuterShop || !Object.keys(data.fogOuterShop.goods).length) {
            return GameUtils_1.default.getNextRefreshTByTime(4);
        }
        var expireTime = data.fogOuterShop.expireTime ? data.fogOuterShop.expireTime : GameUtils_1.default.getNextRefreshTByTime(4);
        return expireTime;
    }
    //获取迷雾商店种商品得状态
    getFogShopStatus(index) {
        var data = this.getData();
        if (!data || !data.fogOuterShop || !data.fogOuterShop.goods || !data.fogOuterShop.goods[index] || !data.fogOuterShop.goods[index].status) {
            return 0;
        }
        var expireTime = data.fogOuterShop.expireTime ? data.fogOuterShop.expireTime : GameUtils_1.default.getNextRefreshTByTime(4);
        if (expireTime < Client_1.default.instance.serverTime) {
            LogsManager_1.default.echo("whn outshop 已经过期");
            return false;
        }
        return data.fogOuterShop.goods[index].status;
    }
    //获取局外商店
    getFogShopGoods() {
        var goodLsit = [];
        var data = this.getData();
        if (!data || !data.fogOuterShop || !data.fogOuterShop.goods) {
            return {};
        }
        return data.fogOuterShop.goods;
    }
    /**获取迷雾币数 */
    getFogCoinNum() {
        var data = this.getData();
        return Number(data && data.fogCoin) || 0;
    }
}
exports.default = UserModel;
//# sourceMappingURL=UserModel.js.map