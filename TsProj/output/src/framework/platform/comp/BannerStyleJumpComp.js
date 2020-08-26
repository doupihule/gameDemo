"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BannerComp_1 = require("./BannerComp");
const Message_1 = require("../../common/Message");
const WindowEvent_1 = require("../../event/WindowEvent");
const JumpManager_1 = require("../../manager/JumpManager");
const WindowManager_1 = require("../../manager/WindowManager");
const BannerStyleJumpUI_1 = require("../../view/jump/BannerStyleJumpUI");
const ScreenAdapterTools_1 = require("../../utils/ScreenAdapterTools");
const KariquShareConst_1 = require("../../consts/KariquShareConst");
class BannerStyleJumpComp {
    constructor() {
        //ui对应的jumpMap
        /**
         * 0 表示底部的数据  1表示顶部的
            uiCfg:
         *      ui名字:{
         *          state:  1 显示, 0关闭
         *          onErrorCallback: 没有互推数据时的回调
         *          thisObj: this指针
         *      }
         * dataType:采用的数据源id
         * ui:对应的JumpUI
         */
        this._uiJumpMap = [
            { ui: null, uiCfg: {}, dataType: 22, jumpData: null },
            { ui: null, uiCfg: {}, dataType: 22, jumpData: null }
        ];
        Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this);
        var uiinfo = this._uiJumpMap[0];
        if (!uiinfo.ui) {
            uiinfo.ui = new BannerStyleJumpUI_1.default();
            uiinfo.ui.y = ScreenAdapterTools_1.default.height - BannerStyleJumpComp.jumpHeight;
        }
        uiinfo = this._uiJumpMap[1];
        if (!uiinfo.ui) {
            uiinfo.ui = new BannerStyleJumpUI_1.default();
            uiinfo.ui.y = 80;
        }
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new BannerStyleJumpComp();
        }
        return this._instance;
    }
    init() {
        if (KariquShareConst_1.default.isOpenBannerStyleJump) {
            //如果开banner转互推 那么不做banner缓存
            if (BannerComp_1.BannerComp.platformToCacheBannerNumsMap) {
                BannerComp_1.BannerComp.platformToCacheBannerNumsMap.wxgame = 0;
            }
        }
    }
    onJumpDataBack() {
    }
    //检查ui状态
    _checkUIState() {
        var currentUIName = WindowManager_1.default.getCurrentWindowName();
        //如果没有互推数据
        if (!this.checkHasJumpData()) {
            return;
        }
        for (var i = 0; i < this._uiJumpMap.length; i++) {
            var uiInfo = this._uiJumpMap[i];
            var uiCfg = uiInfo.uiCfg;
            var currentInfo = uiCfg[currentUIName];
            var jumpui = uiInfo.ui;
            //如果当前界面不展示互推
            if (!currentInfo) {
                jumpui.removeSelf();
            }
            else {
                //如果这个ui的状态是显示的
                if (currentInfo.state == 1) {
                    var ui = WindowManager_1.default.getCurrentWindow();
                    ui.addChild(jumpui);
                    if (!uiInfo.jumpData) {
                        uiInfo.jumpData = JumpManager_1.default.getMokaDataByType(uiInfo.dataType);
                        jumpui.initData(uiInfo.jumpData, ui.windowName);
                    }
                }
                else {
                    jumpui.removeSelf();
                }
            }
        }
    }
    //判断是否有互推数据
    checkHasJumpData() {
        if (!JumpManager_1.default.data || JumpManager_1.default.data.length == 0) {
            return false;
        }
        return true;
    }
    //接受事件
    recvMsg(cmd, params) {
        if (cmd == WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN) {
            this._checkUIState();
        }
    }
    //显示一个 jumpUI
    /**
     *
     * @param parent  传入ui
     * @param onErrorCallback 错误回调
     * @param callbackObj
     * @param params
     */
    showJump(parent, onErrorCallback = null, callbackObj = null, params = null) {
        this.showJumpByIndex(0, parent, onErrorCallback, callbackObj, params);
    }
    //显示 顶部jump
    showShowTopJump(parent, onErrorCallback = null, callbackObj = null, params = null) {
        this.showJumpByIndex(1, parent, onErrorCallback, callbackObj, params);
    }
    //index 0是底部 ,1是顶部
    showJumpByIndex(index, parent, onErrorCallback = null, callbackObj = null, params = null) {
        JumpManager_1.default.initJumpData(this.onJumpDataBack, this);
        var uiName = parent.windowName;
        var jumpInfo = this._uiJumpMap[index];
        var uiCfg = jumpInfo.uiCfg;
        if (!uiCfg[uiName]) {
            uiCfg[uiName] = { state: 1, onErrorCallback: onErrorCallback, thisObj: callbackObj, params: params };
        }
        this._checkUIState();
    }
    //关闭一个ui
    closeDownJump(parent) {
        this.closeJumpByIndex(0, parent);
    }
    //关闭顶部jump
    closeTopJump(parent) {
        this.closeJumpByIndex(1, parent);
    }
    //根据序号关闭某个界面的jump 0是底部,1是顶部
    closeJumpByIndex(index, parent) {
        var uiName = parent.windowName;
        var jumpInfo = this._uiJumpMap[index];
        var uiCfg = jumpInfo.uiCfg;
        delete uiCfg[uiName];
        this._checkUIState();
    }
}
exports.default = BannerStyleJumpComp;
//互推页的高度
BannerStyleJumpComp.jumpHeight = 170;
//# sourceMappingURL=BannerStyleJumpComp.js.map