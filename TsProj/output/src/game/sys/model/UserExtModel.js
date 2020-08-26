"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Client_1 = require("../../../framework/common/kakura/Client");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const Message_1 = require("../../../framework/common/Message");
const UserEvent_1 = require("../event/UserEvent");
const MsgCMD_1 = require("../common/MsgCMD");
const UserExtServer_1 = require("../server/UserExtServer");
const GameUtils_1 = require("../../../utils/GameUtils");
const GameMainEvent_1 = require("../event/GameMainEvent");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../func/ShareTvOrderFunc");
const LevelFunc_1 = require("../func/LevelFunc");
const TalentSkillsModel_1 = require("./TalentSkillsModel");
const UserModel_1 = require("./UserModel");
class UserExtModel extends BaseModel_1.default {
    constructor() {
        super();
        this.curSp = 0;
        this.upSpTime = 0;
        Message_1.default.instance.add(MsgCMD_1.default.GAME_ONHIDE, this);
        Message_1.default.instance.add(MsgCMD_1.default.GAME_ONSHOW, this);
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new UserExtModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
        if (d.sp || d.sp == 0 || d.upSpTime || d.upSpTime == 0) {
            Message_1.default.instance.send(UserEvent_1.default.USER_SP_CHANGE);
        }
        if (d.maxStage || d.maxStage == 0) {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_STAGE);
        }
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    getIsClickInvite() {
        return this._data.shareButtonClick || 0;
    }
    /**判断是否领取了客服奖励 */
    checkIsGotKefuAward() {
        var isGot = false;
        if (this._data && this._data.customReward) {
            isGot = true;
        }
        return isGot;
    }
    /**获取当前解锁的最大关卡 */
    getMaxLevel() {
        return Number(this._data.maxStage) || 0;
    }
    /**获取领取宝箱次数 */
    getBoxGetCount(index) {
        return this._data.getBoxCount && this._data.getBoxCount[index];
    }
    getIsBox() {
        return this._data.getBoxCount;
    }
    updateLogoutTime() {
        //更新登出时间
        UserExtServer_1.default.updateLogoutTime();
    }
    /*获取本次随机神秘宝箱的概率id */
    getRateId() {
        if (this._data.bannerChanceId) {
            return this._data.bannerChanceId;
        }
        return 1;
    }
    /**获取本次游戏是否出现宝箱 */
    getIsShowGiftInGame() {
        if (!GameUtils_1.default.canGift)
            return false;
        var level = this.getMaxLevel();
        if (level < GlobalParamsFunc_1.default.instance.getDataNum("secretBagStartPVP"))
            return false;
        var rate = GlobalParamsFunc_1.default.instance.getDataByTwoId("secretBagTouchRound", "arr");
        var num = rate[0].split(",");
        var winTimes = this._data.playCount || 0;
        if (winTimes == 0)
            return false;
        if (winTimes <= Number(num[1])) {
            return true;
        }
        return false;
    }
    getPlayCount() {
        return this._data.playCount || 0;
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            case MsgCMD_1.default.GAME_ONHIDE:
                this.updateLogoutTime();
                break;
            case MsgCMD_1.default.GAME_ONSHOW:
                break;
        }
    }
    //获取转盘自动弹出次数
    getTurnableOccurCount() {
        return this._data.turnableOccurCount || 0;
    }
    //获取英雄免费进阶的次数
    getFreeAdvanceCount(roleId) {
        if (!this._data || !this._data.freeAdvanceCount || !this._data.freeAdvanceCount[roleId]) {
            return 0;
        }
        return this._data.freeAdvanceCount[roleId];
    }
    /**
     * 获取上次刷新体力值
     */
    getLastFreshPower() {
        if (!this._data.sp && this._data.sp != 0) {
            this._data.sp = GlobalParamsFunc_1.default.instance.getDataNum('bornSp');
        }
        return this._data.sp || 0;
    }
    /**
     * 获取上次刷新时间
     */
    getLastPowerFreshTime() {
        if (!this._data.upSpTime) {
            this._data.upSpTime = Client_1.default.instance.serverTime;
        }
        return this._data.upSpTime;
    }
    /**
    * 改变sp数值
    * int $num  体力改变数值
    * int $nstring $comeFrom
    * stringboolean $lose 减少体力的方式为失去或者消耗
    */
    changeSp(num, islose = false) {
        this.curSp = this.getLastFreshPower();
        this.upSpTime = this.getLastPowerFreshTime();
        // 更改前计算体力及上次刷新时间
        this.calcSp();
        if (this.curSp + num < 0 && !islose) {
            // throw new \Game\common\GameLogicAlertException('user_sp_not_enough');
            this.curSp = 0;
            return;
        }
        if (this.curSp + num < 0 && islose) {
            num = -this.curSp;
        }
        this.curSp += num;
        // 更改后计算体力及上次刷新时间
        this.calcSp();
    }
    /**
     * 计算sp恢复
     */
    calcSp() {
        // 1点体力恢复时间
        var recoveTime = GlobalParamsFunc_1.default.instance.getDataNum('spRestoreTime');
        // 计算体力的最大值
        var max = GlobalParamsFunc_1.default.instance.getDataNum('maxSp');
        // 如果体力上限未达上限
        if (this.curSp < max) {
            //增加的点数
            var times = Math.floor((Client_1.default.instance.serverTime - this.upSpTime) / recoveTime);
            if (times <= 0) {
                return;
            }
            if (this.curSp + times > max) {
                this.curSp = max;
                this.upSpTime = Client_1.default.instance.serverTime;
            }
            else {
                this.curSp += times;
                this.upSpTime += times * recoveTime;
            }
        }
        else {
            this.upSpTime = Client_1.default.instance.serverTime;
        }
    }
    /**
     * 获取当前体力
     */
    getNowSp() {
        return this.curSp;
    }
    getUpTime() {
        return this.upSpTime;
    }
    /**
     * 获取下一点体力恢复的时间
     */
    getNextPowerRestoreTime() {
        //下一点体力恢复的时间 = 体力恢复间隔 - ((当前服务器时间上次 - 上次服务器刷新体力的时间) % 体力恢复间隔)
        // return 60000 - Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) % 60000);
        return GlobalParamsFunc_1.default.instance.getDataNum('spRestoreTime') - Math.floor((Client_1.default.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) % GlobalParamsFunc_1.default.instance.getDataNum('spRestoreTime'));
    }
    getCurrentSp() {
        var maxSp = GlobalParamsFunc_1.default.instance.getDataNum('maxSp');
        // var nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / 60000);
        var nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client_1.default.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / GlobalParamsFunc_1.default.instance.getDataNum('spRestoreTime'));
        if (UserExtModel.instance.getLastFreshPower() > maxSp) {
            nowPower = UserExtModel.instance.getLastFreshPower();
        }
        else if (nowPower > maxSp) {
            nowPower = maxSp;
        }
        return nowPower;
        //return this.getLastFreshPower() + Math.floor((Client.instance.serverTime - this.getLastPowerFreshTime()) / GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
    }
    //获取天赋技能升级次数
    getTalentSkillUpgradeNum() {
        return this._data.talentSkillUpgradeNum || 0;
    }
    //获取天赋免费升级的次数
    getTalentFreeUpgradeCount() {
        return this._data.talentFreeUpgradeCount || 0;
    }
    //是否出现天赋免费升级 
    getIsFreeUpgradeTalentInGame() {
        //获取天赋升级次数
        var talentUpgradeNum = UserExtModel.instance.getTalentSkillUpgradeNum();
        if (talentUpgradeNum < GlobalParamsFunc_1.default.instance.getDataNum("talentVideoLevelUpOpenNub")) {
            return false;
        }
        var rate = GlobalParamsFunc_1.default.instance.getDataByTwoId("talentVideoLevelUpShowInterval", "arr")[0].split(",");
        var freeUpgradeCount = this.getTalentFreeUpgradeCount();
        if (freeUpgradeCount <= Number(rate[1])) {
            return true;
        }
        return false;
    }
    getOfflineTime() {
        return this._data.offlineTime || 0;
    }
    getLoginTime() {
        return this._data.loginTime;
    }
    getLastOfflineTime() {
        return this._data.lastOfflineTime || UserModel_1.default.instance.getLastSendTime();
    }
    //获取离线收益
    calcuOfflineReward() {
        var levelInfo = LevelFunc_1.default.instance.getLevelInfoById(UserExtModel.instance.getMaxLevel()).offLineGiveGold[0];
        var talentBuff = TalentSkillsModel_1.default.instance.getBuff();
        var offlineTime = UserExtModel.instance.getOfflineTime();
        offlineTime = Math.min(GlobalParamsFunc_1.default.instance.getDataNum('offLineMaxTime'), offlineTime);
        var goldTime = Math.ceil(offlineTime / GlobalParamsFunc_1.default.instance.getDataNum('offLineMinutesNub'));
        var reward = levelInfo.split(',');
        return [reward[0], Math.round(reward[1] * goldTime * (10000) / 10000)];
    }
    //获取每日邀请点击状态
    getEverydayInvite() {
        return this._data.everydayInvite || 0;
    }
    //获取首次进入漫画标识
    getEnterFogFlag() {
        return this._data.enterFogFlag || 0;
    }
    //获取玩家战斗力
    getRoleForce() {
        return Number(this._data.force) || 0;
    }
    //获取每日首次进入迷雾标识
    checkFirstEnterFog() {
        return this._data.dailyFirstEnterFog || 0;
    }
    //判断是否显示转盘按钮
    checkIsTurnableShow() {
        var isShow = false;
        var luckyPlateLevel = GlobalParamsFunc_1.default.instance.getDataNum("luckyPlateLevel");
        var curMaxLevel = UserExtModel.instance.getMaxLevel();
        if (Number(curMaxLevel) + 1 >= luckyPlateLevel) {
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_TURNABLE);
            if (freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                isShow = true;
            }
        }
        return isShow;
    }
}
exports.default = UserExtModel;
//# sourceMappingURL=UserExtModel.js.map