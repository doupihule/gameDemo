import WXGamePlatform from "./WXGamePlatform";
import LogsManager from "../manager/LogsManager";
import Client from "../common/kakura/Client";
import SoundManager from "../manager/SoundManager";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";
import TranslateFunc from "../func/TranslateFunc";
import WindowManager from "../manager/WindowManager";
import TimerManager from "../manager/TimerManager";
import MainModule from "../manager/MainModule";
import Global from "../../utils/Global";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import GameSwitch from "../common/GameSwitch";

export default class VivoGamePlatform extends WXGamePlatform {
    public static instance: VivoGamePlatform;
    /**
     * 最后视频拉取成功时间，vivo渠道视频拉取间隔1分钟
     */
    private _lastShowVideoTime = 0;
    public constructor() {
        super();
        VivoGamePlatform.instance = this;
    }

    getWX() {
        return window['qg'];
    }

    //初始化平台数据
    initPlatformData() {
        // BannerAdManager.registerBanner();
        // AdVideoManager.instance.registerOrigionAdv();
        this.registerAd();
        
        LogsManager.echo("平台登录就添加桌面 --------------------")
        if(!GameSwitch.checkOnOff(GameSwitch.SWITCH_VIVO_ADDTODESK))
        {
            this.addToDesktop();
        }
    }

