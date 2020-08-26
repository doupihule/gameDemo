"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerComp = void 0;
const LogsManager_1 = require("../../manager/LogsManager");
const StatisticsManager_1 = require("../../../game/sys/manager/StatisticsManager");
const TopViewAutoComp_1 = require("./TopViewAutoComp");
const ChannelConst_1 = require("../../../game/sys/consts/ChannelConst");
const UserInfo_1 = require("../../common/UserInfo");
const GameSwitch_1 = require("../../common/GameSwitch");
const Message_1 = require("../../common/Message");
const AdVideoManager_1 = require("../AdVideoManager");
const StatisticsCommonConst_1 = require("../../consts/StatisticsCommonConst");
const GameUtils_1 = require("../../../utils/GameUtils");
const WindowManager_1 = require("../../manager/WindowManager");
const TimerManager_1 = require("../../manager/TimerManager");
const Client_1 = require("../../common/kakura/Client");
const NativeBridge_1 = require("../../native/NativeBridge");
const JSToNativeEvent_1 = require("../../event/JSToNativeEvent");
const ScreenAdapterTools_1 = require("../../utils/ScreenAdapterTools");
const NativeToJSEvent_1 = require("../../event/NativeToJSEvent");
class BannerComp extends TopViewAutoComp_1.TopViewAutoComp {
    /**
     * 初始化组件
     */
    constructor(parentName, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY, style = null) {
        super();
        /** 加载是否成功 */
        this._loadSuccess = false;
        /**加载状态 0表示空闲 1表示加载中 2表示加载成功 3表示加载失败 */
        this._loadState = 0;
        //失败计数  
        this._errorCount = 0;
        //这个banner界面剩余使用次数.  如果是从缓存堆里面拿出来的 那么
        this._leftUseCount = 0;
        /** 是否存在错误 */
        this._hasError = false;
        /**
          * 样式字段
          * {
          *  retio:banner大小比例
        width:banner宽度
          * }
          */
        this._style = null;
        this.updateInfo(parentName, onErrorCallback, callbackObj, hideType, style);
        // this.registerBanner();
        Message_1.default.instance.add(NativeToJSEvent_1.default.TTSDK_BANNER_EVENT, this);
    }
    static emptyFunc(m) { }
    //获取能够缓存的banner数量
    static get cacheBannerNums() {
        var rt = this.platformToCacheBannerNumsMap[UserInfo_1.default.platformId];
        if (!rt) {
            return 0;
        }
        ;
        return rt;
    }
    static get instance() {
        return this._instance;
    }
    /**
     * bannerId getter方法
     */
    static get bannerId() {
        // 初始化广告参数
        if (!this._bannerId) {
            if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adBannerId) {
                this._bannerId = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adBannerId;
            }
            // bannerId支持开关配置
            if (GameSwitch_1.default.getSwitchState(GameSwitch_1.default.BANNER_ID)) {
                this._bannerId = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.BANNER_ID);
            }
        }
        return this._bannerId;
    }
    /**
     * bannerId getter方法
     */
    static get appSid() {
        // 初始化广告参数
        if (!this._appSid) {
            if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).appSid) {
                this._appSid = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).appSid;
            }
        }
        return this._appSid;
    }
    /**
     * banner预加载
     */
    static register() {
        LogsManager_1.default.echo("hlx banner 预加载");
        // 不支持的组件直接返回
        if (!BannerComp.canUseBanner()) {
            return;
        }
        if (!this._instance) {
            this._instance = new BannerComp(null, null, null);
        }
        if (!this._instance._bannerAd) {
            this._instance.registerBanner();
        }
    }
    /**
     * 创建Banner推广组件：微信
     */
    static create(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY, style = null) {
        var windowName = parent.windowName;
        LogsManager_1.default.echo("hlx bannerComp create start:", GameUtils_1.default.decryptStr(windowName));
        if (!windowName) {
            LogsManager_1.default.errorTag("banner_noparent", "没有传递parent");
            onErrorCallback && onErrorCallback.call(this);
            return;
        }
        // 不支持的组件直接返回
        if (!BannerComp.canUseBanner()) {
            onErrorCallback && onErrorCallback.call(this);
            return;
        }
        //如果已经有当前的windowName了 那么不需要执行了
        if (this._cacheInfo[windowName]) {
            this._instance.updateInfo(windowName, onErrorCallback, callbackObj, hideType, style);
            return;
        }
        //缓存所有的参数
        this._cacheInfo[windowName] = { name: windowName, params: { onErrorCallback: onErrorCallback, callbackObj: callbackObj, hideType: hideType, style: style } };
        if (!this._instance) {
            this._instance = new BannerComp(windowName, onErrorCallback, callbackObj, hideType, style);
        }
        else {
            this._instance.updateInfo(windowName, onErrorCallback, callbackObj, hideType, style);
        }
    }
    /**
     * 更新组件信息
     */
    updateInfo(parentName, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY, style = null) {
        // 初始化推荐参数
        this._onErrorCallback = onErrorCallback;
        this._parentName = parentName;
        this._callbackObj = callbackObj;
        // Banner组件隐藏式
        this._hideType = hideType;
        this._style = style;
        LogsManager_1.default.echo("ycn banner style", style);
        if (!parentName) {
            return;
        }
        this._checkUIState(true);
    }
    /**
     * 更新缓存的组件信息
     *
     */
    updateDataByName(parentName) {
        var cacheInfo = BannerComp._cacheInfo[parentName];
        if (!cacheInfo) {
            LogsManager_1.default.errorTag("banner_error", "没有找到缓存的uibanner信息", parentName);
            return;
        }
        var params = cacheInfo.params;
        this._onErrorCallback = params.onErrorCallback;
        this._parentName = parentName;
        this._callbackObj = params.callbackObj;
        // Banner组件隐藏式
        this._hideType = params.hideType;
        LogsManager_1.default.echo("ycn banner style", params.style);
        this._style = params.style;
    }
    /**注册banner */
    registerBanner(hasError = false) {
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_PULLNUM);
        if (UserInfo_1.default.isSystemNative()) {
            this._loadSuccess = false;
            //预加载banner
            NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.TTADSDK_BANNER, { status: 2 });
            return;
        }
        LogsManager_1.default.echo("hlx register Banner");
        var tempThis = this;
        var wx = UserInfo_1.default.platform.getWX();
        if (!wx) {
            return;
        }
        if (this._bannerAd) {
            LogsManager_1.default.warn("hlx banner 实例已经创建，无需重复注册，请检查代码逻辑是否存在异常");
            return;
        }
        if (!wx.createBannerAd) {
            LogsManager_1.default.warn("hlx banner noGameBanner", "没有Gamebanner组件");
            this._doBannerCallBack();
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_PULLFAILED);
            return;
        }
        var systemInfo = UserInfo_1.default.platform.getSystemInfo();
        var w = systemInfo.windowWidth;
        var h = systemInfo.windowHeight;
        var bannerWidth = w;
        var left = (w - bannerWidth) / 2;
        //如果有加载失败
        if (hasError) {
            //那么从缓存里面拿
            var banner = BannerComp.getCacheBanner();
            if (banner) {
                LogsManager_1.default.echo("xd_banner_这是一个缓存的banner");
                // WindowManager.ShowTip("使用缓存banner")
                this._loadSuccess = true;
                this._hasError = false;
                //缓存的banner最多使用5次
                this._leftUseCount = BannerComp.BANNER_USE_COUNT;
                this._bannerAd = banner;
                this._checkUIState(true);
                return;
            }
        }
        //正常的banner  只能使用一次
        this._leftUseCount = 0;
        if (UserInfo_1.default.isOppo()) {
            LogsManager_1.default.echo("ycn oppo banner style", tempThis._style);
            if (tempThis._style && tempThis._style.offsetY) {
                LogsManager_1.default.echo("ycn oppo banner with style");
                this._bannerAd = wx.createBannerAd({
                    adUnitId: BannerComp.bannerId,
                    style: {
                        left: left,
                        top: h - 200 + tempThis._style.offsetY,
                    },
                });
            }
            else {
                this._bannerAd = wx.createBannerAd({
                    adUnitId: BannerComp.bannerId,
                });
            }
        }
        else if (UserInfo_1.default.isVivo()) {
            if (BannerComp.lastCreateBannerTime != 0) {
                var leftCD = 11 - Math.ceil((Client_1.default.instance.miniserverTime - BannerComp.lastCreateBannerTime) / 1000);
                if (leftCD > 0) {
                    LogsManager_1.default.echo("hlx banner vivo平台Banner创建最小间隔10秒。直接return");
                    return;
                }
            }
            this._bannerAd = wx.createBannerAd({
                posId: BannerComp.bannerId,
                style: {}
            });
            BannerComp.lastCreateBannerTime = Client_1.default.instance.miniserverTime;
        }
        else if (UserInfo_1.default.isTT()) {
            // 头条最大宽度208
            bannerWidth = Math.max(w, 208);
            left = (w - bannerWidth) / 2;
            // 预配置top避免闪移问题
            var offsetY = 0;
            if (tempThis._style && tempThis._style.offsetY) {
                offsetY = tempThis._style.offsetY;
            }
            //暂定给125高度,现在的tt高度是125
            var top = h - 125 + offsetY;
            this._bannerAd = wx.createBannerAd({
                adUnitId: BannerComp.bannerId,
                style: {
                    left: left,
                    top: top,
                    width: bannerWidth
                },
                adIntervals: 30,
            });
        }
        else if (UserInfo_1.default.isBaidu()) {
            this._bannerAd = wx.createBannerAd({
                adUnitId: BannerComp.bannerId,
                appSid: BannerComp.appSid,
                style: {
                    left: left,
                    top: 76,
                    width: bannerWidth
                },
                adIntervals: 30,
            });
        }
        else if (UserInfo_1.default.isUC()) {
            // 拉取不同的banner大小会不一样。要根据大小调整top left
            var offsetY = 0;
            if (tempThis._style && tempThis._style.offsetY) {
                offsetY = tempThis._style.offsetY;
            }
            // 设置宽度
            var width = systemInfo.screenWidth;
            if (tempThis._style && tempThis._style.retio) {
                width = systemInfo.screenWidth * tempThis._style.retio;
            }
            else if (tempThis._style && tempThis._style.width) {
                width = tempThis._style.width;
            }
            // UC 小游戏  banner  广告尺寸比例为   600:150
            var bannerHeight = width * 150 / 600;
            var bottom = offsetY + bannerHeight;
            this._bannerAd = wx.createBannerAd({
                style: {
                    gravity: 7,
                    // 3：左边垂直居中 4：居中 5：右边垂直居中
                    // 6：左下 7：底部居中 8：右下 （默认为0）
                    // left: 10, 			// 左边 margin
                    // top: 76, 				// 顶部 margin
                    // bottom: 100, 		// 底部 margin
                    // right: 100, 		// 右边 margin
                    width: width,
                    bottom: bottom,
                    height: 0,
                }
            });
        }
        else {
            this._bannerAd = wx.createBannerAd({
                adUnitId: BannerComp.bannerId,
                style: {
                    left: left,
                    top: 1136,
                    width: bannerWidth
                },
                adIntervals: 30,
            });
        }
        var bannerAd = null;
        var onErrorBack = (err) => {
            if (tempThis._leftUseCount > 0) {
                LogsManager_1.default.echo("当前是缓存的banner 什么都不要做");
                tempThis._checkUIState(true);
                return;
            }
            if (bannerAd && bannerAd.__isDestoryed) {
                LogsManager_1.default.errorTag("bannerError", "这个banner已经被销毁了可能是网络原因导致的.再做一次销毁逻辑");
                BannerComp.checkCahceOrDestoryBanner(bannerAd, true);
                return;
            }
            LogsManager_1.default.echo("hlx bannerAd.onError----------------------count:", tempThis._errorCount, JSON.stringify(err));
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_PULLFAILED);
            // 由于registerBanner为异步预加载。所以不能直接执行失败回调。标记状态。在show时回调
            tempThis._hasError = true;
            tempThis._loadSuccess = false;
            tempThis._errorCount++;
            //如果失败次数小于尝试次数 就做重新加载
            if (tempThis._errorCount <= BannerComp.TRY_LOAD_COUNT) {
                // tempThis._checkUIState(true);
                tempThis.reLoadBanner(true);
            }
            else {
                //销毁广告对象 并做回调
                if (tempThis._bannerAd) {
                    BannerComp.checkCahceOrDestoryBanner(tempThis._bannerAd, tempThis._hasError);
                    tempThis._bannerAd = null;
                }
                //如果有缓存的banner.那么直接用缓存的
                if (BannerComp._cacheBannerArr.length > 0) {
                    tempThis.reLoadBanner();
                }
                else {
                    //如果没有缓存的banner 那么需要重试一次
                    if (tempThis._errorCount == 1) {
                        tempThis.reLoadBanner(true);
                    }
                    else {
                        //否则
                        tempThis._hasError = false;
                        tempThis._doBannerCallBack();
                    }
                }
            }
        };
        var onLoadBack = (res) => {
            LogsManager_1.default.echo('hlx bannerAd.onload:', JSON.stringify(res));
            if (bannerAd.__isDestoryed) {
                LogsManager_1.default.errorTag("bannerError", "这个banner已经被销毁了可能是网络原因导致的.再做一次销毁逻辑");
                BannerComp.checkCahceOrDestoryBanner(bannerAd, true);
                return;
            }
            tempThis._hasError = false;
            tempThis._loadSuccess = true;
            //重置errorcount
            tempThis._errorCount = 0;
            // 拉取不同的banner大小会不一样。要根据大小调整top left
            var offsetY = 0;
            if (tempThis._style && tempThis._style.offsetY) {
                offsetY = tempThis._style.offsetY;
            }
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_PULLSUCCESS);
            if (UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame()) {
                bannerAd.style.left = (w - bannerAd.style.realWidth) / 2;
                bannerAd.style.top = h - bannerAd.style.realHeight + offsetY;
            }
            else if (UserInfo_1.default.isTT()) {
                // bannerAd.style.left = (w - bannerAd.style.width) / 2;
                // bannerAd.style.top = h  + offsetY;
                // LogsManager.echo("_onLoadBack",w,h, bannerAd.style.width,bannerAd.style.height,"left:",(w - bannerAd.style.width) / 2,"top",h - (bannerAd.style.width / 16 * 9) + offsetY)
            }
            else if (UserInfo_1.default.isBaidu()) {
                bannerAd.style.left = (w - bannerAd.style.width) / 2;
                bannerAd.style.top = h - bannerAd.style.height + offsetY;
            }
            else if (UserInfo_1.default.isOppo()) {
                bannerAd.style.left = (w - bannerAd.style.width) / 2;
                bannerAd.style.top = h - bannerAd.style.height + offsetY;
            }
            this._checkUIState(true);
        };
        var onResizeBack = (size) => {
            LogsManager_1.default.echo("hlx bannerAd.onResize:", size.width, size.height);
            // 如果一开始设置的 banner 宽度超过了系统限制，可以在此处加以调整
            // 头条存在width=0情况，需要做特殊判断
            if (size.width != 0) {
                var offsetY = 0;
                if (tempThis._style && tempThis._style.offsetY) {
                    offsetY = tempThis._style.offsetY;
                }
                bannerAd.style.left = Math.floor((w - size.width) / 2);
                bannerAd.style.top = Math.floor(h - size.height + offsetY);
            }
        };
        if (this._bannerAd) {
            this._isShowBanner = false;
            this._loadSuccess = false;
            this._bannerAd.__isDestoryed = false;
            bannerAd = this._bannerAd;
            //需要把这些回调存对象存起来 方便销毁
            BannerComp._bannerCallBackCache.push({ instance: this._bannerAd, onLoad: onLoadBack, onError: onErrorBack, onResize: onResizeBack });
            bannerAd.onError(onErrorBack);
            // OPPO组件没有缩放
            if (UserInfo_1.default.isOppo()) {
                //OPPO渠道在show时才判断加载成功与失败
                this._loadSuccess = true;
                bannerAd.onShow(function () {
                    LogsManager_1.default.echo("hlx banner 广告显示");
                });
                bannerAd.onHide(function () {
                    BannerComp.bannerCloseCount++;
                    LogsManager_1.default.echo("hlx banner 广告隐藏");
                });
                this._checkUIState(true);
            }
            else if (UserInfo_1.default.isVivo()) {
                bannerAd.onLoad(onLoadBack);
                // bannerAd.onSize(onResizeBack);
            }
            else if (UserInfo_1.default.isUC()) {
                bannerAd.onLoad(onLoadBack);
            }
            else {
                bannerAd.onLoad(onLoadBack);
                bannerAd.onResize(onResizeBack);
            }
        }
        else {
            LogsManager_1.default.warn('hlx registerBanner error:ad not found');
        }
    }
    /**
     * 设置BannerTop
     */
    setTop() {
        var offsetY = 0;
        if (this._style && this._style.offsetY) {
            offsetY = this._style.offsetY;
        }
        var h = UserInfo_1.default.platform.getSystemInfo().windowHeight;
        if (UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame()) {
            this._bannerAd.style.top = h - this._bannerAd.style.realHeight + offsetY;
        }
        else if (UserInfo_1.default.isTT()) {
            // this._bannerAd.style.top = h - (this._bannerAd.style.width / 16 * 9) + offsetY;
        }
        else if (UserInfo_1.default.isBaidu()) {
            this._bannerAd.style.top = h - this._bannerAd.style.height + offsetY;
        }
        else if (UserInfo_1.default.isOppo()) {
            this._bannerAd.style.top = h - this._bannerAd.style.height + offsetY;
        }
        // TODO Oppo Vivo设置高度方法后续补充
    }
    _doBannerCallBack() {
        LogsManager_1.default.echo("hlx _doBannerCallBack _onErrorCallback");
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
    /**
     * banner是否可用
     */
    static canUseBanner() {
        if (!AdVideoManager_1.default.instance._isInitAdv)
            return false;
        if (UserInfo_1.default.isSystemNative()) {
            return true;
        }
        if (!BannerComp.bannerId && !UserInfo_1.default.isUC()) {
            LogsManager_1.default.warn("hlx bannerId 未配置，不初始化banner");
            return false;
        }
        if (!UserInfo_1.default.platform.getWX().createBannerAd) {
            LogsManager_1.default.echo("hlx createBannerAd 方法不存在，不初始化banner");
            return false;
        }
        if (UserInfo_1.default.isBaidu() && !BannerComp.appSid) {
            LogsManager_1.default.warn("hlx appSid 未配置，不初始化banner");
            return false;
        }
        if (UserInfo_1.default.isTT()) {
            LogsManager_1.default.echo("krma. UserInfo.platform.getSystemInfo().appName " + UserInfo_1.default.platform.getSystemInfo().appName);
            if (UserInfo_1.default.platform.getSystemInfo().appName == "Douyin" || UserInfo_1.default.platform.getSystemInfo().appName == "PPX") {
                LogsManager_1.default.echo("krma. 该渠道不支持banner", UserInfo_1.default.platform.getSystemInfo().appName);
                return false;
            }
        }
        if (UserInfo_1.default.isOppo()) {
            if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_OPPO_REVIEW) && BannerComp.bannerCloseCount >= 5) {
                LogsManager_1.default.echo("hlx banner 超过最大关闭上线 5，不在显示banner");
                return false;
            }
        }
        return true;
    }
    /**
     * 组件销毁
     */
    destroy(forceDestroy = false) {
        LogsManager_1.default.echo("hlx banner destroy:", GameUtils_1.default.decryptStr(this._parentName));
        this._status = TopViewAutoComp_1.TopViewAutoComp.STATUS_HIDE;
        this._parentName = null;
        this._onErrorCallback = null;
        this._callbackObj = null;
        if (UserInfo_1.default.isSystemNative()) {
            this._loadSuccess = false;
            this._hasError = false;
            this._isShowBanner = false;
            //隐藏banner
            NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.TTADSDK_BANNER, { status: 0 });
            this.reLoadBanner();
            return;
        }
        // if (this._bannerAd) {
        //     BannerComp.checkCahceOrDestoryBanner(this._bannerAd, this._hasError);
        //     this._bannerAd = null;
        // }
        if (UserInfo_1.default.isVivo() || forceDestroy) {
            if (this._bannerAd) {
                BannerComp._destroyBannerInstance(this._bannerAd);
                this._bannerAd = null;
            }
            this._loadSuccess = false;
            this._hasError = false;
            this._isShowBanner = false;
        }
        else {
            this.reLoadBanner();
        }
    }
    reLoadBanner(forceTry = false) {
        LogsManager_1.default.echo("hlx banner reLoad Banner,_leftUseCount", this._leftUseCount, "_loadSuccess", this._loadSuccess, "_hasError", this._hasError);
        if (UserInfo_1.default.isSystemNative()) {
            //预加载banner
            this.registerBanner(false);
            return;
        }
        //如果没有错误 而且这个banner使用次数大于0 那么不需要重新加载
        if ((!forceTry) && (!this._hasError)) {
            //如果剩余次数大于0 那么不需要重载了
            if (this._leftUseCount > 0) {
                this._leftUseCount--;
                this.hide(true);
                return;
            }
        }
        if (this._bannerAd) {
            this._bannerAd.hide();
        }
        //如果加载成功了 但是还没有显示过banner return
        if (this._loadSuccess && (!this._isShowBanner)) {
            LogsManager_1.default.echo(("xd banner 加载成功 但是还没有显示过 on reLoadBanner"));
            return;
        }
        if (this._loadSuccess || this._hasError) {
            LogsManager_1.default.echo("hlx banner reload, ad destory: _isShowBanner:", this._isShowBanner, " _hasError:", this._hasError);
            // 由于需要预加载所以要销毁重新拉取新的banner
            // if (typeof this._bannerAd.destroy == "function") {
            //     this._bannerAd.destroy();
            // }
            var hasError = this._hasError;
            this._hasError = false;
            BannerComp.checkCahceOrDestoryBanner(this._bannerAd, hasError);
            this._bannerAd = null;
            if (forceTry) {
                this.registerBanner(false);
            }
            else {
                this.registerBanner(hasError);
            }
        }
    }
    /**
     * 子类重写show方法。不管force都继续changeStatus
     */
    show(force = false) {
        if (UserInfo_1.default.isSystemNative()) {
            if (this._loadState == 0) {
                this.reLoadBanner();
            }
            this._status = TopViewAutoComp_1.TopViewAutoComp.STATUS_SHOW;
            var offsetY = 0;
            if (this._style && this._style.offsetY) {
                offsetY = this._style.offsetY;
            }
            NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.TTADSDK_BANNER, { status: 1, x: 0, y: ScreenAdapterTools_1.default.height - BannerComp.bannerHeight + offsetY });
            return;
        }
        //如果是换界面了那么需要重新加载一次
        if (this._lastParentName != this._parentName) {
            //必须是加载成功过才重载banner. 否则没必要反复加载
            if (this._loadSuccess) {
                this.reLoadBanner();
            }
            // 赋值最后展示的页面
            this._lastParentName = this._parentName;
        }
        // 页面相同：重复是显示状态的。无需额外处理
        if (!force && this._status == TopViewAutoComp_1.TopViewAutoComp.STATUS_SHOW) {
            return;
        }
        this._status = TopViewAutoComp_1.TopViewAutoComp.STATUS_SHOW;
        this._changeStatus();
    }
    /**
     * 显示隐藏组件
     */
    hide(force = false) {
        if (UserInfo_1.default.isSystemNative()) {
            this._status = TopViewAutoComp_1.TopViewAutoComp.STATUS_HIDE;
            //隐藏banner
            NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.TTADSDK_BANNER, { status: 0 });
            return;
        }
        super.hide(force);
    }
    /** 子类重写组件显示方法 */
    _compShow() {
        LogsManager_1.default.echo("hlx banner _compShow", Laya.timer.currTimer);
        if (!this._bannerAd) {
            // 如果不存在实例或者已经展示过一次
            // 重新加载新的banner
            var hasError = this._hasError;
            this._hasError = false;
            this.registerBanner(hasError);
        }
        if (this._hasError) {
            LogsManager_1.default.echo("hlx banner _compShow：banner加载存在error直接执行失败回调");
            this._doBannerCallBack();
            return;
        }
        var thisObj = this;
        if (this._bannerAd && this._loadSuccess) {
            this._isShowBanner = true;
            // 显示前修改位置及大小
            this.channgeStyle();
            LogsManager_1.default.echo("hlx banner show", Laya.timer.currTimer);
            var promise = this._bannerAd.show();
            if (typeof promise === 'object' && promise.then) {
                var tempBanner = this._bannerAd;
                var sureHide = () => {
                    if (typeof tempBanner.hide == "function") {
                        try {
                            tempBanner.hide();
                        }
                        catch (e) {
                            LogsManager_1.default.errorTag("bannererror", "bannerHideError", e);
                        }
                    }
                };
                promise.then(() => {
                    LogsManager_1.default.echo("hlx banner广告组件show success", Laya.timer.currTimer);
                    if (UserInfo_1.default.isQQGame() && thisObj._status == TopViewAutoComp_1.TopViewAutoComp.STATUS_HIDE) {
                        // thisObj.hide(true)
                        sureHide();
                        //为了安全起见.这里延迟一帧以后再重复隐藏1次 刚复现sureHide也无法隐藏的情况
                        TimerManager_1.default.instance.setTimeout(sureHide, thisObj, 10);
                        LogsManager_1.default.errorTag("bannererror", "在banner显示的过程中又关掉banner了,这里需要再强制hide");
                    }
                })
                    .catch(err => {
                    LogsManager_1.default.echo("hlx banner广告组件show error", err);
                    this._doBannerCallBack();
                });
            }
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_EXPOSURENUM);
        }
        else {
            LogsManager_1.default.echo("hlx banner comp show 没有达到条件：loadSuccess ", this._loadSuccess);
        }
    }
    /**
    * 修改banner样式
    */
    channgeStyle() {
        if (this._style) {
            // QQ 微信自定义尺寸
            if (UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame()) {
                LogsManager_1.default.echo('hlx banner comp changeStyle:', JSON.stringify(this._style));
                // 缩放和定宽互斥
                if (this._style.retio) {
                    this._bannerAd.style.width = UserInfo_1.default.platform.getSystemInfo().windowWidth * this._style.retio;
                }
                else if (this._style.width) {
                    this._bannerAd.style.width = this._style.width;
                }
            }
        }
        // 设置banner高度
        this.setTop();
    }
    /** 子类重写组件隐藏方法 */
    _compHide() {
        this._status = TopViewAutoComp_1.TopViewAutoComp.STATUS_HIDE;
        this._parentName = null;
        this._onErrorCallback = null;
        this._callbackObj = null;
        if (this._hasError) {
            // 如果有错误，就销毁或者缓存重新加载banner
            BannerComp.checkCahceOrDestoryBanner(this._bannerAd, this._hasError);
            // if (typeof this._bannerAd.destroy == "function") {
            //     this._bannerAd.destroy();
            // }
            this._bannerAd = null;
            this.registerBanner();
        }
        else if (this._bannerAd && this._isShowBanner) {
            // 如果没有错误就隐藏banner
            this._isShowBanner = false;
            this._bannerAd.hide();
        }
    }
    /**重写_checkUIState 是因为现在缓存机制变了 */
    _checkUIState(force = false) {
        var targetWindowName = WindowManager_1.default.getCurrentWindowName();
        //如果一个ui都没有 不需要执行
        if (!targetWindowName) {
            return;
        }
        //如果当前的window和我是同一个 那么不需要更换数据
        if (targetWindowName == this._parentName) {
            this.show(force);
        }
        else {
            //如果没有这个界面的banner数据 说明需要hide
            if (!BannerComp._cacheInfo[targetWindowName]) {
                //如果当前不是隐藏状态 我才会去destory 并缓存
                if (this._status != TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_HIDE) {
                    if (this._hideType == TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY) {
                        this.destroy();
                    }
                    else {
                        this.hide(force);
                    }
                }
                else {
                    this.hide(force);
                }
            }
            else {
                if (UserInfo_1.default.isSystemMini()) {
                    //如果上一个界面是销毁型的.那么表示需要重载一次
                    if (this._hideType == TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_DESTROY) {
                        //比如是广告加载成功了或者error了 我才会reloadbanner
                        //必须当前parent存在的时候 我才需要reload.否则因为缓存会导致死循环
                        if (this._parentName && (this._loadSuccess || this._hasError)) {
                            this.reLoadBanner();
                        }
                    }
                }
                //否则刷新banner数据
                this.updateDataByName(targetWindowName);
                //切换界面必须强制显示
                this.show(true);
            }
        }
    }
    //处理banner相关事件 参数: status: 1banner显示成功 2banner加载失败,   3banner渲染失败  4banner渲染成功.可以理解为曝光   11.点击banner 
    handleNativeBannerBack(data) {
        var status = data.status;
        if (status == 1) {
            this._loadSuccess = true;
            this._loadState = 2;
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_PULLSUCCESS);
        }
        else if (status == 2) {
            this._loadSuccess = false;
            this._loadState = 3;
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_PULLFAILED);
        }
        else if (status == 3) {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_PULLFAILED);
            this._loadState = 3;
        }
        else if (status == 4) {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.BANNER_EXPOSURENUM);
        }
        else if (status == 11) {
            LogsManager_1.default.echo("banner xd handleNativeBannerBack 点击banner");
        }
    }
    //接受信息
    recvMsg(event, data) {
        super.recvMsg(event, data);
        if (event == NativeToJSEvent_1.default.TTSDK_BANNER_EVENT) {
            this.handleNativeBannerBack(data);
        }
    }
    //判断销毁或者缓存一个bannerinstance
    static checkCahceOrDestoryBanner(bannerInstance, hasError) {
        if (!bannerInstance) {
            return;
        }
        if (!hasError && this._cacheBannerArr.length < this.cacheBannerNums && !bannerInstance.__isDestoryed) {
            this._cacheBannerArr.push(bannerInstance);
            LogsManager_1.default.echo("xd banner _缓存一个banner");
            bannerInstance.hide();
        }
        else {
            this._destroyBannerInstance(bannerInstance);
        }
    }
    //销毁banner实例
    static _destroyBannerInstance(bannerInstance) {
        LogsManager_1.default.echo("销毁一个banner---");
        this._offBannerCallBack(bannerInstance);
        if (bannerInstance.__isDestoryed) {
            LogsManager_1.default.warn("这个banner已经执行过销毁了 为什么会重复执行--");
            return;
        }
        if (typeof bannerInstance.destroy == "function") {
            bannerInstance.__isDestoryed = true;
            bannerInstance.destroy();
        }
    }
    //拿一个缓存的banner
    static getCacheBanner() {
        if (this._cacheBannerArr.length > 0) {
            var bannerAd = this._cacheBannerArr[0];
            this._cacheBannerArr.splice(0, 1);
            return bannerAd;
        }
        return null;
    }
    //移除banner注册的回调
    static _offBannerCallBack(bannerInstance) {
        for (var i = this._bannerCallBackCache.length - 1; i >= 0; i--) {
            var info = this._bannerCallBackCache[i];
            if (info.instance == bannerInstance) {
                if (typeof bannerInstance.offResize == "function") {
                    bannerInstance.offResize(info.onResize);
                }
                if (typeof bannerInstance.offLoad == "function") {
                    bannerInstance.offLoad(info.onLoad);
                }
                if (typeof bannerInstance.offError == "function") {
                    bannerInstance.offError(info.onError);
                }
                //移除这个数组
                LogsManager_1.default.echo("xd banner _销毁banner注册的回调");
                this._bannerCallBackCache.splice(i, 1);
            }
        }
    }
    //取消一个界面banner展示 
    static cancleOneView(viewName) {
        //如果当前的name = viewname
        if (!this._instance) {
            return;
        }
        if (!viewName) {
            return;
        }
        //销毁这个view对应的name
        delete BannerComp._cacheInfo[viewName];
        //如果当前的ui就是自己,那么销毁
        if (this._instance._parentName == viewName) {
            this._instance.destroy();
        }
    }
}
exports.BannerComp = BannerComp;
//默认banner高度 200像素 . 相对于640*1136 设计分辨率
BannerComp.bannerHeight = 200;
//缓存的banner数量 默认为0 根据平台走 
//平台对应的缓存banner实例对象数量 目前微信可以缓存1个 其他平台不缓存
//如果是卡日曲 那么banner缓存数量为0
BannerComp.platformToCacheBannerNumsMap = {
    wxgame: 1,
};
//尝试加载次数 默认加载2次
BannerComp.TRY_LOAD_COUNT = 0;
//缓存堆里面拿的广告 使用次数为5
BannerComp.BANNER_USE_COUNT = 5;
//缓存的banner信息
/**
 * {
 *  windowName:{status:状态 ,params:createBanner传进来的参数, }
 * }
 *
 */
BannerComp._cacheInfo = {};
//缓存第三方实例的banner组件
BannerComp._cacheBannerArr = [];
/**
     * 最后广告创建时间（Vivo时间间隔不得小于10 秒）
     */
BannerComp.lastCreateBannerTime = 0;
/**
 * Banner关闭计数：用于oppo审核模式
 */
BannerComp.bannerCloseCount = 0;
//banner注册的回调缓存  [{instane:banner,onLoad,onError } ]
BannerComp._bannerCallBackCache = [];
//# sourceMappingURL=BannerComp.js.map