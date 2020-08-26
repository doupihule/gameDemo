"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../../common/Message");
const WindowEvent_1 = require("../../event/WindowEvent");
const JumpManager_1 = require("../../manager/JumpManager");
const WindowManager_1 = require("../../manager/WindowManager");
const MainJumpReturnUI_1 = require("../../view/jump/MainJumpReturnUI");
const ScreenAdapterTools_1 = require("../../utils/ScreenAdapterTools");
class MainJumpReturnComp {
    constructor() {
        this._uiJumpMap = [
            { ui: null, uiCfg: {} }
        ];
        Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this);
        var uiinfo = this._uiJumpMap[0];
        if (!uiinfo.ui) {
            uiinfo.ui = new MainJumpReturnUI_1.default();
            uiinfo.ui.y = ScreenAdapterTools_1.default.height / 2;
        }
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new MainJumpReturnComp();
        }
        return this._instance;
    }
    //检查ui状态
    _checkUIState() {
        var currentUIName = WindowManager_1.default.getCurrentWindowName();
        for (var i = 0; i < this._uiJumpMap.length; i++) {
            var uiInfo = this._uiJumpMap[i];
            var uiCfg = uiInfo.uiCfg;
            var currentInfo = uiCfg[currentUIName];
            var returnBtnUI = uiInfo.ui;
            //如果当前界面不展示退出按钮
            if (!currentInfo) {
                returnBtnUI.onRemoveStage();
            }
            else {
                //如果这个ui的状态是显示的
                if (currentInfo.state == 1) {
                    var ui = WindowManager_1.default.getCurrentWindow();
                    ui.addChild(returnBtnUI);
                    returnBtnUI.initData();
                }
                else {
                    returnBtnUI.onRemoveStage();
                }
            }
        }
    }
    //接受事件
    recvMsg(cmd, params) {
        if (cmd == WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN) {
            this._checkUIState();
        }
    }
    /**展示互推抽屉打开按钮 */
    showJumpReturnBtn(parent, params = null) {
        if (!JumpManager_1.default.checkShow())
            return;
        var uiName = parent.windowName;
        var jumpInfo = this._uiJumpMap[0];
        var uiCfg = jumpInfo.uiCfg;
        if (!uiCfg[uiName]) {
            uiCfg[uiName] = { state: 1, params: params };
        }
        this._checkUIState();
    }
}
exports.default = MainJumpReturnComp;
//# sourceMappingURL=MainJumpReturnComp.js.map