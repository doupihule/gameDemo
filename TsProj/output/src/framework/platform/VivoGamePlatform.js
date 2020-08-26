"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WXGamePlatform_1 = require("./WXGamePlatform");
const LogsManager_1 = require("../manager/LogsManager");
const Client_1 = require("../common/kakura/Client");
const SoundManager_1 = require("../manager/SoundManager");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const StatisticsCommonConst_1 = require("../consts/StatisticsCommonConst");
const TranslateFunc_1 = require("../func/TranslateFunc");
const WindowManager_1 = require("../manager/WindowManager");
const TimerManager_1 = require("../manager/TimerManager");
const MainModule_1 = require("../manager/MainModule");
const Global_1 = require("../../utils/Global");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
const GameSwitch_1 = require("../common/GameSwitch");
class VivoGamePlatform extends WXGamePlatform_1.default {
    constructor() {
        super();
        /**
         * 最后视频拉取成功时间，vivo渠道视频拉取间隔1分钟
         */
        this._lastShowVideoTime = 0;
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
        LogsManager_1.default.echo("平台登录就添加桌面 --------------------");
        if (!GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_VIVO_ADDTODESK)) {
            this.addToDesktop();
        }
    }
    /**
     * 调用微信视频广告
     * @param callback
     * @param thisObj
     * @returns 返回装状态res，0没看完，1看完，-1没广告
     */
    showVideoAd(successCallBack = null, closeCallBack = null, thisObj = null, extraData = {}) {
        LogsManager_1.default.echo("hlx videoad.showVideoAd 视频开始展示！！！", Client_1.default.instance.serverTime);
        WindowManager_1.default.SwitchMaskUI(true, 0.5);
        SoundManager_1.default.stopMusic();
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD);
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
            WindowManager_1.default.SwitchMaskUI(false, 0.5);
            LogsManager_1.default.echo("yrc 没有广告实例，直接执行失败回调");
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
            LogsManager_1.default.echo("hlx videoAd.load.begin");
            this._lastShowVideoTime = Client_1.default.instance.serverTime;
            // 在onload中做showVideo
            var loadResult = videoAd.load();
            LogsManager_1.default.echo("hlx videoAd.load.end");
            // 调用then和catch之前需要对load的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
            if (loadResult) {
                LogsManager_1.default.echo("hlx videoAd.load Promise begin");
                loadResult.then(() => {
                    LogsManager_1.default.echo('hlx video.load.then', Client_1.default.instance.serverTime);
                }).catch((err) => {
                    LogsManager_1.default.echo("hlx videoAd.load.err 激励视频广告加载失败", JSON.stringify(err));
                    if (platformObj._videoLoaded) {
                        WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_ad_error"));
                        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD_FAIL);
                        WindowManager_1.default.SwitchMaskUI(false, 0.5);
                        platformObj._doVedioCallBack(false);
                    }
                }).finally(() => {
                    LogsManager_1.default.echo("hlx videoAd.load.finally");
                });
                LogsManager_1.default.echo("hlx videoAd.load Promise end");
            }
            else {
                LogsManager_1.default.warn('hlx videoAd.load 没有result，直接执行show');
                // this._showVideo();
            }
        }
        else {
            this._lastShowVideoTime = Client_1.default.instance.serverTime;
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
    _showVideo() {
        LogsManager_1.default.echo('hlx video._showVideo 开始显示视频广告', Client_1.default.instance.serverTime);
        this.videoState = 1;
        this._videoAd.show();
        WindowManager_1.default.SwitchMaskUI(false, 0.5);
        this.advHasShow = true;
    }
    /**
     * 添加到桌面
     */
    addToDesktop(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
        if (!this.canAddToDesktop()) {
            failCall && failCall.call(thisObj);
            return;
        }
        this.getWX().installShortcut({
            success(res) {
                LogsManager_1.default.echo("hlx 添加到桌面成功", JSON.stringify(res));
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.ADD_DESKTOP_SUCCESS);
                successCall && successCall.call(thisObj);
            },
            fail(res) {
                LogsManager_1.default.echo("hlx 添加到桌面失败", JSON.stringify(res));
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.ADD_DESKTOP_FAIL);
                failCall && failCall.call(thisObj);
            }
        });
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
        var timeCode = TimerManager_1.default.instance.setTimeout(() => {
            thisObj.isOutTime = true;
            thisObj.setVersionCheckResult(1);
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "addUpdateListener overtime");
        }, this, 5000);
        this.changeLeftTask(-1, "addUpdateListener");
        this.startDownloadSubPackage();
        //版本更新检查完毕后开始初始化资源
        MainModule_1.default.instance.checkSystem();
        //LogsManager.echo("sanmen    完成任务    addUpdateListener");
        var timer = Client_1.default.instance.serverTime;
        this.getWX().onUpdateReady(function (res) {
            // 请求完新版本信息的回调
            LogsManager_1.default.echo("请求完新版本信息的回调", JSON.stringify(res), "costTime :", Client_1.default.instance.serverTime - timer);
            thisObj.setVersionCheckResult(res == 1 ? 2 : 1);
            // 如果检查更新未超时，则移除计时器
            if (!thisObj.isOutTime) {
                // 移除超时计时器
                timeCode && TimerManager_1.default.instance.remove(timeCode);
            }
            if (res == 1) {
                // 有更新，给出一个飘字，重启游戏
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#versionForceUpdate"));
                //300毫秒以后强制删除游戏
                TimerManager_1.default.instance.setTimeout(() => {
                    Global_1.default.isGameDestory = true;
                    thisObj.getWX().applyUpdate();
                }, this, 300);
            }
            else {
                // 无更新。加载主界面资源
                if (!thisObj.isOutTime) {
                    MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "addUpdateListener sucess");
                }
            }
        });
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
                        ScreenAdapterTools_1.default.toolBarWidth = data.height;
                        LogsManager_1.default.echo(`hlx getNotchHeight success: ${data.height}`);
                    },
                    fail: function (data, code) {
                        LogsManager_1.default.echo(`hlx getNotchHeight fail, code = ${code}`);
                    }
                });
            }
            catch (e) {
                LogsManager_1.default.echo('hlx getNotchHeight 方法报错:', JSON.stringify(e));
            }
        }
        else {
            LogsManager_1.default.echo('hlx 无 getNotchHeight 方法');
        }
    }
}
exports.default = VivoGamePlatform;
//# sourceMappingURL=VivoGamePlatform.js.map