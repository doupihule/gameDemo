"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const FogModel_1 = require("../../../model/FogModel");
const FogServer_1 = require("../../../server/FogServer");
const PoolTools_1 = require("../../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../../consts/PoolCode");
const BattleFunc_1 = require("../../../func/BattleFunc");
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
const RolesFunc_1 = require("../../../func/RolesFunc");
const RolesModel_1 = require("../../../model/RolesModel");
class FogUserRoleUI extends layaMaxUI_1.ui.gameui.fog.FogUserRoleUI {
    constructor() {
        super();
        this.isFinish = false; //事件是否完成
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.takeBtn, this.onClickTake, this);
    }
    setData(data) {
        this.roleId = null;
        this._lastRoleId = null;
        this.isFinish = false;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.events = data.event;
        this.cell = data.cell;
        this.roleId = this.events.roleId;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        //标题
        var roleInfo = RolesFunc_1.default.instance.getRoleInfoById(this.roleId);
        var roleName = TranslateFunc_1.default.instance.getTranslate(roleInfo.name, "TranslateRole");
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent", [roleName]);
        //描述
        this.desc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent", [roleName]);
        //角色spine
        this.showRoleAni(this.roleId);
        this.costAct = this.events.mobilityCost || 0;
        if (this.costAct) {
            this.costNum.text = "-" + this.costAct;
        }
        else {
            this.costGroup.visible = false;
        }
        BannerAdManager_1.default.addBannerQuick(this);
    }
    showRoleAni(roleId) {
        if (!this.roleId) {
            return;
        }
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = RolesFunc_1.default.instance.getRoleDataById(roleId, "scaleRoleInfo") / 10000 * BattleFunc_1.default.defaultScale;
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "FogUserRoleUI");
        }
        else {
            this.roleAnim = cacheItem;
        }
        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.x = 0.5 * this.roleSpine.width;
        this.roleAnim.y = this.roleSpine.height;
        this.roleAnim.play("idle", true);
        this._lastRoleId = roleId;
    }
    onClickTake() {
        //判断行动力是否足够
        var userActNum = FogModel_1.default.instance.getActNum();
        if (userActNum < Number(this.costAct)) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        //消耗行动力带走角色
        FogServer_1.default.takenRole({ "cost": this.costAct, "roleId": this.roleId }, this.finishCallBack, this);
    }
    finishCallBack() {
        this.isFinish = true;
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogUserRoleUI);
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogUserRoleUI;
//# sourceMappingURL=FogUserRoleUI.js.map