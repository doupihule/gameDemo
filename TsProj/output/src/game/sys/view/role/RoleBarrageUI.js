"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RolesModel_1 = require("../../model/RolesModel");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const RolesFunc_1 = require("../../func/RolesFunc");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const TableUtils_1 = require("../../../../framework/utils/TableUtils");
const GameUtils_1 = require("../../../../utils/GameUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const GameConsts_1 = require("../../consts/GameConsts");
/**角色弹幕 */
class RoleBarrageUI extends layaMaxUI_1.ui.gameui.role.RoleBarrageUI {
    constructor() {
        super();
        this.allBarrage = [];
        this.timeCode = 0;
        this.moveArr = [];
        this.initBtn();
        var barType = RolesFunc_1.default.instance.getAllCfgData("Comment");
        for (var key in barType) {
            if (barType.hasOwnProperty(key)) {
                this.allBarrage.push(key);
            }
        }
    }
    initBtn() {
        this.on(Laya.Event.MOUSE_DOWN, this, this.onClickBg);
    }
    //初始化
    setData(data) {
        this.roleId = data.roleId;
        this.callBack = data.callBack;
        this.thisObj = data.thisObj;
        this.timeCode = TimerManager_1.default.instance.add(this.doTxtMove, this, 10);
        this.initView();
        var delay = GlobalParamsFunc_1.default.instance.getDataNum("roleCommentTime");
        TimerManager_1.default.instance.setTimeout(this.onClickBg, this, delay);
    }
    initView() {
        this.showRoleAni(this.roleId);
        this.typeArr = [];
        this.barrageTxt = RolesFunc_1.default.instance.getCfgDatasByKey("RoleComment", this.roleId, "comments");
        if (this.barrageTxt.length > this.allBarrage.length) {
            LogsManager_1.default.errorTag("弹幕样式数小于当前弹幕文本数");
            return;
        }
        var tempArr = [];
        TableUtils_1.default.copyOneArr(this.allBarrage, tempArr);
        for (var i = 0; i < this.barrageTxt.length; i++) {
            var ritem = GameUtils_1.default.getRandomInArr(tempArr);
            this.typeArr.push(ritem.result);
            tempArr.splice(ritem.index, 1);
        }
        this.showBarrage();
    }
    showBarrage() {
        for (var i = 0; i < this.barrageTxt.length; i++) {
            var content = this.barrageTxt[i];
            var typeInfo = RolesFunc_1.default.instance.getCfgDatas("Comment", this.typeArr[i]);
            var txt = new Laya.Label(TranslateFunc_1.default.instance.getTranslate(content, "TranslateComment"));
            var pos = typeInfo.position;
            var x = pos[0];
            var delay = typeInfo.delayTime;
            if (i == 0) {
                x = ScreenAdapterTools_1.default.width / 2;
                delay = 0;
            }
            txt.x = x;
            txt.y = pos[1];
            txt.fontSize = typeInfo.size;
            txt.color = typeInfo.color;
            txt.alpha = 0;
            this.barrageCtn.addChild(txt);
            TimerManager_1.default.instance.setTimeout(this.delayMove, this, delay, { speed: typeInfo.speed, txt: txt, index: i });
        }
    }
    delayMove(data) {
        this.moveArr.push(data);
        if (data.index == 0) {
            this.doTxtMove();
        }
    }
    doTxtMove() {
        for (var i = 0; i < this.moveArr.length; i++) {
            var item = this.moveArr[i];
            item.txt.alpha = 1;
            item.txt.x -= item.speed / 100 * (60 / GameConsts_1.default.gameFrameRate);
            // TweenAniManager.instance.horizontalAni(item.txt, item.txt.x - item.speed, null, null, 1000)
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
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, true, false, "RoleBarrageUI");
        }
        else {
            cacheItem.setItemViewScale(scaleRoleInfo);
            this.roleAnim = cacheItem;
        }
        this._lastRoleId = this.roleId;
        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    onClickBg() {
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.RoleBarrageUI);
        TimerManager_1.default.instance.removeByObject(this);
        this.barrageCtn.removeChildren();
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.UnlockRoleUI, { "roleId": this.roleId, callBack: this.callBack, thisObj: this.thisObj });
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
exports.default = RoleBarrageUI;
//# sourceMappingURL=RoleBarrageUI.js.map