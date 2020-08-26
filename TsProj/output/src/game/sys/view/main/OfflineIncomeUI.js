"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const SubPackageManager_1 = require("../../../../framework/manager/SubPackageManager");
const SubPackageConst_1 = require("../../consts/SubPackageConst");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const Message_1 = require("../../../../framework/common/Message");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const GameUtils_1 = require("../../../../utils/GameUtils");
const ResourceConst_1 = require("../../consts/ResourceConst");
const UserExtModel_1 = require("../../model/UserExtModel");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const RolesModel_1 = require("../../model/RolesModel");
const BattleFunc_1 = require("../../func/BattleFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
class OfflineIncomeUI extends layaMaxUI_1.ui.gameui.main.OfflineIncomeUI {
    constructor() {
        super();
        this.addEvent();
        TimerManager_1.default.instance.setTimeout(() => {
            SubPackageManager_1.default.loadSubPackage(SubPackageConst_1.default.packName_share);
        }, this, 2000);
        new ButtonUtils_1.ButtonUtils(this.btn_multiReward, this.onReceiveBtnClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.btn_normalReward, this.clickNormalReward, this);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        var offlineWeightArr = GlobalParamsFunc_1.default.instance.getDataArray("offLineDoubleNub");
        this.multi = Number(GameUtils_1.default.getWeightItem(offlineWeightArr)[0]);
        this.lbl_multi.text = "×" + this.multi;
        var reward = UserExtModel_1.default.instance.calcuOfflineReward();
        this.rewardType = reward[0];
        this.offlineReward = reward[1];
        this.lbl_normalReward.text = StringUtils_1.default.getCoinStr(this.offlineReward);
        this.lbl_multiReward.text = StringUtils_1.default.getCoinStr(BigNumUtils_1.default.floatMuitlfy(this.offlineReward, this.multi));
        //按钮状态
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_OFFLINE);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.multiRewardGroup.visible = false;
        }
        else {
            this.multiRewardGroup.visible = true;
            this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                this.freeImg.skin = ResourceConst_1.default.ADV_PNG;
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_OFFLINECOIN_SHOW, { "times": this.multi });
            }
        }
        if (!GameUtils_1.default.isReview) {
            this.showRoleAni("1016");
        }
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + roleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = 1.7 * BattleFunc_1.default.defaultScale;
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "OfflineComeUI");
        }
        else {
            this.roleAnim = cacheItem;
        }
        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    //退出并领取1倍离线收益
    clickNormalReward() {
        DataResourceServer_1.default.getReward({ "reward": [this.rewardType, this.offlineReward], "offlineTime": -1 }, () => {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_get_lab"));
            this.close();
        }, this);
    }
    //领取多倍离线收益
    onReceiveBtnClick() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_OFFLINECOIN_CLICK, { "times": this.multi });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_OFFLINE, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    successCall() {
        DataResourceServer_1.default.getReward({ "reward": [this.rewardType, BigNumUtils_1.default.floatMuitlfy(this.offlineReward, this.multi)], "offlineTime": -1 }, () => {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_get_lab"));
            this.close();
        }, this);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_OFFLINECOIN_FINISH, { "times": this.multi });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_OFFLINECOIN_FINISH, { "times": this.multi });
        }
    }
    closeCall() {
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.OfflineIncomeUI);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMIAN_EVENT_CHECKPOP);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = OfflineIncomeUI;
//# sourceMappingURL=OfflineIncomeUI.js.map