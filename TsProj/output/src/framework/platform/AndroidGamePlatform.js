"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MusicConst_1 = require("./../../game/sys/consts/MusicConst");
const WindowCfgs_1 = require("./../../game/sys/consts/WindowCfgs");
const GamePlatform_1 = require("./GamePlatform");
const Global_1 = require("../../utils/Global");
const UserInfo_1 = require("../common/UserInfo");
const MainModule_1 = require("../manager/MainModule");
const NativeBridge_1 = require("../native/NativeBridge");
const JSToNativeEvent_1 = require("../event/JSToNativeEvent");
const NativeToJSEvent_1 = require("../event/NativeToJSEvent");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
const ChannelConst_1 = require("../../game/sys/consts/ChannelConst");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const StatisticsCommonConst_1 = require("../consts/StatisticsCommonConst");
const WindowManager_1 = require("../manager/WindowManager");
const Message_1 = require("../common/Message");
const WXGamePlatform_1 = require("./WXGamePlatform");
const TableUtils_1 = require("../utils/TableUtils");
const GameUtils_1 = require("../../utils/GameUtils");
const MethodCommon_1 = require("../common/kakura/MethodCommon");
const SoundManager_1 = require("../manager/SoundManager");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
const LogsManager_1 = require("../manager/LogsManager");
const TranslateFunc_1 = require("../func/TranslateFunc");
const UserModel_1 = require("../../game/sys/model/UserModel");
const TimerManager_1 = require("../manager/TimerManager");
const GameSwitch_1 = require("../common/GameSwitch");
const PackConfigManager_1 = require("../manager/PackConfigManager");
const StringUtils_1 = require("../utils/StringUtils");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
class AndroidGamePlatform extends GamePlatform_1.default {
    constructor() {
        super();
        //重登次数
        this._reloginCount = 0;
        //注册错误回调事件
        window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
            LogsManager_1.default.systemError(errorMessage, errorObj && errorObj.stack, "uri:", scriptURI);
        };
        //添加 获取android设备信息接口
        MainModule_1.default.showMainTask += 1;
        this.loadAdvFailed = false;
        Message_1.default.instance.add(NativeToJSEvent_1.default.TTSDK_AD_EVENT, this);
        Message_1.default.instance.add(NativeToJSEvent_1.default.SYSTEM_INFO_EVENT, this);
        //注册焦点事件
        this.registFocusEvent();
        var conch = window["conch"];
        if (conch && conch.setOnBackPressedFunction) {
            conch.setOnBackPressedFunction(() => {
                WindowManager_1.default.setPopupTip(2, TranslateFunc_1.default.instance.getTranslate("#tid_extiGame"), this.exitGame, this);
            });
        }
    }
    initTTADSdk() {
        var channelData = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId);
        var resultData = TableUtils_1.default.copyOneTable(channelData);
        resultData.appName = GameConsts_1.default.gameName;
        resultData.isDebug = UserInfo_1.default.isTest();
        //角色id
        resultData.userId = UserModel_1.default.instance.getUserRid();
        //广告媒体类型
        resultData.adMediaType = UserInfo_1.default.adMediaType;
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.TTADSDK_INIT, resultData);
    }
    onVideoComplete(videoResult) {
        WXGamePlatform_1.default.prototype.onVideoComplete.call(this, videoResult);
    }
    //看完视频回来
    onDoVedioBack() {
        this.isPlayVideo = false;
        if (WindowManager_1.default.isUIOpened(WindowCfgs_1.WindowCfgs.GameMainUI)) {
            SoundManager_1.default.playBGM(MusicConst_1.MusicConst.MUSIC_BGM);
        }
        WindowManager_1.default.SwitchMaskUI(false, 0.5);
        Message_1.default.instance.send(MsgCMD_1.default.VIDEO_PLAY);
    }
    getLoginResult() {
        //初始化头条sdk
        this.initTTADSdk();
        //如果是 云储存
        if (Global_1.default.checkUserCloudStorage()) {
            return;
        }
        this.changeLeftTask(-1, "getLoginResult");
    }
    getUserInfoAndReq() {
        this.sendKakuraInit();
    }
    //判断是否是套壳包
    checkSignSha1() {
        var sign = "PhmdlmidmeQmfhmefmfgmOhmejmROmNhmfjmOhmPNmejmfcmjhmihmePmNg|kQmOPmSOmkgmljmcimcgmjemedmejmORmNjmNkmefmecmjimkdmQgmifmei";
        var singArr;
        if (!sign) {
            LogsManager_1.default.errorTag("sha1Error", "Game Const.ts没有配置ENCODE_SHA1");
            return;
        }
        var decodeSign = StringUtils_1.default.decodeSign(sign);
        //必须是android系统
        if (!UserInfo_1.default.isSystemAndroid()) {
            return;
        }
        //test平台的包不校验
        if (UserInfo_1.default.isTest()) {
            return;
        }
        if (!this._nativeSha1Arr || this._nativeSha1Arr.length == 0) {
            LogsManager_1.default.warn("native串还没初始化--");
            return;
        }
        for (var i = 0; i < this._nativeSha1Arr.length; i++) {
            var nativeSign = this._nativeSha1Arr[i];
            if (decodeSign.indexOf(nativeSign) == -1) {
                //这个表名是套壳包
                this.childChannelId = nativeSign;
                LogsManager_1.default.errorTag("wrongSha1", "这是套壳包.sha1:" + nativeSign);
                return;
            }
        }
        LogsManager_1.default.echo("这个包是合法的");
    }
    createLoginButton(callBack, thisObject) {
        callBack && callBack.call(thisObject);
    }
    getWxInfo() {
        if (this._reloginCount == 0) {
            //如果是web版 跳过底层系统更新版本检查 和 分包版本检查
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "skip version check");
            //web版本也在这个时候才初始化物理引擎.是为了统一结构 防止因为平台差异化导致不一样的问题
            UserInfo_1.default.platform.initPhysics3D("skip physics3d subpackage check");
        }
        this._startReqGlobal();
    }
    //请求global
    _startReqGlobal() {
        var deviceId = Global_1.default.deviceId;
        //登入放到获取到native信息之后处理
        var params = {
            "method": this.getGlobalMethod(),
            "params": {
                "passport": deviceId,
                "password": '',
                "device": Global_1.default.deviceModel,
                "childChannelId": this.getChildChannelKey()
            }
        };
        UserInfo_1.default.platform.reqGlobal(params);
    }
    getGlobalMethod() {
        return MethodCommon_1.default.global_Account_loginAndroidMaster;
    }
    sharePage() {
        // ToolTip.instance.setFlyText("暂不支持此功能");
    }
    /**分享 */
    share(id, extraData, callback, thisObj) {
        callback && callback.call(thisObj, true);
    }
    //开始加载视频
    showVideoAd(successCallBack = null, closeCallBack = null, thisObj = null, extraData = {}) {
        //如果是套壳包. 只做失败返回
        if (this.isCasingPackage()) {
            if (closeCallBack) {
                closeCallBack.call(thisObj, false);
            }
            ;
            return;
        }
        // 点击观看视频打点
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD);
        this._videoSucCallback = successCallBack;
        this._videoFailCallback = closeCallBack;
        this._extraData = extraData;
        this._videoLoaded = true;
        this._videoThisObj = thisObj;
        WindowManager_1.default.SwitchMaskUI(true, 0.5);
        this.isPlayVideo = true;
        SoundManager_1.default.stopMusic();
        //读取视频类型  1是优先全屏视频 2优先激励视频.
        var vedioType = Number(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_NATIVE_VEDIO_TYPE)) || 2;
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.TTADSDK_SHOWVEDIO, { scene: WindowManager_1.default.getCurrentWindowName() || "main", type: vedioType });
        // successCallBack && successCallBack.call(thisObj, true);
    }
    /**退出登入  */
    loginOut() {
        window.location.reload();
        // Laya.PlatformClass.createClass()
    }
    //设置游戏帧率
    setGameFrame() {
        super.setGameFrame();
    }
    /**版本更新检查 */
    addUpdateListener() {
        var appCache = window["appcache"];
        //设置缓存的版本号.下次更新直接拉取最新的版本
        var targetVersion = Global_1.default.version;
        LogsManager_1.default.echo("version setVMSVersion:" + targetVersion, "hotfixSwitch:", GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_HOTFIX));
        this.changeLeftTask(-1, "addUpdateListener");
        //必须是 开启热更状态才会去覆盖本地版本
        if (!GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_HOTFIX)) {
            if (appCache) {
                var oldVersion = appCache.getResourceID(this.getCacheKey());
                // if(UserInfo.isTest()){
                //     var lb = new Laya.Label();
                //     lb.text = "old:"+oldVersion +",new:"+ targetVersion
                //     lb.width = 100;
                //     lb.height = 20;
                //     lb.fontSize = 20;
                //     lb.strokeColor = "#00ffff";
                //     lb.stroke = 1;
                //     lb.pos(420,20);
                //     lb.mouseEnabled =false;
                //     WindowManager.rootLayer.addChild(lb);
                // }   
                if (!oldVersion || oldVersion == "") {
                    appCache.setResourceID(this.getCacheKey(), targetVersion);
                }
                else {
                    if (oldVersion != targetVersion) {
                        appCache.setResourceID(this.getCacheKey(), targetVersion);
                        LogsManager_1.default.echo("versionUpdate:", "有新版本,vold:" + oldVersion + ",vnew:" + targetVersion);
                        //测试环境 
                        // if(Number(targetVersion)% 2 ==0){
                        //     WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_newVersion"), this.reloadGame, this);
                        // }
                        this.reloadGame();
                        return;
                    }
                }
            }
        }
        //版本检查完毕以后 才隐藏loading
        if (window["loadingView"]) {
            window["loadingView"].hideLoadingView();
        }
        //如果是套壳包
        if (this.isCasingPackage()) {
            //这个地方需要读取策略 默认是强退,提醒他去官网下载包
            var method = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_SIGN_METHOD);
            //默认方案就是不让进游戏
            if (!method || method == "0") {
                WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#tid_casingPackage"), this.gotoPackageUrl, this);
                return;
            }
        }
        super.addUpdateListener();
    }
    //去安装包地址
    gotoPackageUrl() {
        var url = PackConfigManager_1.default.ins.platform.DOWNLOAD_URL;
        if (url) {
            NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_OPENURL, { url: url });
        }
        //1秒以后退出游戏
        TimerManager_1.default.instance.add(this.exitGame, this, 1000);
    }
    //重新加载游戏
    reloadGame() {
        //移除所有对象
        this.clearAllData();
        //延迟一帧以后再销重载游戏.否则渲染会有bug
        TimerManager_1.default.instance.add(window.location.reload, window.location, 100, 1);
        // window.location.reload(true);
    }
    //清除所有数据
    clearAllData() {
        var rootCtn = WindowManager_1.default.rootLayer;
        rootCtn.removeSelf();
    }
    //执行版本覆盖
    doCoverVersion(serverVersion) {
        // serverVersion =String( (Number( this.getAPPCacheVersion() ) || 1) +1  ) ;
        LogsManager_1.default.echo("serverVersion:" + serverVersion);
        //如果是测试渠道 而且版本号是1 
        if (UserInfo_1.default.isTest() && Global_1.default.version == "1") {
            return;
        }
        var __projectConfig = window["__projectConfig"];
        var minVersion = __projectConfig && __projectConfig.APP_BUILD_NUM || 1;
        minVersion = Number(minVersion);
        var localNum = Number(Global_1.default.version);
        var targetVersion = this.getAPPCacheVersion();
        var serverNum = 0;
        if (!serverVersion) {
            if (targetVersion) {
                serverNum = Number(targetVersion);
            }
        }
        else {
            serverNum = Number(serverVersion);
        }
        //直接取服务器的版本和客户端打包的版本最对比.  默认直接用服务器的版. 但如果客户端打包版本号比服务器版本号高. 那么表示采用打包版本号
        var resultVersion = Math.max(minVersion, serverNum);
        Global_1.default.version = String(resultVersion);
        LogsManager_1.default.echo("GlobalVersion:" + Global_1.default.version, "server:", serverVersion, "buildVersion:", minVersion);
    }
    //获取app缓存的版本号
    getAPPCacheVersion() {
        var appCache = window["appcache"];
        var targetVersion;
        if (appCache) {
            targetVersion = appCache.getResourceID(this.getCacheKey());
        }
        return targetVersion;
    }
    //获取缓存的vmskey
    getCacheKey() {
        return "vmsVersion" + PackConfigManager_1.default.ins.platform.platform;
    }
    canAdv() {
        if (!GameUtils_1.default.canVideo) {
            return false;
        }
        //如果是套壳包 不能看广告
        if (this.isCasingPackage()) {
            return false;
        }
        return true;
    }
    canShare() {
        return false;
    }
    //android平台的versionjson 一定要和 appcache的version同步. 否则会出现版本错乱    
    getVersionName() {
        var appCache = window["appcache"];
        var targetVersion = Global_1.default.version;
        if (appCache) {
            targetVersion = appCache.getResourceID(this.getCacheKey());
            if (!targetVersion) {
                targetVersion = Global_1.default.version;
            }
        }
        LogsManager_1.default.echo("getVersionName:" + targetVersion);
        return "version_" + targetVersion + ".json";
    }
    //重写是否是套壳包
    isCasingPackage() {
        if (this.childChannelId) {
            return true;
        }
        return false;
    }
    //退出游戏
    exitGame() {
        if (window["conch"].exit) {
            window["conch"].exit();
        }
    }
    //------------------------------------native交互------------------------------------
    //------------------------------------native交互------------------------------------
    //------------------------------------native交互------------------------------------
    //native信息返回的时候 在开始登入
    onNativeInfoBack() {
        //校验sha1串
        this.checkSignSha1();
    }
    //头条sdk广告播放回调
    onTTSDKAdCallBack(params) {
        var thisObj = this;
        //复用wxgameplatform方法
        //1是成功
        if (params.status == 1) {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_SUCCESS);
            this.onDoVedioBack();
            WXGamePlatform_1.default.prototype.onVideoComplete.call(this, true);
            //取消
        }
        else if (params.status == 2) {
            WindowManager_1.default.SwitchMaskUI(false, 0.5);
            WXGamePlatform_1.default.prototype.onTurnOffAdsEarly.call(this);
            thisObj._extraData && thisObj._extraData.callback && thisObj._extraData.callback.call(thisObj._extraData.thisObj, false);
            //判定失败
        }
        else if (params.status == 3) {
            if (!this.isPlayVideo) {
                return;
            }
            // 弹出广告正在加载中
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_ad_initerror"));
            this.onDoVedioBack();
            WXGamePlatform_1.default.prototype._doVedioCallBack.call(this, false);
            //如果是有ecpm的 那么做ecpm统计
        }
        else if (params.status == 6) {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD_ECPM, { ecpm: params.ecpm, level: params.ecpmLevel });
            //判定失败
        }
        else {
            //其他事件---- 
        }
    }
    //设备震动接口
    vibrate(isLong = false, callBack = null, thisObject = null) {
        //调用短震动接口
        var time = 20;
        if (isLong) {
            time = 60;
        }
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_VIBRATOR, { time: time, style: 1 });
        if (callBack) {
            TimerManager_1.default.instance.add(callBack, thisObject, time, 1);
        }
    }
    /**
     * 监听加速度
     */
    onAccelerometerChange() {
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_ACCEL);
    }
    /**
     * 重置加速计加速值
     */
    accelerometerClear(x) {
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_ACCEL_CLEAR, x);
    }
    /**
     * 暂定加速器监听
     */
    accelerometerPause() {
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_ACCEL_PAUSE);
    }
    recvMsg(cmd, data) {
        //接收头条sdk广告事件
        if (cmd == NativeToJSEvent_1.default.TTSDK_AD_EVENT) {
            this.onTTSDKAdCallBack(data);
        }
        else if (cmd == NativeToJSEvent_1.default.SYSTEM_INFO_EVENT) {
            ScreenAdapterTools_1.default.checkNativeSystemInfo(data);
            //存储native的sha1串值
            if (data.sign) {
                this._nativeSha1Arr = data.sign.split(",");
            }
            //存储native数据
            this._nativeBackData = data;
            MainModule_1.default.instance.changeShowMainTask(-1, "getNativeSystemInfo", "获取native信息返回");
            this.onNativeInfoBack();
        }
    }
    /**
     * 推送
     */
    pushMessage(delay, id, title, subTitle, body, repeats = false) {
        if (delay < 1) {
            LogsManager_1.default.warn("推送延迟小于1秒，注册不执行");
            return;
        }
        if (repeats && delay <= 60) {
            LogsManager_1.default.warn("推送需要重发且延迟不大于60秒，注册不执行");
            return;
        }
        if (this.tempPushDic["title"]) {
            delete this.tempPushDic["title"];
        }
        if (this.tempPushDic["subtitle"]) {
            delete this.tempPushDic["subtitle"];
        }
        if (this.tempPushDic["body"]) {
            delete this.tempPushDic["body"];
        }
        this.tempPushDic["delay"] = delay;
        this.tempPushDic["id"] = id;
        this.tempPushDic["repeats"] = repeats;
        if (title) {
            this.tempPushDic["title"] = title;
        }
        if (subTitle) {
            this.tempPushDic["subtitle"] = subTitle;
        }
        if (body) {
            this.tempPushDic["body"] = body;
        }
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_PUSH, this.tempPushDic);
    }
}
exports.default = AndroidGamePlatform;
//# sourceMappingURL=AndroidGamePlatform.js.map