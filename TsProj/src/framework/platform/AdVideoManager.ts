import { OriginalInterstitialAdComp } from './comp/OriginalInterstitialAdComp';
import { ButtonUtils } from './../utils/ButtonUtils';
import UserInfo from "../common/UserInfo";
import LogsManager from "../manager/LogsManager";
import GameSwitch from "../common/GameSwitch";
import ChannelConst from "../../game/sys/consts/ChannelConst";
import {InterstitialAdComp} from "./comp/InterstitialAdComp";
import {RecommendationInterstitialComp} from "./comp/RecommendationInterstitialComp";
import BannerAdManager from "../manager/BannerAdManager";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import GameUtils from "../../utils/GameUtils";
import SceneReference from '../consts/SceneReference';
import OriginalIconAdComp from './comp/OriginalIconAdComp';
import TimerManager from '../manager/TimerManager';
import CountsCommonModel from '../model/CountsCommonModel';
import CountsCommonServer from '../server/CountsCommonServer';
import Client from '../common/kakura/Client';
import GlobalParamsFunc from '../../game/sys/func/GlobalParamsFunc';
import PlaqueFunc from '../func/PlaqueFunc';

export default class AdVideoManager {

	 /***************** 插屏类型*******************/
        /** 插屏类型：无 */
        static InterstitialAd_NONE = 1;
        /** 插屏类型：插屏 > 原生*/
        static InterstitialAd_TYPE_AD_ORIGINAL = 2;
        /** 插屏类型：原生 > 插屏 */
        static InterstitialAd_TYPE_ORIGINAL_AD = 3;
        /** 插屏类型：插屏 */
        static InterstitialAd_TYPE_AD = 4;
        /** 插屏类型：原生 */
        static InterstitialAd_TYPE_ORIGINAL = 5;
        /**
         * 原生广告类型：插屏
         */
        static TYPE_ORIGINAL_INTERSTITIAL = 'INTERSTITIAL';
        /**
         * 原生广告类型：icon
         */
        static TYPE_ORIGINAL_ICON = 'ICON';

    /**
    * 头条插屏上次显示时间
    */
    public ttInterstitialAdLastShowTime = Client.instance.miniserverTime;

    public _isInitAdv: boolean = true;
        private interstitialAdTimeId; // 插屏广告时延id
    private static _instance: AdVideoManager;

    static get instance(): AdVideoManager {
        if (!this._instance) {
            this._instance = new AdVideoManager();
        }
        return this._instance;
    }


    /**注册插屏广告 */
    registerInterstitialAd() {
        // 插屏广告
        InterstitialAdComp.register();
        // 插屏推荐
        RecommendationInterstitialComp.register();
    }
    /**
     * 播放插屏广告
     * @param parent 所在页面
     * @param onErrorCallback 失败回调
     * @param callbackObj 失败obj
     */
    showInterstitialAd(parent, onErrorCallback: any = null, onCloseCallback: any = null, callbackObj: any = null) {
        if (UserInfo.isWX()) {
            var quickBannerType = Number(GameSwitch.getSwitchState(GameSwitch.SWITCH_INTERSTITIAL_TYPE));
            switch (quickBannerType) {
                case BannerAdManager.QUICK_BANNER_TYPE_AD:
                    // 插屏广告
                    InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    break;
                case BannerAdManager.QUICK_BANNER_TYPE_AD_COMMEND:
                    // 插屏广告>推荐
                    InterstitialAdComp.create(parent, () => {
                        RecommendationInterstitialComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    }, onCloseCallback, callbackObj);
                    break;
                case BannerAdManager.QUICK_BANNER_TYPE_COMMEND:
                    // 推荐
                    RecommendationInterstitialComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    break;
                case BannerAdManager.QUICK_BANNER_TYPE_COMMEND_AD:
                    // 推荐>插屏广告
                    RecommendationInterstitialComp.create(parent, () => {
                        InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    }, onCloseCallback, callbackObj);
                    break;
            }
        }
        else if (UserInfo.isVivo() || UserInfo.isOppo()) {
            var quickBannerType = Number(GameSwitch.getSwitchState(GameSwitch.SWITCH_INTERSTITIAL_OPPO_TYPE));
            switch (quickBannerType) {
                case AdVideoManager.InterstitialAd_NONE:
                    // 无广告
                    break;
                case AdVideoManager.InterstitialAd_TYPE_AD_ORIGINAL:
                    // 插屏广告>原生
                    InterstitialAdComp.create(parent, () => {
                        this.showOriginalAdView(onErrorCallback, callbackObj);
                    }, onCloseCallback, callbackObj);
                    break;
                case AdVideoManager.InterstitialAd_TYPE_AD:
                    // 插屏广告
                    InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
                    break;
                case AdVideoManager.InterstitialAd_TYPE_ORIGINAL_AD:
                    // 原生
                    this.showOriginalAdView(onErrorCallback, callbackObj);
                    break;
            }
        } else {
            InterstitialAdComp.create(parent, onErrorCallback, onCloseCallback, callbackObj);
        }
    }
    /**
    * 根据Id显示插屏广告
    */
    showInterstitialAdById(id, parent, onErrorCallback = null, onCloseCallback = null, thisObj = null) {
        if (!InterstitialAdComp.canUse()) return;
        var adInfo = PlaqueFunc.instance.getPlaqueInfoById(id);
        var possibility = 10000 * Math.random();
        LogsManager.echo("----possibility: " + possibility);
        if (possibility <= adInfo.plaqueProbab) {
            this.interstitialAdTimeId = TimerManager.instance.setTimeout(() => {
                this.showInterstitialAd(parent, onErrorCallback, onCloseCallback, thisObj);
            }, this, adInfo.plaqueLaterTime);
        }
    }

