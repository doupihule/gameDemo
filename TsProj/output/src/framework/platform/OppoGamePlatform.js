"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WXGamePlatform_1 = require("./WXGamePlatform");
const AdVideoManager_1 = require("./AdVideoManager");
const LogsManager_1 = require("../manager/LogsManager");
const GameSwitch_1 = require("../common/GameSwitch");
const WindowManager_1 = require("../manager/WindowManager");
const Message_1 = require("../common/Message");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const StatisticsCommonConst_1 = require("../consts/StatisticsCommonConst");
const BannerAdManager_1 = require("../manager/BannerAdManager");
class OppoGamePlatform extends WXGamePlatform_1.default {
    constructor() {
        super();
        OppoGamePlatform.instance = this;
        AdVideoManager_1.default.instance._isInitAdv = false;
    }
    getWX() {
        return window['qg'];
    }
    /*
    OPPO设置进度条（必须接入）
     */
    setLoadingProgress(num) {
        this.getWX().setLoadingProgress({
            progress: num
        });
    }
    hideLoadingProgress() {
        this.getWX().loadingComplete({
            complete: function (res) { }
        });
    }
    loadingComplete() {
        this.getWX().loadingComplete({});
    }
    //初始化平台数据
    initPlatformData() {
        LogsManager_1.default.echo("初始化Oppo平台--------------------");
        var wx = this.getWX();
        if (!wx.initAdService) {
            LogsManager_1.default.warn("noAdService:", "无法初始化视频组件");
            return;
        }
        var thisObj = this;
        wx.initAdService({
            appId: this.appId,
            isDebug: false,
            success: function (res) {
                console.log("success");
                AdVideoManager_1.default.instance._isInitAdv = true;
                // 为了性能第一个不用预加载
                // AdVideoManager.instance.registerInterstitialAd();
                // AdVideoManager.instance.registerBanner();
                BannerAdManager_1.default.registerBanner();
                //AdVideoManager.instance.registerOrigionAdv();
                thisObj.registerAd();
            },
            fail: function (res) {
                console.log("fail:" + res.code + res.msg);
            },
            complete: function (res) {
                console.log("complete");
            }
        });
    }
    loadVideoAd() {
        if (!this._videoAd) {
            this.registerAd();
        }
        else {
            this._videoAd.load();
        }
    }
    /**注册广告事件 */
    registerAd() {
        this.loadAdvFailed = false;
        if (!AdVideoManager_1.default.instance._isInitAdv)
            return;
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ADV))
            return;
        if (this._videoAd)
            return;
        var thisObj = this;
        //判断是否有广告,如果没有广告
        if (!this.getWX().createRewardedVideoAd) {
            this.loadAdvFailed = true;
            LogsManager_1.default.echo(null, "这个设备没有广告组件");
            return;
        }
        if (!this._videoId)
            return;
        this._videoAd = this.getWX().createRewardedVideoAd({ posId: this._videoId });
        if (this._videoAd) {
            var videoAd = this._videoAd;
            LogsManager_1.default.echo("zm registerAd this._videoAd", this._videoAd);
            videoAd.onError((err) => {
                thisObj.loadAdvFailed = true;
                WindowManager_1.default.closeAdvMask();
                LogsManager_1.default.echo("videoAd.onError:", err.toString());
                if (thisObj._videoLoaded) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD_FAIL);
                    thisObj._doVedioCallBack(false);
                }
            });
            videoAd.onLoad((res) => {
                thisObj.loadAdvFailed = false;
                LogsManager_1.default.echo("videoAd.onLoad:", JSON.stringify(res));
                // if (!res) {
                //     this.videoFailed = true;
                // }
            });
            videoAd.onClose(res => {
                Message_1.default.instance.send(MsgCMD_1.default.VIDEO_PLAY, res && res.isEnded);
                WindowManager_1.default.closeAdvMask();
                if (res && res.isEnded) {
                    // 给予奖励
                    LogsManager_1.default.echo("hlx show wx video suc");
                    thisObj.onVideoComplete(true);
                }
                else {
                    LogsManager_1.default.echo("hlx show wx video fail");
                    // VO不弹模态
                    thisObj.onVideoComplete(false);
                }
                // 视频完成预加载下一次视频
                thisObj.loadVideoAd();
            });
            videoAd.load();
        }
        else {
            this.loadAdvFailed = true;
        }
    }
    /**
    * 调用微信视频广告
    * @param callback
    * @param thisObj
    * @returns 返回装状态res，0没看完，1看完，-1没广告
    */
    showVideoAd(successCallBack, thisObj) {
        // 点击观看视频打点
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD);
        this.isPlayVideo = false;
        if (!AdVideoManager_1.default.instance._isInitAdv)
            return;
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ADV))
            return;
        this._videoSucCallback = successCallBack;
        this._videoThisObj = thisObj;
        WindowManager_1.default.openAdvMask();
        if (!this._videoId) {
            WindowManager_1.default.closeAdvMask();
            this._doVedioCallBack(false);
            return;
        }
        if (!this._videoAd) {
            this.registerAd();
        }
        if (!this._videoAd) {
            WindowManager_1.default.closeAdvMask();
            LogsManager_1.default.echo("yrc 没有广告实例，直接执行成功回调");
            this._doVedioCallBack(false);
            return;
        }
        var videoAd = this._videoAd;
        videoAd.show();
    }
}
exports.default = OppoGamePlatform;
//# sourceMappingURL=OppoGamePlatform.js.map