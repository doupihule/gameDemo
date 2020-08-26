"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const RolesFunc_1 = require("../../func/RolesFunc");
class BattleHelpRoleUI extends layaMaxUI_1.ui.gameui.battle.BattleHelpRoleUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.useBtn, this.onClickUse, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.exitBtn, this.onClickCLose, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        this.callBack = data.callBack;
        this.thisObj = data.thisObj;
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_TRYROLE);
        this.freeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
        var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_TRYROLE);
        this.exitBtn.visible = true;
        if (delayTime) {
            this.exitBtn.visible = false;
            TimerManager_1.default.instance.setTimeout(() => {
                this.exitBtn.visible = true;
            }, this, delayTime);
        }
        this.showRoleAni(data.helpRoleId);
        this.helpRoleId = data.helpRoleId;
        var roleData = RolesFunc_1.default.instance.getCfgDatas("Role", data.helpRoleId);
        var name = TranslateFunc_1.default.instance.getTranslate(roleData.name);
        var times = roleData.tryParams.split(",")[1];
        this.desTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_tryRoleDesc", null, name, Number(times) / 1000, name);
    }
    //显示角色
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        var scaleRoleInfo = GlobalParamsFunc_1.default.instance.getDataNum("tryRoleSize") / 10000 * BattleFunc_1.default.defaultScale;
        if (!cacheItem) {
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, 1, 2, scaleRoleInfo, false, false, "BattleHelpRoleUI");
        }
        else {
            cacheItem.setItemViewScale(scaleRoleInfo);
            this.roleAnim = cacheItem;
        }
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
        this._lastRoleId = roleId;
    }
    onClickUse() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLETRY_CLICK, { levelId: this.thisObj.levelId, roleId: this.helpRoleId });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_TRYROLE, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.use, this.closeCall, this);
    }
    use() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLETRY_FINISH, { levelId: this.thisObj.levelId, roleId: this.helpRoleId });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_ROLETRY_FINISH, { levelId: this.thisObj.levelId, roleId: this.helpRoleId });
        }
        this.callBack && this.callBack.call(this.thisObj);
        this.onClickCLose();
    }
    closeCall() {
    }
    onClickCLose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleHelpRoleUI);
    }
}
exports.default = BattleHelpRoleUI;
//# sourceMappingURL=BattleHelpRoleUI.js.map