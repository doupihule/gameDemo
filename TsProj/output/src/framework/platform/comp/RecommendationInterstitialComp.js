"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationInterstitialComp = void 0;
const LogsManager_1 = require("../../manager/LogsManager");
const TopViewAutoComp_1 = require("./TopViewAutoComp");
const ChannelConst_1 = require("../../../game/sys/consts/ChannelConst");
const UserInfo_1 = require("../../common/UserInfo");
const GameSwitch_1 = require("../../common/GameSwitch");
const Message_1 = require("../../common/Message");
const WindowEvent_1 = require("../../event/WindowEvent");
const GameUtils_1 = require("../../../utils/GameUtils");
class RecommendationInterstitialComp extends TopViewAutoComp_1.TopViewAutoComp {
    /**
     * 初始化组件
     */
    constructor(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
        super();
        /** 加载是否成功 */
        this._loadSuccess = false;
        this._hasError = false;
        this.updateInfo(parent, onErrorCallback, onCloseCallback, callbackObj);
        // this.registerBanner();
    }
    /**
     * interstitialId getter方法
     */
    static get interstitialId() {
        // 初始化广告参数
        if (!this._interstitialId) {
            if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).recommendPortalId) {
                this._interstitialId = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).recommendPortalId;
            }
            if (GameSwitch_1.default.getSwitchState(GameSwitch_1.default.RECOMMEN_PORTAL_ID)) {
                this._interstitialId = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.RECOMMEN_PORTAL_ID);
            }
        }
        return this._interstitialId;
    }
    /**
     * InterstitialAd预加载
     */
    static register() {
        LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd 预加载");
        // 不支持的组件直接返回
        if (!RecommendationInterstitialComp.canUse()) {
            return;
        }
        if (!this._instance) {
            this._instance = new RecommendationInterstitialComp(null);
        }
        if (!this._instance._interstitialAd) {
            this._instance.registerInterstitialAd();
        }
    }
    /**
     * 创建Banner推广组件：微信
     */
    static create(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
        LogsManager_1.default.echo("hlx 推荐插屏 RecommendationInterstitialComp create start:", (parent && parent.windowName) ? GameUtils_1.default.decryptStr(parent.windowName) : null);
        // 不支持的组件直接返回
        if (!RecommendationInterstitialComp.canUse()) {
            onErrorCallback && onErrorCallback.call(this);
            return;
        }
        if (!this._instance) {
            this._instance = new RecommendationInterstitialComp(parent, onErrorCallback, onCloseCallback, callbackObj);
        }
        else {
            this._instance.updateInfo(parent, onErrorCallback, onCloseCallback, callbackObj);
            // InterstitialAd _hideType 为 隐藏销毁类型。每次重新创建需要重新添加事件
            Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this._instance);
        }
    }
    /**
     * 更新组件信息
     */
    updateInfo(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
        // 初始化推荐参数
        this._onErrorCallback = onErrorCallback;
        this._onCloseCallback = onCloseCallback;
        this._parentName = (parent && parent.windowName) ? parent.windowName : null;
        this._callbackObj = callbackObj;
        // Banner组件隐藏式
        this._hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY;
        this._checkUIState(true);
    }
    /**注册InterstitialAd */
    registerInterstitialAd() {
        LogsManager_1.default.echo('hlx 推荐插屏 InterstitialAd registerInterstitialAd');
        this._loadSuccess = false;
        if (!RecommendationInterstitialComp.canUse())
            return;
        //判断是否有插屏广告,如果没有插屏广告
        var wx = UserInfo_1.default.platform.getWX();
        var thisObj = this;
        this._interstitialAd = wx.createGamePortal({
            adUnitId: RecommendationInterstitialComp.interstitialId
        });
        if (this._interstitialAd) {
            var interstitialAd = this._interstitialAd;
            this._hasShow = false;
            interstitialAd.onError(err => {
                LogsManager_1.default.echo('hlx 推荐插屏 InterstitialAd: onError', JSON.stringify(err));
                thisObj._loadSuccess = false;
                thisObj._hasError = true;
                thisObj._checkUIState(true);
            });
            interstitialAd.onLoad(() => {
                LogsManager_1.default.echo('hlx 推荐插屏 InterstitialAd: onLoad success');
                thisObj._loadSuccess = true;
                thisObj._hasError = false;
                thisObj._checkUIState(true);
            });
            interstitialAd.onClose(() => {
                LogsManager_1.default.echo("hlx InterstitialAd 插屏广告 onClose");
                // 关闭插屏广告后自动destroy
                thisObj._onCloseCallback && thisObj._onCloseCallback.call(thisObj._callbackObj);
                thisObj.destroy();
            });
        }
        else {
            this._hasError = true;
        }
    }
    _doCallBack() {
        LogsManager_1.default.echo('hlx 推荐插屏 InterstitialAd: _doErrorCallBack');
        var tempFunc = this._onErrorCallback;
        var tempObj = this._callbackObj;
        this._onErrorCallback = null;
        this._onCloseCallback = null;
        this._callbackObj = null;
        this._hasShow = true;
        tempFunc && tempFunc.call(tempObj);
    }
    /**
     * InterstitialAd是否可用
     */
    static canUse() {
        if (UserInfo_1.default.isWX()) {
            if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_INTERSTITIALAD)) {
                LogsManager_1.default.warn("hlx 推荐插屏 InterstitialAd canNotUse:开关关闭 SWITCH_DISABLE_INTERSTITIALAD");
                return false;
            }
            if (!RecommendationInterstitialComp.interstitialId) {
                LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd bannerId 未配置，不初始化banner");
                return false;
            }
            if (!UserInfo_1.default.platform.getSystemInfo().SDKVersion) {
                LogsManager_1.default.echo('hlx 推荐插屏 InterstitialAd not support：取不到SDKVersion');
                return false;
            }
            if (!UserInfo_1.default.platform.getWX().createGamePortal) {
                LogsManager_1.default.echo('hlx 推荐插屏 InterstitialAd createGamePortal 方法不存在：不初始化banner');
                return false;
            }
            var currentVersion = UserInfo_1.default.platform.getSystemInfo().SDKVersion;
            if (UserInfo_1.default.platform.compareVersion(currentVersion, '2.7.5') >= 0) {
                return true;
            }
        }
        LogsManager_1.default.echo('hlx recommend not support');
        return false;
    }
    /**
     * 组件销毁
     */
    destroy() {
        LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd destroy:", GameUtils_1.default.decryptStr(this._parentName));
        super.destroy();
        this._onErrorCallback = null;
        this._onCloseCallback = null;
        this._callbackObj = null;
        if (this._interstitialAd) {
            this.reloadInter();
        }
    }
    /**
     * 重新拉取新的广告
     */
    reloadInter() {
        // 重新拉取实例条件
        // 1.有报错 2.OPPO平台显示过广告后
        if (this._hasError) {
            if (typeof this._interstitialAd.destroy == "function") {
                this._interstitialAd.destroy();
            }
            this._interstitialAd = null;
            this.registerInterstitialAd();
        }
    }
    /**
     * 子类重写show方法。不管force都继续changeStatus
     */
    show(force = false) {
        if (this._lastParentName != this._parentName) {
            // 页面不同：并且之前已经是show状态【相邻的InterstitialAd界面】。需要重新加载新的InterstitialAd
            if (this._status == TopViewAutoComp_1.TopViewAutoComp.STATUS_SHOW) {
                this.reloadInter();
            }
        }
        else {
            // 页面相同：重复是显示状态的。无需额外处理
            if (!force && this._status == TopViewAutoComp_1.TopViewAutoComp.STATUS_SHOW) {
                return;
            }
        }
        this._status = TopViewAutoComp_1.TopViewAutoComp.STATUS_SHOW;
        // 赋值最后展示的页面
        this._lastParentName = this._parentName;
        this._changeStatus();
    }
    /** 子类重写组件显示方法 */
    _compShow() {
        LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd _compShow", Laya.timer.currTimer);
        if (!this._interstitialAd) {
            // 如果不存在实例或者已经展示过一次
            // 重新加载新的InterstitialAd
            this.registerInterstitialAd();
        }
        if (this._hasError) {
            LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd _compShow：InterstitialAd加载存在error直接执行失败回调");
            this._doCallBack();
            return;
        }
        if (this._interstitialAd && this._loadSuccess) {
            this._hasShow = true;
            LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd show", Laya.timer.currTimer);
            this._interstitialAd.show()
                .then(() => {
                LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd广告组件show success", Laya.timer.currTimer);
            })
                .catch(err => {
                LogsManager_1.default.echo("hlx 推荐插屏 InterstitialAd广告组件show error", err);
                this._doCallBack();
            });
        }
    }
}
exports.RecommendationInterstitialComp = RecommendationInterstitialComp;
//# sourceMappingURL=RecommendationInterstitialComp.js.map