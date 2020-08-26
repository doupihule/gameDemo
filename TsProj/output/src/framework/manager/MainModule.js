"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SoundManager_1 = require("./SoundManager");
const LogsManager_1 = require("./LogsManager");
const Global_1 = require("../../utils/Global");
const WindowManager_1 = require("./WindowManager");
const WindowCfgs_1 = require("../../game/sys/consts/WindowCfgs");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
const UtilsServer_1 = require("../../game/sys/server/UtilsServer");
const UserInfo_1 = require("../common/UserInfo");
const FuncManager_1 = require("./FuncManager");
const Client_1 = require("../common/kakura/Client");
const Method_1 = require("../../game/sys/common/kakura/Method");
const GameSwitch_1 = require("../common/GameSwitch");
const KakuraClient_1 = require("../common/kakura/KakuraClient");
const Message_1 = require("../common/Message");
const GameConfig_1 = require("../../GameConfig");
const UserModel_1 = require("../../game/sys/model/UserModel");
const LoadManager_1 = require("./LoadManager");
const VersionManager_1 = require("./VersionManager");
const FileUtils_1 = require("../utils/FileUtils");
const TimerManager_1 = require("./TimerManager");
const MusicConst_1 = require("../../game/sys/consts/MusicConst");
const LoadZipManager_1 = require("./LoadZipManager");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const SubPackageConst_1 = require("../../game/sys/consts/SubPackageConst");
const SubPackageManager_1 = require("./SubPackageManager");
const UserGlobalModel_1 = require("../model/UserGlobalModel");
const BannerAdManager_1 = require("./BannerAdManager");
const FrameWorkEvent_1 = require("../event/FrameWorkEvent");
const ModelToServerMapCommon_1 = require("../consts/ModelToServerMapCommon");
const KariqiShareManager_1 = require("./KariqiShareManager");
const KariquShareConst_1 = require("../consts/KariquShareConst");
;
class MainModule {
    constructor() {
        this.timeLock = 0;
        //完成任务列表
        this._taskCompMap = {};
        MainModule.instance = this;
        GameConfig_1.default.startScene && Laya.Scene.open(GameConfig_1.default.startScene);
        Laya.SoundManager.useAudioMusic = false;
        Laya.MouseManager.multiTouchEnabled = false;
        SoundManager_1.default.init();
        this.initLayer();
        this.onLoadingUIComplete();
        Message_1.default.instance.add(MsgCMD_1.default.GAME_ONSHOW, this);
        Message_1.default.instance.add(MsgCMD_1.default.VIDEO_STOP, this);
        Message_1.default.instance.add(MsgCMD_1.default.VIDEO_PLAY, this);
    }
    //Loading页面显示后开始加载资源
    onLoadingUIComplete() {
        this.timeLock = Laya.timer.currTimer;
        this.reqVMS();
    }
    reqVMS() {
        UserInfo_1.default.platform.reqVMS();
    }
    checkSystem() {
        // if (FileUtils.isUserWXSource()) {
        //     Global.resource_url += UserInfo.platformId + "/";
        //     Global.nocdn_resource_url += UserInfo.platformId + "/";
        // }
        //获取版本的名字.  不同渠道 返回的不一样
        var versionName = UserInfo_1.default.platform.getVersionName();
        if (Global_1.default.resource_url && Global_1.default.isCDN) {
            Laya.URL.basePath = Global_1.default.resource_url;
            // versionName = `version_${Global.version}.json`;
            // Laya.URL.basePath = "http://192.168.1.112:8080/";//测试用地址，本地
            //versionName = "version.json";//测试用地址，本地
        }
        VersionManager_1.default.instance.versionName = versionName;
        LogsManager_1.default.echo("xd cdnurl:", Global_1.default.resource_url);
        LogsManager_1.default.echo("yrc reqvms suc", Laya.URL.basePath);
        LogsManager_1.default.echo("yrc req versionName:", versionName);
        //用test.json去验证cdn是否可用
        LoadManager_1.LoadManager.instance.load(versionName, Laya.Handler.create(this, () => {
            VersionManager_1.default.instance.initVersionData();
            //这里以后走自己的文件映射版本控制.不走laya的了
            this.onVersionLoaded();
        }));
    }
    useNocndResourceUrl() {
    }
    onVersionLoaded() {
        //版本文件检查,是否需要删除旧版本的文件
        VersionManager_1.default.instance.versionFileCheck();
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        //等待配表加载完成后才能进行后续的事情 
        FuncManager_1.default.init(() => {
            if (Global_1.default.checkUserCloudStorage()) {
                this.onLoginResult(Client_1.default.instance.globalLoginBackData);
                UserInfo_1.default.platform.getLoginResult();
            }
            this.sysCallback();
        }, this);
    }
    onConfigLoaded() {
        this.changeShowMainTask(-1, MainModule.task_configsloaded, "onConfigLoaded");
    }
    sysCallback() {
        LogsManager_1.default.echo(" ======--VMSTIME--======== " + (Laya.timer.currTimer - this.timeLock));
        //联网模式 是在确认版本之后才开始登入
        if (!Global_1.default.checkUserCloudStorage()) {
            UserInfo_1.default.platform.getWxInfo();
        }
        //开始加载合并文件
        this.loadMergeFiles();
        // 初始化平台参数
        UserInfo_1.default.platform.initPlatformData();
    }
    changeByte(name) {
        var buffer = Laya.Loader.getRes(name);
        var byte = new Laya.Byte(buffer);
        if (byte.length > 4) {
            FileUtils_1.default.decodeBinAssets(byte);
        }
        Laya.Loader.clearRes(name);
    }
    //加载
    loadMergeFiles() {
        //如果是不使用文件合并功能 web版 或者是zip版本
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_MERGEFILES) || UserInfo_1.default.isWeb()) {
            this.onMergeFileBack();
        }
        else {
            LogsManager_1.default.echo("xd----使用文件合并功能,注意开发模式下 可以禁掉文件合并功能.防止版本使用冲突");
            var zipList = [
                { url: "mergefiles/mergeBin.bin", type: "arraybuffer" },
                { url: "mergefiles/mergeJson.bin", type: "arraybuffer" },
            ];
            var times = Laya.Browser.now();
            var onZipLoad = () => {
                LogsManager_1.default.echo("krma. onZipLoad onZipLoad onZipLoad onZipLoad onZipLoad");
                LoadManager_1.LoadManager.instance.load(zipList, Laya.Handler.create(this, () => {
                    this.changeByte("mergefiles/mergeBin.bin");
                    this.changeByte("mergefiles/mergeJson.bin");
                    this.onMergeFileBack();
                    LogsManager_1.default.echo("xd  合并文件下载解析总耗时-----------", Laya.Browser.now() - times);
                }));
            };
            //如果是使用zip功能的
            if (FileUtils_1.default.checkIsUseZip()) {
                //需要先加载对应的zip
                LoadZipManager_1.LoadZipManager.instance.loadZip("mergefiles.zip", VersionManager_1.default.ZIP_MODEL_KEY_MERGEFILES, new Laya.Handler(this, onZipLoad), null);
            }
            else {
                //如果合并文件是走分包的  等分包下载完成在去执行这个
                if (SubPackageManager_1.default.getModelFileStyle(SubPackageConst_1.default.packName_mergefiles) == SubPackageConst_1.default.PATH_STYLE_SUBPACK) {
                    SubPackageManager_1.default.loadSubPackage(SubPackageConst_1.default.packName_mergefiles, onZipLoad, this, true);
                }
                else {
                    onZipLoad();
                }
            }
        }
    }
    //合并文件返回
    onMergeFileBack() {
        this.changeShowMainTask(-1, MainModule.task_mergeFileBack, "onMergeFileBack");
    }
    loginResult() {
        //3.311请求接口，获取用户信息
        LogsManager_1.default.echo(" ======--GlobalTIME--======== " + (Laya.timer.currTimer - this.timeLock));
        if (Global_1.default.isNotGuide()) {
            // StatisticsManager.ins.onEvent(StatisticsManager.NEW_LOADING_5_7);
        }
        else {
            // StatisticsManager.ins.onEvent(StatisticsManager.LOADING_5_7);
        }
        Client_1.default.instance.send(Method_1.default.User_login, {}, this.onLoginResult, this);
    }
    onLoginResult(result) {
        LogsManager_1.default.echo("yrc onLoginResult", result);
        var serverData = result;
        if (!Global_1.default.checkUserCloudStorage()) {
            Client_1.default.instance.globalLoginBackData = result;
            serverData = result.data;
        }
        else {
            UserInfo_1.default.platform.compareData(result);
        }
        // GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        if (serverData.config) {
            Client_1.default.instance.heartBeatInterval = result.data.config.heartBeatInterval;
            //覆盖服务器来回的开关参数
            if (result.data.config.switch) {
                GameSwitch_1.default.coverServerSwitchMap(result.data.config.switch);
                LogsManager_1.default.echo("yrc gameswitch resultSwitch", result.data.config.switch);
            }
            KakuraClient_1.default.instance.registHeartBeat();
        }
        LogsManager_1.default.echo("yrc SWITCH_LOG_PANEL:", GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_LOG_PANEL));
        LogsManager_1.default.setLogGroupVisible(GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_LOG_PANEL));
        var userData = serverData.user;
        //初始化所有的模块数据
        ModelToServerMapCommon_1.default.initModelToServerMap();
        var modelMap = ModelToServerMapCommon_1.default.modelToServerMap;
        var length = modelMap.length;
        for (var i = 0; i < length; i++) {
            var info = modelMap[i];
            var key = info.key;
            var model = info.model;
            if (info.key == "user") {
                model.instance.initData(userData);
            }
            else {
                //初始化的时候需要给一个默认值,
                if (!userData[key]) {
                    userData[key] = {};
                }
                var data = userData[key];
                model.instance.initData(data);
            }
        }
        // 获取云存储信息
        UserGlobalModel_1.default.instance.flushGlobalData(this.getCloudGlobalDataResult, this);
        SoundManager_1.default.init();
        SoundManager_1.default.initSwitch();
    }
    /**
     * 获取全局用户数据回调
     */
    getCloudGlobalDataResult(params) {
        // 玩家登陆
        UserModel_1.default.instance.login();
        // 设置相关开关
        BannerAdManager_1.default.setBannerSwitch();
        this.changeShowMainTask(-1, MainModule.task_onloginResult, "onLoginResult");
    }
    //value 完成任务数量,key,完成的任务对应的key, tag,任务描述
    changeShowMainTask(value, key, tag = null) {
        MainModule.showMainTask += value;
        LogsManager_1.default.echo("yrc showMainTask", value, MainModule.showMainTask, "tag:", tag);
        //同时记录对应的任务key标记为true.为了一些特殊情况判断
        this._taskCompMap[key] = true;
        //所有任务都完成就进入主界面
        if (MainModule.showMainTask == 0) {
            this.showGameMain();
        }
        else if (MainModule.showMainTask < 0) {
            LogsManager_1.default.errorTag("mainTaskError", "taskError", MainModule.showMainTask, tag);
        }
    }
    //判断某个任务是否完成
    checkHasTaskComplete(taskKey) {
        return this._taskCompMap[taskKey];
    }
    /**根据返回值决定出现主界面还是好友匹配界面 */
    showGameMain() {
        Message_1.default.instance.send(FrameWorkEvent_1.default.FRAMEWORKEVENT_STARTENTERMAIN);
        KariqiShareManager_1.default.onEvent(KariquShareConst_1.default.KARIQU_GAMEMAIN);
    }
    /**根据点击链接后的不同状态，弹tip */
    showInviteTip(shareStatus) {
        // var shareStatus = UserModel.instance.getShareStatus();
        if (!shareStatus)
            return;
        switch (Number(shareStatus)) {
            case 2:
                //房间不存在
                WindowManager_1.default.ShowTip("房间已解散");
                break;
            case 3:
                //比赛已经开始
                WindowManager_1.default.ShowTip("比赛已经开始");
                break;
            case 4:
                //参赛人数已满
                WindowManager_1.default.ShowTip("参赛人数已满");
                break;
        }
    }
    //重新启动
    reStartGame() {
    }
    //初始化UI层
    initLayer() {
        WindowManager_1.default.rootLayer = new Laya.Sprite();
        WindowManager_1.default.rootLayer.x += ScreenAdapterTools_1.default.sceneOffsetX;
        WindowManager_1.default.rootLayer.y += ScreenAdapterTools_1.default.sceneOffsetY;
        Laya.stage.addChild(WindowManager_1.default.rootLayer);
        WindowManager_1.default.commonUILayer = new Laya.Sprite();
        WindowManager_1.default.commonUILayer.size(ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height);
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.commonUILayer);
        WindowManager_1.default.topUILayer = new Laya.Sprite();
        WindowManager_1.default.topUILayer.size(ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height);
        WindowManager_1.default.topUILayer.mouseEnabled = true;
        WindowManager_1.default.topUILayer.mouseThrough = true;
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.topUILayer);
        WindowManager_1.default.guideLayer = new Laya.Sprite();
        WindowManager_1.default.guideLayer.size(ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height);
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.guideLayer);
        WindowManager_1.default.guideLayer.mouseEnabled = true;
        WindowManager_1.default.guideLayer.mouseThrough = true;
        WindowManager_1.default.guideLayer.visible = false;
        WindowManager_1.default.highLayer = new Laya.Sprite();
        WindowManager_1.default.highLayer.size(ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height);
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.highLayer);
        WindowManager_1.default.toolsLayer = new Laya.Sprite();
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.toolsLayer);
        WindowManager_1.default.maskLayer = new Laya.Sprite();
        WindowManager_1.default.maskLayer.size(ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height);
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.maskLayer);
        WindowManager_1.default.tipsLayer = new Laya.Sprite();
        WindowManager_1.default.tipsLayer.size(ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height);
        WindowManager_1.default.tipsLayer.mouseEnabled = false;
        WindowManager_1.default.tipsLayer.mouseThrough = true;
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.tipsLayer);
        //最顶层2级容器（越高级优先级越高）
        WindowManager_1.default.debugLayer = new Laya.Sprite();
        WindowManager_1.default.rootLayer.addChild(WindowManager_1.default.debugLayer);
        LogsManager_1.default.initLogPanel();
        LogsManager_1.default.addTouchShow(Laya.stage);
        if (UserInfo_1.default.isWeb()) {
            var urlParam = window.location.href.indexOf('test=1') > 0;
            LogsManager_1.default.echo(">>>>urlParam>>>>>>", urlParam);
            GameSwitch_1.default.switchMap.SWITCH_GM_DEBUG = 1;
            GameSwitch_1.default.switchMap.SWITCH_CD_DEBUG = 1;
        }
        //延迟一帧显示loading
        var delayShowLoading = () => {
            WindowManager_1.default.ShowLoadingUI(null);
        };
        //web版因为有loginui. 所以不能延迟一帧显示loading.否则loading会盖住login
        if (UserInfo_1.default.isWeb()) {
            WindowManager_1.default.ShowLoadingUI(null);
        }
        else {
            TimerManager_1.default.instance.add(delayShowLoading, null, 10, 1);
        }
        //只有native才填充黑边
        if (UserInfo_1.default.isSystemNative()) {
            //判断是否填充黑边
            ScreenAdapterTools_1.default.checkFillBorder();
        }
    }
    onTTShow() {
        LogsManager_1.default.echo("yrc onTTShow");
        if (!UserInfo_1.default.platform.isPlayVideo) {
            //不播放视频广告的时候才播BGM
            if (WindowManager_1.default.isUIOpened(WindowCfgs_1.WindowCfgs.GameMainUI)) {
                LogsManager_1.default.echo("yrc have GameMainUI");
                SoundManager_1.default.stopMusic();
                SoundManager_1.default.playBGM(MusicConst_1.MusicConst.MUSIC_BGM);
            }
            else {
                LogsManager_1.default.echo("yrc have not GameMainUI");
                SoundManager_1.default.playBGM();
            }
        }
    }
    gameClose() {
        UtilsServer_1.default.exitGame({}, () => {
        }, this);
    }
    /**开始播放BGM */
    playBGM() {
        SoundManager_1.default.playBGM(MusicConst_1.MusicConst.MUSIC_BGM);
    }
    /**暂停BGM */
    stopBGM() {
        SoundManager_1.default.stopMusic();
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            case MsgCMD_1.default.GAME_ONSHOW:
                this.onTTShow();
                break;
            case MsgCMD_1.default.VIDEO_PLAY:
                this.playBGM();
                break;
            case MsgCMD_1.default.VIDEO_STOP:
                this.stopBGM();
                break;
            case MsgCMD_1.default.CLIENT_SEND_LOG:
                LogsManager_1.default.sendAndShowLog();
                break;
        }
    }
}
exports.default = MainModule;
MainModule.task_sceneComplete = "task_sceneComplete"; //任务场景加载完成
MainModule.task_updateListerner = "task_updateListerner"; //任务版本检查完成
MainModule.task_subpackage = "task_subpackage"; //分包加载完成
MainModule.task_configsloaded = "task_configsloaded"; //配置加载完成
MainModule.task_onloginResult = "task_onloginResult"; //登入完成
MainModule.task_mergeFileBack = "task_mergeFileBack"; //文件合并回来
MainModule.task_kariquLogin = "task_kariquLogin"; //卡日曲登录结果
MainModule.showMainTask = 6; // 进主界面6个任务, 1,版本检查结束, 2, 312登入初始化完成, 3,fileconfig.json加载完成 4.分包下载完成 ,5.合并文件完成,6卡日曲登录回调 7获取系统信息完成(只有android和ios有)
//# sourceMappingURL=MainModule.js.map