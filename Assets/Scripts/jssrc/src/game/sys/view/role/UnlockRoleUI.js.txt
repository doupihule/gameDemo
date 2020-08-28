"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const RolesModel_1 = require("../../model/RolesModel");
const RolesFunc_1 = require("../../func/RolesFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
class UnlockRoleUI extends layaMaxUI_1.ui.gameui.role.UnlockRoleUI {
    constructor() {
        super();
        this.addEvent();
        this.initBtn();
    }
    //添加事件监听
    addEvent() {
        // Message.instance.add(GameMainEvent.ROLELIST_EVENT_REFRESH, this);
        // Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_STAGE, this);
        // Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY, this);
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.onClickClose, this);
        new ButtonUtils_1.ButtonUtils(this.btn_reward, this.onClickVideoReward, this);
        new ButtonUtils_1.ButtonUtils(this.btm_freeGet, this.onClickClose, this);
        new ButtonUtils_1.ButtonUtils(this.btn_return, this.onClickReturn, this);
    }
    //初始化
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        this.roleId = data.roleId;
        this.callBack = data.callBack;
        this.thisObj = data.thisObj;
        this.initView();
        this.refreshBtn();
    }
    initView() {
        var roleInfo = RolesFunc_1.default.instance.getRoleInfoById(this.roleId);
        //炫耀的奖励
        var rewardInfo = RolesFunc_1.default.instance.getRoleDataById(this.roleId, "shareGiveDiamond");
        this.rewardArr = rewardInfo[0].split(",");
        //角色spine
        this.showRoleAni(this.roleId);
        //角色名字，等级
        var roleName = TranslateFunc_1.default.instance.getTranslate(roleInfo.name, "TranslateRole");
        this.roleName.text = roleName;
    }
    //按钮初始化
    refreshBtn() {
        var unlockRoleRewardSwitch = GlobalParamsFunc_1.default.instance.getDataNum("unlockRoleRewardSwitch");
        if (!unlockRoleRewardSwitch) {
            this.btn_return.visible = false;
            this.btn_reward.visible = false;
            this.btn_close.visible = false;
            this.freeImg.visible = false;
            this.btm_freeGet.visible = true;
            //奖励展示
            var result = DataResourceFunc_1.default.instance.getDataResourceInfo(this.rewardArr);
            this.freeGetImg.skin = result["img"];
            this.freeGetCount.text = result["num"];
        }
        else {
            this.freeImg.visible = true;
            this.btm_freeGet.visible = false;
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_UNLOCKROLE_REWARD);
            //没有视频或者分享
            if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.btn_return.visible = false;
                this.btn_reward.visible = true;
                this.btn_close.visible = false;
                //奖励展示
                var result = DataResourceFunc_1.default.instance.getDataResourceInfo(this.rewardArr);
                this.rewardImg.skin = result["img"];
                this.rewardNum.text = result["num"];
                var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(ShareTvOrderFunc_1.default.SHARELINE_UNLOCKROLE_REWARD);
                this.btn_return.visible = true;
                if (delayTime) {
                    this.btn_return.visible = false;
                    TimerManager_1.default.instance.setTimeout(() => {
                        this.btn_return.visible = true;
                    }, this, delayTime);
                }
                this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_UNLOCKROLE_REWARD);
                this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
                if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_UNLOCKROLEREWARD_SHOW, { "roleId": this.roleId });
                }
            }
            else {
                this.btn_return.visible = false;
                this.btn_reward.visible = false;
                this.btn_close.visible = true;
            }
        }
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = 1.8 * BattleFunc_1.default.defaultScale;
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "UnlockRoleUI");
        }
        else {
            this.roleAnim = cacheItem;
        }
        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    //直接领取奖励
    onClickClose() {
        DataResourceServer_1.default.getReward({ "reward": this.rewardArr }, this.close, this);
    }
    onClickVideoReward() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_UNLOCKROLEREWARD_CLICK, { "roleId": this.roleId });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_UNLOCKROLE_REWARD, ShareOrTvManager_1.default.TYPE_SHARE, {
            id: "1",
            extraData: {}
        }, this.successfull, this.closefull, this);
    }
    successfull() {
        this.onClickClose();
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_UNLOCKROLEREWARD_FINISH, { "roleId": this.roleId });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_UNLOCKROLEREWARD_FINISH, { "roleId": this.roleId });
        }
    }
    closefull() {
    }
    //放弃奖励
    onClickReturn() {
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.UnlockRoleUI);
        this.callBack && this.callBack.call(this.thisObj);
    }
    clear() {
    }
    dispose() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = UnlockRoleUI;
//# sourceMappingURL=UnlockRoleUI.js.map