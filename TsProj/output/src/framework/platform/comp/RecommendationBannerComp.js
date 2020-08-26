"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationBannerComp = void 0;
const LogsManager_1 = require("../../manager/LogsManager");
const StatisticsManager_1 = require("../../../game/sys/manager/StatisticsManager");
const TopViewAutoComp_1 = require("./TopViewAutoComp");
const ChannelConst_1 = require("../../../game/sys/consts/ChannelConst");
const UserInfo_1 = require("../../common/UserInfo");
const GameSwitch_1 = require("../../common/GameSwitch");
const Message_1 = require("../../common/Message");
const WindowEvent_1 = require("../../event/WindowEvent");
const StatisticsCommonConst_1 = require("../../consts/StatisticsCommonConst");
const GameUtils_1 = require("../../../utils/GameUtils");
class RecommendationBannerComp extends TopViewAutoComp_1.TopViewAutoComp {
    /**
     * 初始化组件
     */
    constructor(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY) {
        super();
        /** 加载是否成功 */
        this._loadSuccess = false;
        this._hasError = false;
        this.updateInfo(parent, onErrorCallback, callbackObj, hideType);
        // this.registerBanner();
    }
    /**
     * recommendBannerId getter方法
     */
    static get recommendBannerId() {
        // 初始化广告参数
        if (!this._bannerId) {
            if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).recommendBannerId) {
                this._bannerId = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).recommendBannerId;
            }
            if (GameSwitch_1.default.getSwitchState(GameSwitch_1.default.RECOMMEN_BANNER_ID)) {
                this._bannerId = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.RECOMMEN_BANNER_ID);
            }
        }
        return this._bannerId;
    }
    /**
     * banner预加载
     */
    static register() {
        LogsManager_1.default.echo("hlx recommend banner 预加载");
        // 不支持的组件直接返回
        if (!RecommendationBannerComp.canUse()) {
            return;
        }
        if (!this._instance) {
            this._instance = new RecommendationBannerComp(null, null, null);
        }
        if (!this._instance._bannerAd) {
            this._instance.registerBanner();
        }
    }
    /**
     * 创建Banner推广组件：微信
     */
    static create(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY) {
        LogsManager_1.default.echo("recommendBannerComp create start:", (parent && parent.windowName) ? GameUtils_1.default.decryptStr(parent.windowName) : null);
        // 不支持的组件直接返回
        if (!RecommendationBannerComp.canUse()) {
            onErrorCallback && onErrorCallback.call(this);
            return;
        }
        if (!this._instance) {
            this._instance = new RecommendationBannerComp(parent, onErrorCallback, callbackObj, hideType);
        }
        else {
            this._instance.updateInfo(parent, onErrorCallback, callbackObj, hideType);
            // banner _hideType 为 隐藏销毁类型。每次重新创建需要重新添加事件
            Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this._instance);
        }
    }
    /**
     * 更新组件信息
     */
    updateInfo(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY) {
        // 初始化推荐参数
        this._onErrorCallback = onErrorCallback;
        this._parentName = (parent && parent.windowName) ? parent.windowName : null;
        this._callbackObj = callbackObj;
        // Banner组件隐藏式
        this._hideType = hideType;
        this._checkUIState(true);
    }
    /**注册banner */
    registerBanner(offest = -0.1) {
        var thisObj = this;
        LogsManager_1.default.echo("hlx register RecommendBanner");
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.RECOMMEND_BANNER_PULLNUM);
        var wx = UserInfo_1.default.platform.getWX();
        if (this._bannerAd) {
            LogsManager_1.default.warn("hlx banner 实例已经创建，无需重复注册，请检查代码逻辑是否存在异常");
            return;
        }
        if (!wx.createGameBanner) {
            LogsManager_1.default.warn("noGameBanner", "没有Gamebanner组件");
            this._doBannerCallBack();
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.RECOMMEND_BANNER_PULLFAILED);
            return;
        }
        var systemInfo = UserInfo_1.default.platform.getSystemInfo();
        var w = systemInfo.windowWidth;
        var h = systemInfo.windowHeight;
        var bannerWidth = w;
        var left = (w - bannerWidth) / 2;
        this._bannerAd = wx.createGameBanner({
            adUnitId: RecommendationBannerComp.recommendBannerId,
            style: {
                left: left,
                top: 76,
                width: bannerWidth
            }
        });
        if (this._bannerAd) {
            this._isShowBanner = false;
            this._loadSuccess = false;
            var bannerAd = this._bannerAd;
            bannerAd.onError((err) => {
                LogsManager_1.default.echo("hlx recommend bannerAd.onError----------------------", JSON.stringify(err));
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.RECOMMEND_BANNER_PULLFAILED);
                // 由于registerBanner为异步预加载。所以不能直接执行失败回调。标记状态。在show时回调
                this._hasError = true;
                this._loadSuccess = false;
                this._checkUIState(true);
            });
            bannerAd.onLoad(() => {
                this._hasError = false;
                this._loadSuccess = true;
                // 拉取不同的banner大小会不一样。要根据大小调整top left
                LogsManager_1.default.echo("hlx recommend bannerAd.onLoad:");
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.RECOMMEND_BANNER_PULLSUCCESS);
                bannerAd.style.left = (w - bannerAd.style.width) / 2;
                bannerAd.style.top = h - bannerAd.style.height + offest;
                this._checkUIState(true);
            });
            bannerAd.onResize(size => {
                LogsManager_1.default.echo("hlx recommend bannerAd.onResize:", size.width, size.height);
                // 如果一开始设置的 banner 宽度超过了系统限制，可以在此处加以调整
                // 头条存在width=0情况，需要做特殊判断
                if (size.width != 0) {
                    bannerAd.style.left = (w - size.width) / 2;
                    bannerAd.style.top = h - size.height + offest;
                }
            });
        }
    }
    _doBannerCallBack() {
        LogsManager_1.default.echo("hlx _doRecommendBannerCallBack _onErrorCallback");
        var tempFunc = this._onErrorCallback;
        var tempObj = this._callbackObj;
        // 注意！由于组件复用，此处无需重置回调。新界面调用组件，会覆盖回调
        // this._onErrorCallback = null;
        // this._callbackObj = null;
        this._loadSuccess = false;
        this._isShowBanner = true;
        this._hasError = false;
        tempFunc && tempFunc.call(tempObj);
    }
    static canUse() {
        if (UserInfo_1.default.isWX()) {
            if (!RecommendationBannerComp.recommendBannerId) {
                LogsManager_1.default.echo("hlx recommend bannerId 未配置，不初始化banner");
                return false;
            }
            if (!UserInfo_1.default.platform.getSystemInfo().SDKVersion) {
                LogsManager_1.default.echo('hlx recommend not support：取不到SDKVersion');
                return false;
            }
            var currentVersion = UserInfo_1.default.platform.getSystemInfo().SDKVersion;
            if (UserInfo_1.default.platform.compareVersion(currentVersion, '2.7.5') >= 0) {
                return true;
            }
            if (!UserInfo_1.default.platform.getWX().createGameBanner) {
                LogsManager_1.default.echo('hlx recommend createGameBanner 方法不存在：不初始化banner');
                return false;
            }
        }
        LogsManager_1.default.echo('hlx recommend not support');
        return false;
    }
    /**
     * 组件销毁
     */
    destroy() {
        LogsManager_1.default.echo("hlx recommend banner destroy:", GameUtils_1.default.decryptStr(this._parentName));
        super.destroy();
        this._onErrorCallback = null;
        this._callbackObj = null;
        if (this._bannerAd) {
            this.reLoadBanner();
        }
    }
    reLoadBanner() {
        if (this._bannerAd) {
            this._bannerAd.hide();
        }
        if (this._isShowBanner || this._hasError) {
            LogsManager_1.default.echo("hlx recommend banner reload, ad destory: _isShowBanner:", this._isShowBanner, " _hasError:", this._hasError);
            // 由于需要预加载所以要销毁重新拉取新的banner
            if (typeof this._bannerAd.destroy == "function") {
                this._bannerAd.destroy();
            }
            this._bannerAd = null;
            this.registerBanner();
        }
    }
    /**
     * 子类重写show方法。不管force都继续changeStatus
     */
    show(force = false) {
        if (this._lastParentName != this._parentName) {
            // 页面不同：并且之前已经是show状态【相邻的banner界面】。需要重新加载新的banner
            if (this._status == TopViewAutoComp_1.TopViewAutoComp.STATUS_SHOW && this._hideType == TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY) {
                this.reLoadBanner();
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
        LogsManager_1.default.echo("hlx recommend banner _compShow", Laya.timer.currTimer);
        if (!this._bannerAd) {
            // 如果不存在实例或者已经展示过一次
            // 重新加载新的banner
            this.registerBanner();
        }
        if (this._hasError) {
            LogsManager_1.default.echo("hlx banner _compShow：banner加载存在error直接执行失败回调");
            this._doBannerCallBack();
            return;
        }
        if (this._bannerAd && this._loadSuccess) {
            this._isShowBanner = true;
            LogsManager_1.default.echo("hlx recommend banner show", Laya.timer.currTimer);
            this._bannerAd.show()
                .then(() => {
                LogsManager_1.default.echo("hlx 推荐广告组件show success", Laya.timer.currTimer);
            })
                .catch(err => {
                LogsManager_1.default.echo("hlx 推荐广告组件show error", err);
                this._doBannerCallBack();
            });
            ;
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.RECOMMEND_BANNER_EXPOSURENUM);
        }
        else {
            LogsManager_1.default.echo("hlx redommend banner comp show 没有达到条件：loadSuccess ", this._loadSuccess);
        }
    }
    /** 子类重写组件隐藏方法 */
    _compHide() {
        super.destroy();
        this._onErrorCallback = null;
        this._callbackObj = null;
        if (this._hasError) {
            // 如果有错误，就销毁重新加载banner
            if (typeof this._bannerAd.destroy == "function") {
                this._bannerAd.destroy();
            }
            this._bannerAd = null;
            this.registerBanner();
        }
        else if (this._bannerAd && this._isShowBanner) {
            // 如果没有错误就隐藏banner
            this._isShowBanner = false;
            this._bannerAd.hide();
        }
    }
}
exports.RecommendationBannerComp = RecommendationBannerComp;
//# sourceMappingURL=RecommendationBannerComp.js.map