    /**
     * 插屏是否受限
     */
    isInterstitialLimit() {
        if (!(UserInfo.isOppo() || UserInfo.isVivo() || UserInfo.isTT())) {
            return false;
        }
        if (UserInfo.isOppo() || UserInfo.isVivo()) {
            // 插屏最小间隔
            var intervalTime = 0
            if (Number(GameSwitch.getSwitchState(GameSwitch.INTERVAL_TIME)) > 0) {
                intervalTime = Number(GameSwitch.getSwitchState(GameSwitch.INTERVAL_TIME))
            } else {
                var screenAdInterval = GlobalParamsFunc.instance.getCfgDatas("GlobalParams_json", "screenAdInterval", true);
                if (screenAdInterval && screenAdInterval.num) {
                    intervalTime = screenAdInterval.num;
                }
            }
            if (intervalTime > 0) {
                // 最后展示时间
                var lastShowTime = Number(CountsCommonModel.instance.getCountById(CountsCommonModel.TYPE_INTERVALAD_LASTSHOWTIME));
                var durT = Client.instance.miniserverTime - lastShowTime
                if (durT <= intervalTime) {
                    LogsManager.echo("hlx InterstitialAd 插屏广告不显示：间隔小于", intervalTime, "间隔：", durT);
                    return true;
                }
            }

            // 插屏每日最大次数
            var maxTime = 0;
            if (Number(GameSwitch.getSwitchState(GameSwitch.MAX_TIME)) > 0) {
                maxTime = Number(GameSwitch.getSwitchState(GameSwitch.MAX_TIME))
            } else {
                var screenAdMaxTimes = GlobalParamsFunc.instance.getCfgDatas("GlobalParams_json", "screenAdMaxTimes", true);
                if (screenAdMaxTimes && screenAdMaxTimes.num) {
                    maxTime = screenAdMaxTimes.num;
                }
            }

            if (maxTime > 0) {
                // 最大次数
                var interstitialCount = Number(CountsCommonModel.instance.getCountById(CountsCommonModel.TYPE_INTERVALAD_COUNT));
                if (interstitialCount >= maxTime) {
                    LogsManager.echo("hlx InterstitialAd 插屏广告不显示：当日次数用完", maxTime, "interstitialCount:", interstitialCount);
                    return true;
                }
            }
            return false;

        }
        if (UserInfo.isTT()) {
            var intervalTime = 35000;
            // 最后展示时间
            var lastShowTime = this.ttInterstitialAdLastShowTime;
            var durT = Client.instance.miniserverTime - lastShowTime
            LogsManager.echo("whn------tt插屏显示时间--------", lastShowTime, durT);
            if (durT <= intervalTime) {
                LogsManager.echo("whn InterstitialAd 插屏广告不显示：间隔小于", intervalTime, "间隔：", durT);
                return true;
            }
            return false;
        }

    }

