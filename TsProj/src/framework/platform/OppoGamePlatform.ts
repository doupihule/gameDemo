import WXGamePlatform from "./WXGamePlatform";
import AdVideoManager from "./AdVideoManager";
import LogsManager from "../manager/LogsManager";
import GameSwitch from "../common/GameSwitch";
import WindowManager from "../manager/WindowManager";
import Message from "../common/Message";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import TimerManager from "../manager/TimerManager";
import UtilsServer from "../../game/sys/server/UtilsServer";
import MsgCMD from "../../game/sys/common/MsgCMD";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";
import BannerAdManager from "../manager/BannerAdManager";
import KariquShareConst from "../consts/KariquShareConst";
import KariqiShareManager from "../manager/KariqiShareManager";

export default class OppoGamePlatform extends WXGamePlatform {

    public static instance: OppoGamePlatform;
    public constructor() {
        super();
        OppoGamePlatform.instance = this;
        AdVideoManager.instance._isInitAdv = false;
    }

    public getWX(): any {
        return window['qg'];
    }
    /*
    OPPO设置进度条（必须接入）
     */
    public setLoadingProgress(num) {
        this.getWX().setLoadingProgress({
            progress: num
        })
    }
    hideLoadingProgress() {
        this.getWX().loadingComplete({
            complete: function (res) { }
        });
    }
    public loadingComplete() {
        this.getWX().loadingComplete({});
    }
    //初始化平台数据
    initPlatformData() {
        LogsManager.echo("初始化Oppo平台--------------------")
        var wx = this.getWX()
        if (!wx.initAdService) {
            LogsManager.warn("noAdService:", "无法初始化视频组件")
            return;
        }
        var thisObj = this;
        wx.initAdService({
            appId: this.appId,
            isDebug: false,
            success: function (res) {
                console.log("success");
                AdVideoManager.instance._isInitAdv = true;
                // 为了性能第一个不用预加载
                // AdVideoManager.instance.registerInterstitialAd();
                // AdVideoManager.instance.registerBanner();
                BannerAdManager.registerBanner();
                //AdVideoManager.instance.registerOrigionAdv();
                thisObj.registerAd();
            },
            fail: function (res) {
                console.log("fail:" + res.code + res.msg);
            },
            complete: function (res) {
                console.log("complete");
            }
        })
    }

    loadVideoAd() {
        if (!this._videoAd) {
            this.registerAd();
        } else {
            this._videoAd.load()
        }
    }
    /**注册广告事件 */
    registerAd() {
        this.loadAdvFailed = false;
        if (!AdVideoManager.instance._isInitAdv) return;
        if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ADV)) return;
        if (this._videoAd) return;
        var thisObj = this;
        //判断是否有广告,如果没有广告
        if (!this.getWX().createRewardedVideoAd) {
            this.loadAdvFailed = true;
            LogsManager.echo(null, "这个设备没有广告组件")
            return;
        }
        if (!this._videoId) return;
        this._videoAd = this.getWX().createRewardedVideoAd({ posId: this._videoId });
        if (this._videoAd) {
            var videoAd = this._videoAd;
            LogsManager.echo("zm registerAd this._videoAd", this._videoAd);
            videoAd.onError((err) => {
                thisObj.loadAdvFailed = true;
                WindowManager.closeAdvMask();
                LogsManager.echo("videoAd.onError:", err.toString());
                if (thisObj._videoLoaded) {
                    StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD_FAIL);
                    thisObj._doVedioCallBack(false);
                }


            })
            videoAd.onLoad((res) => {
                thisObj.loadAdvFailed = false;
                LogsManager.echo("videoAd.onLoad:", JSON.stringify(res));
                // if (!res) {
                //     this.videoFailed = true;
                // }
            })
            videoAd.onClose(res => {
                Message.instance.send(MsgCMD.VIDEO_PLAY, res && res.isEnded);
                WindowManager.closeAdvMask();
                if (res && res.isEnded) {
                    // 给予奖励
                    LogsManager.echo("hlx show wx video suc")
                    thisObj.onVideoComplete(true);
                } else {
                    LogsManager.echo("hlx show wx video fail")
                    // VO不弹模态
                    thisObj.onVideoComplete(false);
                }
                // 视频完成预加载下一次视频
                thisObj.loadVideoAd();
            });
            videoAd.load();
        } else {
            this.loadAdvFailed = true;
        }
    }

    /**
    * 调用微信视频广告
    * @param callback
    * @param thisObj
    * @returns 返回装状态res，0没看完，1看完，-1没广告
    */
    showVideoAd(successCallBack: any, thisObj: any) {
        // 点击观看视频打点
        StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD);
        this.isPlayVideo = false;
        if (!AdVideoManager.instance._isInitAdv) return;
        if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ADV)) return;
        this._videoSucCallback = successCallBack;
        this._videoThisObj = thisObj;
        WindowManager.openAdvMask();
        if (!this._videoId) {
            WindowManager.closeAdvMask();
            this._doVedioCallBack(false);
            return;
        }
        if (!this._videoAd) {
            this.registerAd();
        }
        if (!this._videoAd) {
            WindowManager.closeAdvMask();
            LogsManager.echo("yrc 没有广告实例，直接执行成功回调")
            this._doVedioCallBack(false);
            return;
        }
        var videoAd = this._videoAd;
        videoAd.show();
    }
}
