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
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const BattleConst_1 = require("../../consts/BattleConst");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
class EvoRewardUI extends layaMaxUI_1.ui.gameui.role.EvoRewardUI {
    constructor() {
        super();
        this.initBtn();
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.onClickClose, this);
        new ButtonUtils_1.ButtonUtils(this.btn_reward, this.onClickVideoReward, this);
        new ButtonUtils_1.ButtonUtils(this.btn_return, this.onClickReturn, this);
    }
    //初始化
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        this.roleId = data.roleId;
        this.initView();
        this.initAttr();
        this.refreshBtn();
    }
    //初始化属性
    initAttr() {
        var nowStar = RolesModel_1.default.instance.getRoleStarLevel(this.roleId);
        this.firstAttack.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_attack, this.roleId, null, nowStar, false, nowStar - 1);
        this.lastAttack.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_attack, this.roleId, null, nowStar, false, nowStar);
        this.firstLife.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_maxHp, this.roleId, null, nowStar, false, nowStar - 1);
        this.lastLife.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_maxHp, this.roleId, null, nowStar, false, nowStar);
    }
    initView() {
        var starLevel = RolesModel_1.default.instance.getRoleStarLevel(this.roleId);
        //炫耀的奖励
        var info = RolesFunc_1.default.instance.getCfgDatasByKey("RoleStar", this.roleId, starLevel);
        this.rewardArr = info.reward[0].split(",");
        var skill = BattleFunc_1.default.instance.getCfgDatasByKey("PassiveSkill", info.passiveSkill, "desc");
        this.skillTxt.text = TranslateFunc_1.default.instance.getTranslate(skill);
        //角色spine
        this.showRoleAni(this.roleId);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLEEVO_SHOW, { roleId: this.roleId });
    }
    //按钮初始化
    refreshBtn() {
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_EVOLUTION_REWARD);
        //没有视频或者分享
        if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.btn_return.visible = false;
            this.btn_reward.visible = true;
            this.btn_close.visible = false;
            //奖励展示
            var result = DataResourceFunc_1.default.instance.getDataResourceInfo(this.rewardArr);
            this.rewardImg.skin = result["img"];
            this.rewardNum.text = result["num"];
            var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(ShareTvOrderFunc_1.default.SHARELINE_EVOLUTION_REWARD);
            this.btn_return.visible = true;
            if (delayTime) {
                this.btn_return.visible = false;
                TimerManager_1.default.instance.setTimeout(() => {
                    this.btn_return.visible = true;
                }, this, delayTime);
            }
            this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        }
        else {
            this.btn_return.visible = false;
            this.btn_reward.visible = false;
            this.btn_close.visible = true;
        }
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        var scaleRoleInfo = 1.8 * BattleFunc_1.default.defaultScale;
        if (!cacheItem) {
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "EvoRewardUI");
        }
        else {
            cacheItem.setItemViewScale(scaleRoleInfo);
            this.roleAnim = cacheItem;
        }
        this._lastRoleId = this.roleId;
        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    onClickClose() {
        this.close();
    }
    onClickVideoReward() {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLEEVO_CLICK, { roleId: this.roleId });
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_UNLOCKROLE_REWARD, ShareOrTvManager_1.default.TYPE_SHARE, {
            id: "1",
            extraData: {}
        }, this.successfull, this.closefull, this);
    }
    successfull() {
        DataResourceServer_1.default.getReward({ "reward": this.rewardArr }, this.close, this);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLEVOREWARD_FINISH, { "roleId": this.roleId });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_ROLEEVOREWARD_FINISH, { "roleId": this.roleId });
        }
    }
    closefull() {
    }
    //放弃奖励
    onClickReturn() {
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.EvoRewardUI);
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
exports.default = EvoRewardUI;
//# sourceMappingURL=EvoRewardUI.js.map