    /**
     * 更新插屏广告数据
     */
    updateInterstitialLimit() {
        if (!(UserInfo.isOppo() || UserInfo.isVivo() || UserInfo.isTT())) {
            return;
        }
        if (UserInfo.isOppo() || UserInfo.isVivo()) {
            // 更新当日插屏广告次数
            var interstitialCount = Number(CountsCommonModel.instance.getCountById(CountsCommonModel.TYPE_INTERVALAD_COUNT));
            CountsCommonServer.updateDayCounts(CountsCommonModel.TYPE_INTERVALAD_COUNT, interstitialCount + 1, false);
            // 更新插屏广告最后展示时间
            CountsCommonServer.updateDayCounts(CountsCommonModel.TYPE_INTERVALAD_LASTSHOWTIME, Client.instance.miniserverTime);
        } else {
            this.ttInterstitialAdLastShowTime = Client.instance.miniserverTime;
        }
    }

    /**
     * 移除延迟Id
     */
    removeDelayInterstitialAd() {
        TimerManager.instance.remove(this.interstitialAdTimeId);
        this.interstitialAdTimeId = null;
    }
	/**
      * 注册Icon原生广告
     */
    public registerOrigionIconAdv(callBack = null, thisObj = null, params = {}) {
        OriginalIconAdComp.instance.registerOrigionAdv(callBack, thisObj, params);
    }

    /**
     * 注册插屏原生广告
     */
    public registerOrigionInterstitialAdv(callBack = null, thisObj = null, params = {}) {
        OriginalInterstitialAdComp.instance.registerOrigionAdv(callBack, thisObj, params);
    }

    /**
     * 显示原生广告弹窗
     */
    public showOriginalAdView(onErrorCallback = null, callbackObj = null, params = { pos: -79 }) {
        // if (this.isInterstitialLimit()) {
        //     LogsManager.echo("hlx 插屏原生广告受到次数，间隔限制，直接执行失败回调");
        //     onErrorCallback && onErrorCallback.call(callbackObj);
        //     return;
        // }
        OriginalInterstitialAdComp.instance.showOriginalAdView(onErrorCallback, callbackObj, params);
    }

    /**
     * 汇报点击
     */
    public reportClickOriginal(type, id) {
        switch (type) {
            case AdVideoManager.TYPE_ORIGINAL_INTERSTITIAL:
                OriginalInterstitialAdComp.instance.reportClickOriginal(id);
                break;
            case AdVideoManager.TYPE_ORIGINAL_ICON:
                OriginalIconAdComp.instance.reportClickOriginal(id);
                break;
            default:
                LogsManager.errorTag('reportClickOriginal_type_error', type);
                break;
        }
    }

    /**
     * 汇报点击
     */
    public reportShowOriginal(type, id) {
        switch (type) {
            case AdVideoManager.TYPE_ORIGINAL_INTERSTITIAL:
                OriginalInterstitialAdComp.instance.reportShowOriginal(id);
                break;
            case AdVideoManager.TYPE_ORIGINAL_ICON:
                OriginalIconAdComp.instance.reportShowOriginal(id);
                break;
            default:
                LogsManager.errorTag('reportShowOriginal_type_error', type);
                break;
        }
    }

    /**
     * 能否移位误触
     */
    public canBtnMove() {
        if (!GameUtils.canQuickBanner) {
            LogsManager.echo("ycn MoveButtonOnClick 无banner");
            return false;
        }

        if (!UserInfo.isWX()) {
            LogsManager.echo("ycn MoveButtonOnClick 非微信渠道");
            return false;
        }

        if (!GameSwitch.checkOnOff(GameSwitch.SWITCH_BTN_MOVE)) {
            LogsManager.echo("ycn MoveButtonOnClick 开关未开启");
            return false;
        }

        if (!SceneReference.isInBannerScene()) {
            LogsManager.echo("ycn MoveButtonOnClick sceneBlack");
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
    public bindBtnMove(btnObj, btnCallBack, viewObj, moveX = 0, moveY = 170) {
        if (!btnObj['clickMoveInit']) {
            btnObj['clickMoveInit'] = true;
            btnObj['targetClickNum'] = GameUtils.getRandomInt(2, 3);
            btnObj['currentClickNum'] = 0;
            ScreenAdapterTools.offsetView(btnObj, moveX, moveY);

            return new ButtonUtils(btnObj, () => {
                btnObj['currentClickNum'] = (btnObj['currentClickNum'] || 0) + 1;
                if (btnObj['currentClickNum'] < btnObj['targetClickNum']) {
                    return;
                } else if (btnObj['currentClickNum'] == btnObj['targetClickNum']) {
                    ScreenAdapterTools.offsetView(btnObj, -moveX, -moveY);
                    btnObj['clickMoveInit'] = false;
                    BannerAdManager.addBannerQuick(viewObj);
                } else {
                    btnCallBack.call(viewObj);
                }
            }, viewObj);
        }
    }





}