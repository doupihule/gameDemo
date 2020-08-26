"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const SevenDayFunc_1 = require("../../func/SevenDayFunc");
const SevenDayModel_1 = require("../../model/SevenDayModel");
const SevenDayServer_1 = require("../../server/SevenDayServer");
const Message_1 = require("../../../../framework/common/Message");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const RolesModel_1 = require("../../model/RolesModel");
const RedPointConst_1 = require("../../consts/RedPointConst");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
const FogFunc_1 = require("../../func/FogFunc");
const FogServer_1 = require("../../server/FogServer");
class SevenDaysUI extends layaMaxUI_1.ui.gameui.main.SevenDaysUI {
    constructor() {
        super();
        this.initBtn();
        this._sevenData = SevenDayFunc_1.default.instance.getSevenDatas();
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + roleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = 1.4 * BattleFunc_1.default.defaultScale;
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "SevenDaysUI");
        }
        else {
            this.roleAnim = cacheItem;
        }
        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_SevenDays, this);
        this.curWeek = 0;
        this.loginStep = 1;
        this.showRoleAni("1011");
        var loginDay = SevenDayModel_1.default.instance.getLoginDay();
        //判断当前是第几周
        var loginStep = loginDay.loginStep || 1;
        var gainStep = loginDay.gainStep || 0;
        //判断当前是第几周
        this.curWeek = Math.ceil(loginStep / 7);
        this.loginStep = loginStep - (this.curWeek - 1) * 7;
        gainStep -= (this.curWeek - 1) * 7;
        if (this._sevenData) {
            for (var i = 0; i < Object.keys(this._sevenData).length; i++) {
                var curReward;
                switch (this.curWeek) {
                    case 1:
                        curReward = this._sevenData[i + 1].reward1;
                        break;
                    case 2:
                        curReward = this._sevenData[i + 1].reward2;
                        break;
                    default:
                        curReward = this._sevenData[i + 1].continuousReward;
                        break;
                }
                curReward = curReward[0].split(",");
                var info = FogFunc_1.default.instance.getResourceShowInfo(curReward);
                this["rewardImg" + i].skin = info.icon;
                this["rewardTxt" + i].text = StringUtils_1.default.getCoinStr(info.num);
                //  this["receiveBtn" + i].visible = false;
                this["hasReceiveGroup" + i].visible = false;
                this["receiveBtn" + i].touchEnabled = false;
                this["receiveBtn" + i].touchChildren = false;
                new ButtonUtils_1.ButtonUtils(this["receiveBtn" + i], this.onClickReceive, this, null, null, [curReward, i]);
                //已经领取过得
                if (this.loginStep > i + 1) {
                    this["hasReceiveGroup" + i].visible = true;
                    this["receiveBtn" + i].gray = true;
                    this["receiveBtnLab" + i].text = "已领取";
                }
                else if (this.loginStep == i + 1) {
                    //今天领过
                    if (this.loginStep == gainStep) {
                        this["hasReceiveGroup" + i].visible = true;
                        this["receiveBtn" + i].gray = true;
                        this["receiveBtnLab" + i].text = "已领取";
                    }
                    else {
                        //今天没领
                        this["receiveBtn" + i].visible = true;
                        this["receiveBtn" + i].gray = false;
                        this["receiveBtnLab" + i].text = "领取";
                        this["receiveBtn" + i].touchEnabled = true;
                        this["receiveBtn" + i].touchChildren = true;
                    }
                }
                else {
                    this["receiveBtn" + i].visible = false;
                }
            }
        }
    }
    onClickReceive(data) {
        var reward = data[0];
        var index = data[1];
        if (this["receiveBtn" + index].gray) {
            return;
        }
        this._curReward = reward;
        SevenDayServer_1.default.getSevendayReward({ "reward": reward }, () => {
            this.refreshUI(index);
            //弹出再领一次的界面
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_SEVENDAY, ShareOrTvManager_1.default.TYPE_SHARE);
            if (freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                var params = {
                    succCall: this.onSuccessCall.bind(this, index),
                    reward: reward,
                    params: { "curWeek": this.curWeek, "loginStep": this.loginStep },
                    shareName: ShareTvOrderFunc_1.default.SHARELINE_SEVENDAY
                };
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ComRewardDoubleUI, params);
            }
        }, this);
    }
    //领取奖励后刷新界面
    onSuccessCall(index) {
        FogServer_1.default.getReward({ reward: [this._curReward] }, () => {
            this.refreshUI(index);
        }, this);
    }
    refreshUI(index) {
        //刷新当前界面
        this.receiveCallBack(index);
        //刷新主界面七登红点
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_SEVENDAY);
    }
    receiveCallBack(index) {
        this["hasReceiveGroup" + index].visible = true;
        this["receiveBtn" + index].gray = true;
        this["receiveBtnLab" + index].text = "已领取";
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.SevenDaysUI);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMIAN_EVENT_CHECKPOP);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = SevenDaysUI;
//# sourceMappingURL=SevenDaysUI.js.map