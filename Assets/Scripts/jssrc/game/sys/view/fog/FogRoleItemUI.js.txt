"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const BattleFunc_1 = require("../../func/BattleFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ResourceConst_1 = require("../../consts/ResourceConst");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const RolesModel_1 = require("../../model/RolesModel");
const RolesFunc_1 = require("../../func/RolesFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
class FogRoleItemUI extends layaMaxUI_1.ui.gameui.fog.FogRoleItemUI {
    constructor(cfg, owner, isShowVideo, isShowItem) {
        super();
        this.itemWidth = 212;
        this.itemHeight = 280;
        this.attackFrame = 10;
        this.insSpeak = false;
        this.timeCode = 0;
        this.owner = owner;
        this.cfg = cfg;
        this.id = this.cfg.id;
        this.isShowVideo = isShowVideo;
        this.isShowItem = isShowItem;
        this.insSpeak = false;
        this.setData();
        new ButtonUtils_1.ButtonUtils(this.item, this.onClickItem, this);
    }
    setData() {
        if (!this.isShowItem) {
            this.visible = false;
            return;
        }
        if (this.isShowVideo) {
            this.videoGroup.visible = true;
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_START_ADDROLE);
            this.unlockImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_STARTROLE_SHOW);
            }
            this.starGroup.visible = false;
            this.qualImg.skin = "uisource/card/card/role_image_buzhenhui.png";
        }
        else {
            this.freshRoleInfo();
        }
    }
    /**刷新新英雄的信息 */
    freshRoleInfo() {
        this.videoGroup.visible = false;
        this.starGroup.visible = true;
        this.qualImg.skin = ResourceConst_1.default.LINE_ICON_DI[this.cfg.qualityType];
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this.lastId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + this.id);
        var scale = (GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInArrayUI") / 10000 || 1) * BattleFunc_1.default.defaultScale;
        if (!cacheItem) {
            cacheItem = BattleFunc_1.default.instance.createRoleSpine(this.id, RolesModel_1.default.instance.getRoleLevelById(this.id), 2, scale, true, false, "FogRoleItemUI");
        }
        else {
            cacheItem.setItemViewScale(scale);
        }
        cacheItem.scaleX = 1;
        this.roleAnim = cacheItem;
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
        this.lastId = this.id;
        var act = BattleFunc_1.default.instance.getCfgDatasByKey("RoleAct", BattleFunc_1.default.instance.getCfgDatasByKey("Role", this.id, "spine"), "act");
        for (var i = 0; i < act.length; i++) {
            var item = act[i];
            if (item[0] == "attack") {
                this.attackFrame = Number(item[1]);
            }
        }
        RolesFunc_1.default.instance.addStarImg(this.starGroup, this.id, 28, 28);
    }
    onClickItem() {
        if (!this.visible || !this.videoGroup.visible) {
            return;
        }
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_STARTROLE_CLICK);
        }
        //视频解锁
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_START_ADDROLE, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successfull, this.closefull, this);
    }
    successfull() {
        this.freshRoleInfo();
        this.owner.isVideoGet = true;
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_STARTROLE_FINISH);
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_STARTROLE_FINISH);
        }
    }
    closefull() {
    }
    freshSpeak(index, leftSpeak, rightSpeak, leftTxt, rightTxt) {
        if (this.roleAnim) {
            this.insSpeak = true;
            this.roleAnim.play("attack", false);
            this.timeCode = TimerManager_1.default.instance.setTimeout(() => {
                if (this.roleAnim) {
                    this.roleAnim.play("idle", true);
                }
            }, this, Math.ceil(this.attackFrame * BattleFunc_1.default.battleViewFrameScale / 60 * 1000));
            if (index == 2) {
                leftSpeak.visible = true;
                leftTxt.text = TranslateFunc_1.default.instance.getTranslate(GameUtils_1.default.getRandomInArr(this.cfg.arraySpeak).result);
                leftSpeak.y = this.y - 10;
                leftSpeak.x = this.x + this.item.width - 10;
            }
            else {
                rightSpeak.visible = true;
                rightTxt.text = TranslateFunc_1.default.instance.getTranslate(GameUtils_1.default.getRandomInArr(this.cfg.arraySpeak).result);
                rightSpeak.y = this.y - 10;
                rightSpeak.x = this.x + this.item.width - 10;
            }
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogRoleItemUI;
//# sourceMappingURL=FogRoleItemUI.js.map