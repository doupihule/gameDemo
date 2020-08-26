"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OriginalInterstitialAdComp_1 = require("./comp/OriginalInterstitialAdComp");
const ButtonUtils_1 = require("./../utils/ButtonUtils");
const UserInfo_1 = require("../common/UserInfo");
const LogsManager_1 = require("../manager/LogsManager");
const GameSwitch_1 = require("../common/GameSwitch");
const InterstitialAdComp_1 = require("./comp/InterstitialAdComp");
const RecommendationInterstitialComp_1 = require("./comp/RecommendationInterstitialComp");
const BannerAdManager_1 = require("../manager/BannerAdManager");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
const GameUtils_1 = require("../../utils/GameUtils");
const SceneReference_1 = require("../consts/SceneReference");
const OriginalIconAdComp_1 = require("./comp/OriginalIconAdComp");
const TimerManager_1 = require("../manager/TimerManager");
const CountsCommonModel_1 = require("../model/CountsCommonModel");
const CountsCommonServer_1 = require("../server/CountsCommonServer");
const Client_1 = require("../common/kakura/Client");
const GlobalParamsFunc_1 = require("../../game/sys/func/GlobalParamsFunc");
const PlaqueFunc_1 = require("../func/PlaqueFunc");
class AdVideoManager {
    constructor() {
        /**
        * 头条插屏上次显示时间
        */
        this.ttInterstitialAdLastShowTime = Client_1.default.instance.miniserverTime;
        this._isInitAdv = true;
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new AdVideoManager();
        }
        return this._instance;
    }
    /**注册插屏广告 */
    registerInterstitialAd() {
        // 插屏广告
        InterstitialAdComp_1.InterstitialAdComp.register();
        // 插屏推荐
        RecommendationInterstitialComp_1.RecommendationInterstitialComp.register();
    }
    /**
     * 播放插屏广告
     * @param parent 所在页面
     * @param onErrorCallback 失败回调
     * @param callbackObj 失败obj
     */
    showInterstitialAd(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
        if (UserInfo_1.default.isWX()) {
            var quickBannerType = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_INTERSTITIAL_TYPE));
            switch (quickBannerType) {
                case BannerAdManager_1.default.QUICK_BANNER_TYPE_AD:
                    // 插屏广告
                    InterstitialAdComp_1.InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    break;
                case BannerAdManager_1.default.QUICK_BANNER_TYPE_AD_COMMEND:
                    // 插屏广告>推荐
                    InterstitialAdComp_1.InterstitialAdComp.create(parent, () => {
                        RecommendationInterstitialComp_1.RecommendationInterstitialComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    }, onCloseCallback, callbackObj);
                    break;
                case BannerAdManager_1.default.QUICK_BANNER_TYPE_COMMEND:
                    // 推荐
                    RecommendationInterstitialComp_1.RecommendationInterstitialComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    break;
                case BannerAdManager_1.default.QUICK_BANNER_TYPE_COMMEND_AD:
                    // 推荐>插屏广告
                    RecommendationInterstitialComp_1.RecommendationInterstitialComp.create(parent, () => {
                        InterstitialAdComp_1.InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    }, onCloseCallback, callbackObj);
                    break;
            }
        }
        else if (UserInfo_1.default.isVivo() || UserInfo_1.default.isOppo()) {
            var quickBannerType = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_INTERSTITIAL_OPPO_TYPE));
            switch (quickBannerType) {
                case AdVideoManager.InterstitialAd_NONE:
                    // 无广告
                    break;
                case AdVideoManager.InterstitialAd_TYPE_AD_ORIGINAL:
                    // 插屏广告>原生
                    InterstitialAdComp_1.InterstitialAdComp.create(parent, () => {
                        this.showOriginalAdView(onErrorCallback, callbackObj);
                    }, onCloseCallback, callbackObj);
                    break;
                case AdVideoManager.InterstitialAd_TYPE_AD:
                    // 插屏广告
                    InterstitialAdComp_1.InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    break;
                case AdVideoManager.InterstitialAd_TYPE_ORIGINAL_AD:
                    // 原生
                    this.showOriginalAdView(onErrorCallback, callbackObj);
                    break;
            }
        }
        else {
            InterstitialAdComp_1.InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
        }
    }
    /**
    * 根据Id显示插屏广告
    */
    showInterstitialAdById(id, parent, onErrorCallback = null, onCloseCallback = null, thisObj = null) {
        if (!InterstitialAdComp_1.InterstitialAdComp.canUse())
            return;
        var adInfo = PlaqueFunc_1.default.instance.getPlaqueInfoById(id);
        var possibility = 10000 * Math.random();
        LogsManager_1.default.echo("----possibility: " + possibility);
        if (possibility <= adInfo.plaqueProbab) {
            this.interstitialAdTimeId = TimerManager_1.default.instance.setTimeout(() => {
                this.showInterstitialAd(parent, onErrorCallback, onCloseCallback, thisObj);
            }, this, adInfo.plaqueLaterTime);
        }
    }
    /**
     * 插屏是否受限
     */
    isInterstitialLimit() {
        if (!(UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo() || UserInfo_1.default.isTT())) {
            return false;
        }
        if (UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo()) {
            // 插屏最小间隔
            var intervalTime = 0;
            if (Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.INTERVAL_TIME)) > 0) {
                intervalTime = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.INTERVAL_TIME));
            }
            else {
                var screenAdInterval = GlobalParamsFunc_1.default.instance.getCfgDatas("GlobalParams_json", "screenAdInterval", true);
                if (screenAdInterval && screenAdInterval.num) {
                    intervalTime = screenAdInterval.num;
                }
            }
            if (intervalTime > 0) {
                // 最后展示时间
                var lastShowTime = Number(CountsCommonModel_1.default.instance.getCountById(CountsCommonModel_1.default.TYPE_INTERVALAD_LASTSHOWTIME));
                var durT = Client_1.default.instance.miniserverTime - lastShowTime;
                if (durT <= intervalTime) {
                    LogsManager_1.default.echo("hlx InterstitialAd 插屏广告不显示：间隔小于", intervalTime, "间隔：", durT);
                    return true;
                }
            }
            // 插屏每日最大次数
            var maxTime = 0;
            if (Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.MAX_TIME)) > 0) {
                maxTime = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.MAX_TIME));
            }
            else {
                var screenAdMaxTimes = GlobalParamsFunc_1.default.instance.getCfgDatas("GlobalParams_json", "screenAdMaxTimes", true);
                if (screenAdMaxTimes && screenAdMaxTimes.num) {
                    maxTime = screenAdMaxTimes.num;
                }
            }
            if (maxTime > 0) {
                // 最大次数
                var interstitialCount = Number(CountsCommonModel_1.default.instance.getCountById(CountsCommonModel_1.default.TYPE_INTERVALAD_COUNT));
                if (interstitialCount >= maxTime) {
                    LogsManager_1.default.echo("hlx InterstitialAd 插屏广告不显示：当日次数用完", maxTime, "interstitialCount:", interstitialCount);
                    return true;
                }
            }
            return false;
        }
        if (UserInfo_1.default.isTT()) {
            var intervalTime = 35000;
            // 最后展示时间
            var lastShowTime = this.ttInterstitialAdLastShowTime;
            var durT = Client_1.default.instance.miniserverTime - lastShowTime;
            LogsManager_1.default.echo("whn------tt插屏显示时间--------", lastShowTime, durT);
            if (durT <= intervalTime) {
                LogsManager_1.default.echo("whn InterstitialAd 插屏广告不显示：间隔小于", intervalTime, "间隔：", durT);
                return true;
            }
            return false;
        }
    }
    /**
     * 更新插屏广告数据
     */
    updateInterstitialLimit() {
        if (!(UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo() || UserInfo_1.default.isTT())) {
            return;
        }
        if (UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo()) {
            // 更新当日插屏广告次数
            var interstitialCount = Number(CountsCommonModel_1.default.instance.getCountById(CountsCommonModel_1.default.TYPE_INTERVALAD_COUNT));
            CountsCommonServer_1.default.updateDayCounts(CountsCommonModel_1.default.TYPE_INTERVALAD_COUNT, interstitialCount + 1, false);
            // 更新插屏广告最后展示时间
            CountsCommonServer_1.default.updateDayCounts(CountsCommonModel_1.default.TYPE_INTERVALAD_LASTSHOWTIME, Client_1.default.instance.miniserverTime);
        }
        else {
            this.ttInterstitialAdLastShowTime = Client_1.default.instance.miniserverTime;
        }
    }
    /**
     * 移除延迟Id
     */
    removeDelayInterstitialAd() {
        TimerManager_1.default.instance.remove(this.interstitialAdTimeId);
        this.interstitialAdTimeId = null;
    }
    /**
      * 注册Icon原生广告
     */
    registerOrigionIconAdv(callBack = null, thisObj = null, params = {}) {
        OriginalIconAdComp_1.default.instance.registerOrigionAdv(callBack, thisObj, params);
    }
    /**
     * 注册插屏原生广告
     */
    registerOrigionInterstitialAdv(callBack = null, thisObj = null, params = {}) {
        OriginalInterstitialAdComp_1.OriginalInterstitialAdComp.instance.registerOrigionAdv(callBack, thisObj, params);
    }
    /**
     * 显示原生广告弹窗
     */
    showOriginalAdView(onErrorCallback = null, callbackObj = null, params = { pos: -79 }) {
        // if (this.isInterstitialLimit()) {
        //     LogsManager.echo("hlx 插屏原生广告受到次数，间隔限制，直接执行失败回调");
        //     onErrorCallback && onErrorCallback.call(callbackObj);
        //     return;
        // }
        OriginalInterstitialAdComp_1.OriginalInterstitialAdComp.instance.showOriginalAdView(onErrorCallback, callbackObj, params);
    }
    /**
     * 汇报点击
     */
    reportClickOriginal(type, id) {
        switch (type) {
            case AdVideoManager.TYPE_ORIGINAL_INTERSTITIAL:
                OriginalInterstitialAdComp_1.OriginalInterstitialAdComp.instance.reportClickOriginal(id);
                break;
            case AdVideoManager.TYPE_ORIGINAL_ICON:
                OriginalIconAdComp_1.default.instance.reportClickOriginal(id);
                break;
            default:
                LogsManager_1.default.errorTag('reportClickOriginal_type_error', type);
                break;
        }
    }
    /**
     * 汇报点击
     */
    reportShowOriginal(type, id) {
        switch (type) {
            case AdVideoManager.TYPE_ORIGINAL_INTERSTITIAL:
                OriginalInterstitialAdComp_1.OriginalInterstitialAdComp.instance.reportShowOriginal(id);
                break;
            case AdVideoManager.TYPE_ORIGINAL_ICON:
                OriginalIconAdComp_1.default.instance.reportShowOriginal(id);
                break;
            default:
                LogsManager_1.default.errorTag('reportShowOriginal_type_error', type);
                break;
        }
    }
    /**
     * 能否移位误触
     */
    canBtnMove() {
        if (!GameUtils_1.default.canQuickBanner) {
            LogsManager_1.default.echo("ycn MoveButtonOnClick 无banner");
            return false;
        }
        if (!UserInfo_1.default.isWX()) {
            LogsManager_1.default.echo("ycn MoveButtonOnClick 非微信渠道");
            return false;
        }
        if (!GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_BTN_MOVE)) {
            LogsManager_1.default.echo("ycn MoveButtonOnClick 开关未开启");
            return false;
        }
        if (!SceneReference_1.default.isInBannerScene()) {
            LogsManager_1.default.echo("ycn MoveButtonOnClick sceneBlack");
            return false;
        }
        return true;
    }
    /**
     * 移位误触
     * 如果移位误触组件所在页面有缓存，则必须在show中对组件位置进行手动初始化
     * @param btnObj 按钮对象
     * @param btnCallBack 按钮正常回调
     * @param viewObj 按钮界面对象
     * @param moveX 向右移动距离
     * @param moveY 向下移动距离
     */
    bindBtnMove(btnObj, btnCallBack, viewObj, moveX = 0, moveY = 170) {
        if (!btnObj['clickMoveInit']) {
            btnObj['clickMoveInit'] = true;
            btnObj['targetClickNum'] = GameUtils_1.default.getRandomInt(2, 3);
            btnObj['currentClickNum'] = 0;
            ScreenAdapterTools_1.default.offsetView(btnObj, moveX, moveY);
            return new ButtonUtils_1.ButtonUtils(btnObj, () => {
                btnObj['currentClickNum'] = (btnObj['currentClickNum'] || 0) + 1;
                if (btnObj['currentClickNum'] < btnObj['targetClickNum']) {
                    return;
                }
                else if (btnObj['currentClickNum'] == btnObj['targetClickNum']) {
                    ScreenAdapterTools_1.default.offsetView(btnObj, -moveX, -moveY);
                    btnObj['clickMoveInit'] = false;
                    BannerAdManager_1.default.addBannerQuick(viewObj);
                }
                else {
                    btnCallBack.call(viewObj);
                }
            }, viewObj);
        }
    }
}
exports.default = AdVideoManager;
/***************** 插屏类型*******************/
/** 插屏类型：无 */
AdVideoManager.InterstitialAd_NONE = 1;
/** 插屏类型：插屏 > 原生*/
AdVideoManager.InterstitialAd_TYPE_AD_ORIGINAL = 2;
/** 插屏类型：原生 > 插屏 */
AdVideoManager.InterstitialAd_TYPE_ORIGINAL_AD = 3;
/** 插屏类型：插屏 */
AdVideoManager.InterstitialAd_TYPE_AD = 4;
/** 插屏类型：原生 */
AdVideoManager.InterstitialAd_TYPE_ORIGINAL = 5;
/**
 * 原生广告类型：插屏
 */
AdVideoManager.TYPE_ORIGINAL_INTERSTITIAL = 'INTERSTITIAL';
/**
 * 原生广告类型：icon
 */
AdVideoManager.TYPE_ORIGINAL_ICON = 'ICON';
//# sourceMappingURL=AdVideoManager.js.map