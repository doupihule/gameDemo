"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterstitialAdComp = void 0;
const LogsManager_1 = require("../../manager/LogsManager");
const TopViewAutoComp_1 = require("./TopViewAutoComp");
const ChannelConst_1 = require("../../../game/sys/consts/ChannelConst");
const UserInfo_1 = require("../../common/UserInfo");
const GameSwitch_1 = require("../../common/GameSwitch");
const Message_1 = require("../../common/Message");
const AdVideoManager_1 = require("../AdVideoManager");
const WindowEvent_1 = require("../../event/WindowEvent");
const GameUtils_1 = require("../../../utils/GameUtils");
class InterstitialAdComp extends TopViewAutoComp_1.TopViewAutoComp {
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
            if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adInterstitialId) {
                this._interstitialId = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adInterstitialId;
            }
            if (GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SCREEN_ID)) {
                this._interstitialId = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SCREEN_ID);
            }
        }
        return this._interstitialId;
    }
    /**
     * InterstitialAd预加载
     */
    static register() {
        LogsManager_1.default.echo("hlx InterstitialAd 预加载");
        // 不支持的组件直接返回
        if (!InterstitialAdComp.canUse()) {
            return;
        }
        if (!this._instance) {
            this._instance = new InterstitialAdComp(null);
        }
        if (!this._instance._interstitialAd) {
            this._instance.registerInterstitialAd();
        }
    }
    /**
     * 创建Banner推广组件：微信
     */
    static create(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
        LogsManager_1.default.echo("hlx InterstitialAdComp create start:", (parent && parent.windowName) ? GameUtils_1.default.decryptStr(parent.windowName) : null);
        // 不支持的组件直接返回
        if (!InterstitialAdComp.canUse()) {
            onErrorCallback && onErrorCallback.call(this);
            return;
        }
        if (!this._instance) {
            this._instance = new InterstitialAdComp(parent, onErrorCallback, onCloseCallback, callbackObj);
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
        LogsManager_1.default.echo('hlx InterstitialAd registerInterstitialAd');
        this._loadSuccess = false;
        this._hasError = false;
        var thisObj = this;
        if (!InterstitialAdComp.canUse())
            return;
        //判断是否有插屏广告,如果没有插屏广告
        var wx = UserInfo_1.default.platform.getWX();
        if (UserInfo_1.default.isOppo()) {
            this._interstitialAd = wx.createInsertAd({
                posId: InterstitialAdComp.interstitialId
            });
        }
        else if (UserInfo_1.default.isVivo()) {
            this._interstitialAd = wx.createInterstitialAd({
                posId: InterstitialAdComp.interstitialId
            });
        }
        else {
            this._interstitialAd = wx.createInterstitialAd({
                adUnitId: InterstitialAdComp.interstitialId
            });
        }
        var onErrorBack = (err) => {
            LogsManager_1.default.echo('hlx InterstitialAd: onError', JSON.stringify(err));
            thisObj._loadSuccess = false;
            thisObj._hasError = true;
            thisObj._checkUIState(true);
        };
        var onLoadBack = (err) => {
            LogsManager_1.default.echo('whn InterstitialAd: onLoad success');
            thisObj._loadSuccess = true;
            thisObj._hasError = false;
            thisObj._checkUIState(true);
        };
        var onCloseBack = (err) => {
            LogsManager_1.default.echo("whn InterstitialAd 插屏广告 onClose");
            // 关闭插屏广告后自动destroy
            thisObj._onCloseCallback && thisObj._onCloseCallback.call(thisObj._callbackObj);
            thisObj.destroy();
        };
        LogsManager_1.default.echo("hlx InterstitialAd instance:", this._interstitialAd);
        if (this._interstitialAd) {
            var interstitialAd = this._interstitialAd;
            this._interstitialAd.__isDestoryed = false;
            this._hasShow = false;
            if (UserInfo_1.default.isTT()) {
                //需要把这些回调存对象存起来 方便销毁
                InterstitialAdComp._interstitialCallBackCache.push({ instance: this._interstitialAd, onLoad: onLoadBack, onError: onErrorBack, onClose: onCloseBack });
                interstitialAd.onError(onErrorBack);
                interstitialAd.onLoad(onLoadBack);
                interstitialAd.onClose(onCloseBack);
            }
            else {
                interstitialAd.onError(err => {
                    LogsManager_1.default.echo('hlx InterstitialAd: onError', JSON.stringify(err));
                    thisObj._loadSuccess = false;
                    thisObj._hasError = true;
                    thisObj._checkUIState(true);
                });
                interstitialAd.onLoad(() => {
                    LogsManager_1.default.echo('hlx InterstitialAd: onLoad success');
                    thisObj._loadSuccess = true;
                    thisObj._hasError = false;
                    thisObj._checkUIState(true);
                });
                if (UserInfo_1.default.isOppo()) {
                    interstitialAd.onShow(() => {
                        LogsManager_1.default.echo("hlx InterstitialAd 插屏广告展示成功");
                    });
                }
                else {
                    interstitialAd.onClose(() => {
                        LogsManager_1.default.echo("hlx InterstitialAd 插屏广告 onClose");
                        // 关闭插屏广告后自动destroy
                        thisObj._onCloseCallback && thisObj._onCloseCallback.call(thisObj._callbackObj);
                        thisObj.destroy();
                    });
                }
            }
        }
        else {
            this._hasError = true;
        }
    }
    _doCallBack() {
        LogsManager_1.default.echo('hlx InterstitialAd: _doErrorCallBack');
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
        if (!(UserInfo_1.default.isWX() || UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo() || UserInfo_1.default.isTT() || UserInfo_1.default.isQQGame())) {
            LogsManager_1.default.warn("hlx InterstitialAd canNotUse:该平台不支持插屏广告");
            return false;
        }
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_INTERSTITIALAD)) {
            LogsManager_1.default.warn("hlx InterstitialAd canNotUse:开关关闭 SWITCH_DISABLE_INTERSTITIALAD");
            return false;
        }
        if (!AdVideoManager_1.default.instance._isInitAdv) {
            LogsManager_1.default.warn("hlx InterstitialAd canNotUse:广告组件未加载完毕");
            return false;
        }
        if (!InterstitialAdComp.interstitialId) {
            LogsManager_1.default.warn("hlx InterstitialAd canNotUse:不初始化InterstitialAd");
            return false;
        }
        if (UserInfo_1.default.isOppo()) {
            if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_OPPO_REVIEW)) {
                LogsManager_1.default.echo('hlx InterstitialAd canNotUse:review模式不显示插屏');
                return false;
            }
            if (!UserInfo_1.default.platform.getWX().createInsertAd) {
                LogsManager_1.default.echo('hlx InterstitialAd canNotUse:该设备不支持 createInsertAd 函数');
                return false;
            }
        }
        else {
            if (UserInfo_1.default.isTT()) {
                // 插屏广告仅今日头条安卓客户端支持
                if (UserInfo_1.default.platform.getSystemInfo().appName != "Toutiao") {
                    LogsManager_1.default.echo('whn InterstitialAd canNotUse: 插屏广告仅今日头条支持');
                    return false;
                }
                if (UserInfo_1.default.platform.getSystemInfo().platform == "ios") {
                    LogsManager_1.default.echo('whn InterstitialAd canNotUse: IOS不支持头条插屏广告');
                    return false;
                }
            }
            if (!UserInfo_1.default.platform.getWX().createInterstitialAd) {
                LogsManager_1.default.echo('hlx InterstitialAd canNotUse:该设备不支持 createInterstitialAd 函数');
                return false;
            }
        }
        return true;
    }
    /**
     * 组件销毁
     */
    destroy() {
        LogsManager_1.default.echo("hlx InterstitialAd destroy:", GameUtils_1.default.decryptStr(this._parentName));
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
        if (UserInfo_1.default.isVivo() || UserInfo_1.default.isTT() || UserInfo_1.default.isQQGame()) {
            // Vivo或者tt实例不能复用。必须每次重新创建
            LogsManager_1.default.echo('hlx InterstitialAd reloadInter:vivo/tt/qq 只销毁实例，不重新拉取');
            if (this._interstitialAd) {
                if (UserInfo_1.default.isVivo() || UserInfo_1.default.isQQGame()) {
                    if (typeof this._interstitialAd.destroy == "function") {
                        this._interstitialAd.destroy();
                    }
                }
                else {
                    LogsManager_1.default.echo('whn InterstitialAd reloadInter tt: 删除');
                    this._ttDestroyInterstitialAd(this._interstitialAd);
                }
                this._interstitialAd = null;
            }
            return;
        }
        // 重新拉取实例条件
        // 1.有报错 2.OPPO平台显示过广告后
        if (this._hasError) {
            if (typeof this._interstitialAd.destroy == "function") {
                this._interstitialAd.destroy();
            }
            this._interstitialAd = null;
            this.registerInterstitialAd();
        }
        else if (UserInfo_1.default.isOppo() && this._hasShow) {
            if (!this._interstitialAd) {
                this.registerInterstitialAd();
            }
            else {
                // OPPO平台插屏广告关闭不自动拉取，所以需要手动拉取
                this._hasShow = false;
                this._interstitialAd.load();
            }
        }
    }
    /*
    * 头条destory插屏
    */
    _ttDestroyInterstitialAd(instance) {
        LogsManager_1.default.echo("whn 销毁一个插屏------------", instance);
        //删除插屏的回调
        this._offTTInterstitialAdCallBack(instance);
        if (instance.__isDestoryed) {
            LogsManager_1.default.warn("这个插屏已经执行过销毁了 为什么会重复执行--");
            return;
        }
        if (typeof instance.destroy == "function") {
            instance.__isDestoryed = true;
            instance.destroy();
        }
    }
    /**
     * 关闭头条插屏的回调
     */
    _offTTInterstitialAdCallBack(instance) {
        for (var i = InterstitialAdComp._interstitialCallBackCache.length - 1; i >= 0; i--) {
            var info = InterstitialAdComp._interstitialCallBackCache[i];
            if (info.instance == instance) {
                if (typeof instance.offClose == "function") {
                    instance.offClose(info.onClose);
                }
                if (typeof instance.offLoad == "function") {
                    instance.offLoad(info.onLoad);
                }
                if (typeof instance.offError == "function") {
                    instance.offError(info.onError);
                }
                //移除这个数组
                InterstitialAdComp._interstitialCallBackCache.splice(i, 1);
            }
        }
    }
    /**
     * 子类重写show方法。不管force都继续changeStatus
     */
    show(force = false) {
        LogsManager_1.default.echo("hlx InterstitialAd show _lastParentName:", this._lastParentName, " _parentName:", this._parentName, " force:", force);
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
        LogsManager_1.default.echo("hlx InterstitialAd _compShow", Laya.timer.currTimer);
        if (AdVideoManager_1.default.instance.isInterstitialLimit()) {
            LogsManager_1.default.echo("hlx InterstitialAd _compShow：插屏广告isInterstitialLimit");
            this._doCallBack();
            return;
        }
        if (!this._interstitialAd) {
            // 如果不存在实例或者已经展示过一次
            // 重新加载新的InterstitialAd
            this.registerInterstitialAd();
        }
        if (this._hasError) {
            LogsManager_1.default.echo("hlx InterstitialAd _compShow：InterstitialAd加载存在error直接执行失败回调");
            this._doCallBack();
            return;
        }
        if (this._interstitialAd && this._loadSuccess) {
            this._hasShow = true;
            LogsManager_1.default.echo("hlx InterstitialAd show", Laya.timer.currTimer);
            if (typeof this._interstitialAd.show == "function") {
                try {
                    var promise = this._interstitialAd.show();
                    if (UserInfo_1.default.isWX() || UserInfo_1.default.isTT()) {
                        promise && promise.then(() => {
                            LogsManager_1.default.echo("hlx InterstitialAd广告组件show success", Laya.timer.currTimer);
                        })
                            .catch(err => {
                            LogsManager_1.default.echo("hlx InterstitialAd广告组件show error", JSON.stringify(err));
                            this._doCallBack();
                        });
                    }
                    // 更新当日次数及时间
                    AdVideoManager_1.default.instance.updateInterstitialLimit();
                }
                catch (e) {
                    if (e) {
                        LogsManager_1.default.errorTag('InterstitialAd_show_error', e.toString());
                    }
                    else {
                        LogsManager_1.default.errorTag('InterstitialAd_show_error', "InterstitialAd_show_error");
                    }
                }
            }
            else {
                LogsManager_1.default.errorTag("hlx _interstitialAd.show 方法不存在");
            }
        }
    }
}
exports.InterstitialAdComp = InterstitialAdComp;
//头条插屏注册的回调缓存 
InterstitialAdComp._interstitialCallBackCache = [];
//# sourceMappingURL=InterstitialAdComp.js.map