    /**
     * 调用微信视频广告
     * @param callback
     * @param thisObj
     * @returns 返回装状态res，0没看完，1看完，-1没广告
     */
    showVideoAd(successCallBack: any = null, closeCallBack: any = null, thisObj: any = null, extraData = {}) {
        LogsManager.echo("hlx videoad.showVideoAd 视频开始展示！！！", Client.instance.serverTime);
        WindowManager.SwitchMaskUI(true, 0.5);
        SoundManager.stopMusic();
        StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD);
        this._videoLoaded = true;
        this._videoSucCallback = successCallBack;
        this._videoFailCallback = closeCallBack;
        this._extraData = extraData;
        this._videoThisObj = thisObj;
        var platformObj = this;
        if (!this._videoAd) {
            this.registerAd();
        }
        if (!this._videoAd) {
            WindowManager.SwitchMaskUI(false, 0.5);
            LogsManager.echo("yrc 没有广告实例，直接执行失败回调")
            this._doVedioCallBack(false);
            return;
        }
        var videoAd = this._videoAd;
        if (this.advHasShow) {
            // vivo广告拉取有60秒cd
            // var leftCD = this.getAdCD();
            // LogsManager.echo("hlx videoAd leftCD:", leftCD);
            // if (leftCD > 0) {
            //     ToolTip.instance.setFlyText(TranslateFunc.instance.getTranslate("#tid_ad_load_cd", 'TranslateGlobal', leftCD));
            //     StatisticsManager.ins.onEvent(StatisticsManager.NORMAL_VIDEO_AD_FAIL);
            //     WaitManager.instance.remove(MsgCMD.ADV_LOADING);
            //     this._doVedioCallBack(false);
            //     return;
            // }
            LogsManager.echo("hlx videoAd.load.begin");
            this._lastShowVideoTime = Client.instance.serverTime
            // 在onload中做showVideo
            var loadResult = videoAd.load();
            LogsManager.echo("hlx videoAd.load.end");
            // 调用then和catch之前需要对load的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
            if (loadResult) {
                LogsManager.echo("hlx videoAd.load Promise begin");
                loadResult.then(() => {
                    LogsManager.echo('hlx video.load.then', Client.instance.serverTime);
                }).catch((err) => {
                    LogsManager.echo("hlx videoAd.load.err 激励视频广告加载失败", JSON.stringify(err));
                    if (platformObj._videoLoaded) {
                        WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_ad_error"));
                        StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD_FAIL);
                        WindowManager.SwitchMaskUI(false, 0.5);
                        platformObj._doVedioCallBack(false);
                    }
                }).finally(() => {
                    LogsManager.echo("hlx videoAd.load.finally");
                });
                LogsManager.echo("hlx videoAd.load Promise end");
            } else {
                LogsManager.warn('hlx videoAd.load 没有result，直接执行show');
                // this._showVideo();
            }
        } else {
            this._lastShowVideoTime = Client.instance.serverTime
            this._showVideo();
        }
    }

    /**
     * 加载视频成功后回调
     */
    afterVideoLoadCallBack() {
        if (this._videoLoaded) {
            this._showVideo();
        }
    }

    

    protected _showVideo() {
        LogsManager.echo('hlx video._showVideo 开始显示视频广告',Client.instance.serverTime);
        this.videoState = 1;
        this._videoAd.show();
        WindowManager.SwitchMaskUI(false, 0.5);
        this.advHasShow = true;
    }

    /**
     * 添加到桌面
     */
    addToDesktop(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
        if (!this.canAddToDesktop()) {
            failCall && failCall.call(thisObj)
            return;
        }
        this.getWX().installShortcut({
            success(res) {
                LogsManager.echo("hlx 添加到桌面成功", JSON.stringify(res));
                StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_DESKTOP_SUCCESS);
                successCall && successCall.call(thisObj)
            },
            fail(res) {
                LogsManager.echo("hlx 添加到桌面失败", JSON.stringify(res));
                StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_DESKTOP_FAIL);
                failCall && failCall.call(thisObj)
            }
        })
    }
    /**设置排行榜数据 */
    setUseRankInfo(data = []) {
        //todo:暂时未接入
    }

    /**
     * 添加版本更新监听
     */
    addUpdateListener() {
        // Vivo由于版本更新后。低版本分包加载报错。所以必须等更新回调后加载资源 2020.1.2 fixby黄璐骁
        var thisObj = this;
        var timeCode = TimerManager.instance.setTimeout(() => {
            thisObj.isOutTime = true;
            thisObj.setVersionCheckResult(1);
            MainModule.instance.changeShowMainTask(-1,  MainModule.task_updateListerner,"addUpdateListener overtime");
        }, this, 5000);


        this.changeLeftTask(-1,"addUpdateListener");
        this.startDownloadSubPackage();
        //版本更新检查完毕后开始初始化资源
        MainModule.instance.checkSystem();

        //LogsManager.echo("sanmen    完成任务    addUpdateListener");

        var timer = Client.instance.serverTime;
        this.getWX().onUpdateReady(function (res) {
            // 请求完新版本信息的回调
            LogsManager.echo("请求完新版本信息的回调", JSON.stringify(res), "costTime :", Client.instance.serverTime - timer);
            thisObj.setVersionCheckResult(res == 1 ? 2 : 1);
            // 如果检查更新未超时，则移除计时器
            if (!thisObj.isOutTime) {
                // 移除超时计时器
                timeCode && TimerManager.instance.remove(timeCode);
            }
            if (res == 1) {
                // 有更新，给出一个飘字，重启游戏
                WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#versionForceUpdate"))
                //300毫秒以后强制删除游戏
                TimerManager.instance.setTimeout(() => {
                    Global.isGameDestory = true;
                    thisObj.getWX().applyUpdate();
                }, this, 300);
            } else {
                // 无更新。加载主界面资源
                if (!thisObj.isOutTime) {
                    MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "addUpdateListener sucess");
                }
            }
        })
    }

    getUserInfoAndReq() {
        var myThis = this;
        myThis.platformUserInfo = {};
        this.sendKakuraInit();
        return;
    }
    /**
     * 计算刘海屏
     */
    reCheckBar() {
        if (typeof this.getWX().getNotchHeight == 'function') {
            try {
                this.getWX().getNotchHeight({
                    success: function (data) {
                        // 异形屏高度
                        ScreenAdapterTools.toolBarWidth = data.height;
                        LogsManager.echo(`hlx getNotchHeight success: ${data.height}`)
                    },
                    fail: function (data, code) {
                        LogsManager.echo(`hlx getNotchHeight fail, code = ${code}`)
                    }
                })
            } catch (e) {
                LogsManager.echo('hlx getNotchHeight 方法报错:', JSON.stringify(e));
            }
        } else {
            LogsManager.echo('hlx 无 getNotchHeight 方法');
        }
    }
}

