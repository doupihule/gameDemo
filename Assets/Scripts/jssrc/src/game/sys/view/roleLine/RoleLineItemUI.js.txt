"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const BattleFunc_1 = require("../../func/BattleFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const UserModel_1 = require("../../model/UserModel");
const ResourceConst_1 = require("../../consts/ResourceConst");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const RolesModel_1 = require("../../model/RolesModel");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const RolesFunc_1 = require("../../func/RolesFunc");
const ChapterFunc_1 = require("../../func/ChapterFunc");
class RoleLineItemUI extends layaMaxUI_1.ui.gameui.roleLine.RoleLineItemUI {
    constructor(cfg, owner, unlockLevel) {
        super();
        this.itemWidth = 212;
        this.itemHeight = 280;
        this.isInLine = false;
        this.isLock = false;
        this.attackFrame = 10;
        this.insSpeak = false;
        this.timeCode = 0;
        if (cfg) {
            this.cfg = cfg;
            this.id = this.cfg.id;
            this.isInLine = true;
        }
        else {
            this.isInLine = false;
        }
        this.owner = owner;
        this.unlockLevel = unlockLevel;
        this.insSpeak = false;
        this.setData();
        new ButtonUtils_1.ButtonUtils(this.item, this.onClickItem, this);
    }
    setData() {
        if (this.unlockLevel <= UserModel_1.default.instance.getMaxBattleLevel()) {
            this.isLock = false;
        }
        else {
            this.isLock = true;
        }
        this.qualImg.skin = "uisource/card/card/role_image_buzhenhui.png";
        if (this.isLock) {
            this.unlockGroup.visible = true;
            this.unlockTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_flat_unlockTip1", null, ChapterFunc_1.default.instance.getOpenConditionByLevel(this.unlockLevel));
        }
        else {
            this.unlockGroup.visible = false;
        }
        if (this.isInLine) {
            this.freshRoleInfo();
        }
    }
    /**刷新新英雄的信息 */
    freshRoleInfo() {
        this.qualImg.skin = ResourceConst_1.default.LINE_ICON_DI[this.cfg.qualityType];
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this.lastId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + this.id);
        var scale = (GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInArrayUI") / 10000 || 1) * BattleFunc_1.default.defaultScale;
        if (!cacheItem) {
            cacheItem = BattleFunc_1.default.instance.createRoleSpine(this.id, RolesModel_1.default.instance.getRoleLevelById(this.id), 2, scale, true, false, "RoleLineItemUI");
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
    //从阵上移除
    removeLine() {
        if (this.isInLine) {
            this.qualImg.skin = "uisource/card/card/role_image_buzhenhui.png";
            this.cfg = null;
            if (this.roleAnim) {
                this.aniGroup.removeChild(this.roleAnim);
                PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this.lastId, this.roleAnim);
                this.roleAnim = null;
                TimerManager_1.default.instance.clearTimeout(this.timeCode);
            }
        }
    }
    onClickItem() {
        if (this.isInLine && !this.isLock) {
            this.owner.freshRoleInLine(this.id);
            if (this.insSpeak) {
                this.owner.hideSpeakInfo();
                this.insSpeak = false;
            }
        }
    }
    freshLineState(cfg) {
        if (this.isLock)
            return;
        if (this.isInLine) {
            //如果之前在阵上现在不在阵上
            if (!cfg) {
                this.removeLine();
                this.isInLine = false;
            }
            else {
                //之前在阵上现在也在阵上但id变了
                if (this.id != cfg.id) {
                    this.id = cfg.id;
                    this.cfg = cfg;
                    this.freshRoleInfo();
                }
            }
        }
        else {
            //之前不在阵上现在在阵上
            if (cfg) {
                this.cfg = cfg;
                this.id = this.cfg.id;
                this.isInLine = true;
                this.freshRoleInfo();
            }
        }
    }
    freshSpeak(index, leftSpeak, rightSpeak, leftTxt, rightTxt) {
        if (this.isInLine && this.roleAnim) {
            this.insSpeak = true;
            this.roleAnim.play("attack", false);
            this.timeCode = TimerManager_1.default.instance.setTimeout(() => {
                if (this.roleAnim) {
                    this.roleAnim.play("idle", true);
                }
            }, this, Math.ceil(this.attackFrame * BattleFunc_1.default.battleViewFrameScale / 60 * 1000));
            if (index == 2 || index == 5) {
                leftSpeak.visible = true;
                leftTxt.text = TranslateFunc_1.default.instance.getTranslate(GameUtils_1.default.getRandomInArr(this.cfg.arraySpeak).result);
                leftSpeak.y = this.y;
                leftSpeak.x = this.x;
            }
            else {
                rightSpeak.visible = true;
                rightTxt.text = TranslateFunc_1.default.instance.getTranslate(GameUtils_1.default.getRandomInArr(this.cfg.arraySpeak).result);
                rightSpeak.y = this.y;
                rightSpeak.x = this.x;
            }
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = RoleLineItemUI;
//# sourceMappingURL=RoleLineItemUI.js.map