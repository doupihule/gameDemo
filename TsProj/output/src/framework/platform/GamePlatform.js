"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../../utils/Global");
const HttpMessage_1 = require("../common/HttpMessage");
const PackConfigManager_1 = require("../manager/PackConfigManager");
const TimerManager_1 = require("../manager/TimerManager");
const UserInfo_1 = require("../common/UserInfo");
const LogsManager_1 = require("../manager/LogsManager");
const CacheManager_1 = require("../manager/CacheManager");
const ErrCodeManager_1 = require("../manager/ErrCodeManager");
const ErrorCode_1 = require("../../game/sys/common/kakura/ErrorCode");
const MainModule_1 = require("../manager/MainModule");
const Client_1 = require("../common/kakura/Client");
const UserModel_1 = require("../../game/sys/model/UserModel");
const VersionManager_1 = require("../manager/VersionManager");
const PackageConfig_1 = require("../../game/sys/config/PackageConfig");
const GameSwitch_1 = require("../common/GameSwitch");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
const StorageCode_1 = require("../../game/sys/consts/StorageCode");
const ModelToServerMap_1 = require("../../game/sys/consts/ModelToServerMap");
const SingleCommonServer_1 = require("../server/SingleCommonServer");
const TableUtils_1 = require("../utils/TableUtils");
const ChannelConst_1 = require("../../game/sys/consts/ChannelConst");
const InterstitialAdComp_1 = require("./comp/InterstitialAdComp");
const BannerComp_1 = require("./comp/BannerComp");
const JumpFunc_1 = require("../func/JumpFunc");
const KariqiShareManager_1 = require("../manager/KariqiShareManager");
const GameUtils_1 = require("../../utils/GameUtils");
const Message_1 = require("../common/Message");
const CommonEvent_1 = require("../event/CommonEvent");
const TranslateFunc_1 = require("../func/TranslateFunc");
const WindowManager_1 = require("../manager/WindowManager");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const StatisticsCommonConst_1 = require("../consts/StatisticsCommonConst");
const ControlConst_1 = require("../consts/ControlConst");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
const NativeBridge_1 = require("../native/NativeBridge");
const JSToNativeEvent_1 = require("../event/JSToNativeEvent");
const GameHttpControler_1 = require("../common/GameHttpControler");
const BattleFunc_1 = require("../../game/sys/func/BattleFunc");
class GamePlatform {
    constructor() {
        //应用平台ID
        this.appId = "";
        //平台用户数据
        this.userInfoData = null;
        //平台给的userid 唯一标识符
        this.channelUserId = "";
        this._isSubPackage = false;
        this._isPhotosAlbum = false;
        this._shareTime = 0;
        this._speShareTime = 0; //用作记录特殊假分享的时间，第二次失败
        this._isLastSpeShare = false; //用来判断上次是否为特殊假分享二次失败
        this._isShare = false;
        this._videoLoaded = false;
        this.curReqGlobalCount = 0;
        this.maxReqGlobalCount = 5;
        this.isOutTime = false; //判断版本更新监听是否超时
        this.versionCheckResult = 1; // 0 未检查, 1 无新版本, 2 有新版本
        //剩余等待的任务数量,  当都完成时 就可以开始正式链接wss，目前只有一条
        this._leftWaitTask = 2;
        this.inviteBy = "";
        this.shareInfo = "";
        this.isPlayVideo = false;
        this.isDoWxThings = false;
        /**当前是否有可分享的剪辑视频 */
        this.isHaveRecord = false;
        this.loadAdvFailed = true;
        /**
        * vivo平台视频广告只能显示一次。需要重新架子啊
        */
        this.advHasShow = false;
        this.isHide = false;
        // 广告状态 0 是空闲状态, 1是播放中
        this.videoState = 0;
        this.clientInfoReqCount = 0;
        /** 审核服域名 */
        this.global_url_review = '';
        //重登次数
        this._reloginCount = 0;
        this.RECORD_TYPE_AUTO = 1; //自动录屏
        this.RECORD_TYPE_MANUAL = 2; //手动录屏
        this.tempPushDic = {};
        this.tempClearPushDic = {};
        /**
             * 判断是否可以分享录屏
             */
        this._canShareVideoRt = null;
        //设置低帧率模式
        this.setGameFrame();
        // 初始化渠道参数
        if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).appId) {
            this.appId = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).appId;
        }
        if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adVideoId) {
            this._videoId = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adVideoId;
        }
        if (GameSwitch_1.default.getSwitchState(GameSwitch_1.default.VIDEO_ID)) {
            this._videoId = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.VIDEO_ID);
        }
        if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).appSid) {
            this._appSid = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).appSid;
        }
        if (UserInfo_1.default.isSystemNative()) {
            var adapterData = {
                width: ScreenAdapterTools_1.default.width,
                height: ScreenAdapterTools_1.default.height,
                designWidth: ScreenAdapterTools_1.default.designWidth,
                designHeight: ScreenAdapterTools_1.default.designHeight,
                scale: ScreenAdapterTools_1.default.height / ScreenAdapterTools_1.default.stageHeight
            };
            NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.VIEWADAPTER_INIT, adapterData, true);
        }
    }
    /**阿拉丁数据打点 */
    aldSendEvent(eventId, eventData = {}) { }
    /**
         * 初始化平台信息
         */
    initPlatform() { }
    reqServerList(callBack, thisObject) {
        var params = { "method": 251, "params": { "loginToken": this.loginToken } };
        var url = Global_1.default.global_url + '&ver=' + Global_1.default.version;
        HttpMessage_1.default.instance.send(url, JSON.stringify(params), (data) => {
            var secList = data[0].result.data.secList;
            var len = secList.length;
            var pData;
            for (var i = 0; i < len; i++) {
                var secData = data[0].result.data.secList[i];
                if (secData.mainSec == 1) {
                    pData = data[0].result.data.secList[i];
                    break;
                }
            }
            PackConfigManager_1.default.ins.platform = pData;
            callBack && callBack.call(thisObject, data[0].result.data);
        }, this, "post");
    }
    /**
     * 请求VMS
     * @param callBack
     * @param thisObject
     */
    /**
         * 请求VMS
         * @param callBack
         * @param thisObject
         */
    reqVMS() {
        Global_1.default.version = PackConfigManager_1.default.ins.platform.vms_version;
        if (Global_1.default.checkUserCloudStorage()) {
            Global_1.default.global_url = PackConfigManager_1.default.ins.platform.cloud_url;
            //如果是单机模式 直接走global登入
            this.getWxInfo();
            return;
        }
        //如果是正式版 直接checkVersion
        if (PackageConfig_1.default.configData) {
            this.checkVersion();
        }
        else {
            var url = PackConfigManager_1.default.ins.platform.vms_url + '?mod=vms&r=gameApi/getOnlineVersion&upgrade_path=' + PackConfigManager_1.default.ins.platform.upgrade_path;
            HttpMessage_1.default.instance.send(url, null, this.checkVMSBack, this);
        }
    }
    //版本检查回来
    checkVMSBack(result) {
        var version = result.online_version;
        LogsManager_1.default.echo("online_version:", version, "local vms_version", PackConfigManager_1.default.ins.platform.vms_version);
        LogsManager_1.default.echo("client_version:", Global_1.default.client_version);
        version = Math.max(version, PackConfigManager_1.default.ins.platform.vms_version);
        PackConfigManager_1.default.ins.platform.vms_version = version;
        this.checkVersion();
    }
    /**
     * 检查版本号
     */
    checkVersion() {
        var url = PackConfigManager_1.default.ins.platform.vms_url + '?mod=vms&r=gameApi/checkVersion&ver=' + PackConfigManager_1.default.ins.platform.vms_version;
        HttpMessage_1.default.instance.send(url, null, this.checkVersionCallback, this);
    }
    checkVersionCallback(result) {
        LogsManager_1.default.echo(null == undefined, "___null undefined");
        // 如果返回值没有s 状态字段
        if (result.s == null || !result.global_server_url || !result.v.version) {
            LogsManager_1.default.errorTag(null, JSON.stringify(result));
            ErrCodeManager_1.default.ins.setErr(ErrorCode_1.default.sys_error);
            return;
        }
        if (result.global_server_url.indexOf("http://") > -1 || result.global_server_url.indexOf("https://") > -1) {
            Global_1.default.global_url = result.global_server_url;
        }
        else {
            Global_1.default.global_url = "http://" + result.global_server_url;
        }
        if (result.GameStatic) {
            //version里面的开关覆盖
            GameSwitch_1.default.coverServerSwitchMap(result.GameStatic);
        }
        Global_1.default.resource_url = result.resource_url_root + "/" + UserInfo_1.default.platformId + "/";
        ;
        Global_1.default.nocdn_resource_url = result.nocdn_resource_url_root + "/";
        // 记录版本状态 (代码更新是否重启、是否下载version.json时用)
        VersionManager_1.default.versionStatus = result.s;
        VersionManager_1.default.vmsVersion = result.v.version;
        if (result.s == VersionManager_1.default.VERSION_STATUS_FORCE_UPDATE) {
            // 强更使用vms版本
            // Global.version = result.v.version;
            this.doCoverVersion(result.v.version);
        }
        LogsManager_1.default.echo("Global.version:", Global_1.default.version, "localVersion:", PackConfigManager_1.default.ins.platform.vms_version, "updateSatus:", result.s);
        this.addUpdateListener();
        //联网模式也需要执行卡日曲登录        
        KariqiShareManager_1.default.kariquLogin();
    }
    //对应平台版本更新检查 默认是不做的 暂时只有微信处理 微信平台需要重写这个方法
    addUpdateListener() {
        this.getNetwork();
        //版本更新检查完毕后开始初始化资源
        MainModule_1.default.instance.checkSystem();
    }
    reqGlobal(params, isInit = false) {
        this._reloginCount++;
        var url = Global_1.default.global_url + '&ver=' + Global_1.default.version;
        //@测试代码 强制服务器错误返回
        // if(this._reloginCount <= 1){
        //     params.method = "208"
        // }
        this._globalParams = params;
        if (!params["params"]) {
            params["params"] = {};
        }
        var onHttpErrorBack = (data) => {
            if (Global_1.default.checkUserCloudStorage()) {
                //如果是使用httpServer的重连.那么必须要强制登入成功
                if (this._reLoginBackParams) {
                    WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("tid_net_error"), this.getWxInfo, this);
                }
                else {
                    this.doSingleErrorBack();
                }
            }
            else {
                ErrCodeManager_1.default.ins.setErr(ErrorCode_1.default.sys_error);
            }
        };
        var httpBackFunc = (data) => {
            if (!data || typeof (data) == "string" || !data[0]) {
                onHttpErrorBack(data);
                return;
            }
            var currPlatform = data[0];
            data = currPlatform.result.data;
            if (currPlatform.serverInfo && currPlatform.serverInfo.serverTime) {
                Client_1.default.instance.updateServerTime(currPlatform.serverInfo.serverTime);
            }
            if (this._reLoginBackParams) {
                this.onReLoginBack(data);
                return;
            }
            //阿拉丁上报openid
            LogsManager_1.default.echo('=====================ald相关');
            if (UserInfo_1.default.isWX() && data.channelUserId) {
                // LogsManager.echo("ald上报OpenId:", data.channelUserId);
                // this.getWX().aldSendOpenid(data.channelUserId);
            }
            if (data.sceneId) {
                Global_1.default.sceneId = data.sceneId;
            }
            if (!currPlatform.result) {
                onHttpErrorBack(data);
                return;
            }
            if (data.adParam) {
                if (data.adParam.appId) {
                    // 由于之前未考虑多平台oppoAppId改为appId
                    this.appId = data.adParam.appId;
                }
                if (data.adParam.adUnitId) {
                    this._videoId = data.adParam.adUnitId;
                }
                if (data.adParam.adBannerId) {
                    BannerComp_1.BannerComp._bannerId = data.adParam.adBannerId;
                }
                if (data.adParam.adInterstitialId) {
                    InterstitialAdComp_1.InterstitialAdComp._interstitialId = data.adParam.adInterstitialId;
                }
            }
            this.loginToken = data.loginToken;
            if (Global_1.default.checkUserCloudStorage()) {
                GameHttpControler_1.default.instance.loginToken = data.loginToken;
                this.doSingleGlobalBack(currPlatform.result.data);
                return;
            }
            //是否是新账户
            if (currPlatform.result.data["isNewAccount"]) {
                UserInfo_1.default.isNewAccount = true;
            }
            //wx是开发还是体验还是正式版
            if (UserInfo_1.default.isWX()) {
                UserInfo_1.default.wxVersionType = data.version_type;
            }
            var secList = data.secList;
            var len = secList.length;
            var pData;
            for (var i = 0; i < len; i++) {
                var secData = secList[i];
                if (secData.mainSec == 1) {
                    pData = secList[i];
                    break;
                }
            }
            if (!pData) {
                LogsManager_1.default.errorTag("globalServerError", "global请求异常");
                WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#tid_net_error"), this.onGlobalError, this);
                return;
            }
            PackConfigManager_1.default.ins.platform = pData;
            this.getLoginResult();
        };
        var webParams = {};
        if (Global_1.default.checkUserCloudStorage()) {
            url = Global_1.default.global_url;
            params.params.game = GameConsts_1.default.gameCode;
            params.params.platform = PackConfigManager_1.default.ins.platform.platform;
            params.params.version = Global_1.default.version;
            webParams.errorCall = onHttpErrorBack;
        }
        else {
            params.params.game = GameConsts_1.default.gameCode;
            params.params.platform = PackConfigManager_1.default.ins.platform.platform;
            params.params.version = Global_1.default.version;
        }
        params["params"]["deviceId"] = Global_1.default.deviceId;
        HttpMessage_1.default.instance.send(url, params, httpBackFunc, this, "post", webParams);
    }
    //重登回来
    onReLoginBack(data) {
        GameHttpControler_1.default.instance.loginToken = data && data.loginToken;
        LogsManager_1.default.echo("data.loginToken", data.loginToken);
        var params = this._reLoginBackParams;
        this._reLoginBackParams = null;
        params.callBack.call(params.thisObj, data);
    }
    //global请求失败后重新请求
    onGlobalError() {
        this.reqGlobal(this._globalParams);
    }
    /**globa请求完成后执行下一步 */
    getLoginResult() { }
    sendKakuraInit() {
        //单机模式不走这里
        if (Global_1.default.checkUserCloudStorage()) {
            if (this.platformUserInfo) {
                var userData = UserModel_1.default.instance.getData();
                //如果授权成功了
                if (this.platformUserInfo.name) {
                    userData.name = this.platformUserInfo.name;
                    userData.userInfo = this.platformUserInfo;
                    UserInfo_1.default.userSex = this.platformUserInfo.sex;
                }
            }
            return;
        }
        var myThis = this;
        Client_1.default.instance.sendInit(myThis.loginToken, myThis.platformUserInfo, MainModule_1.default.instance.loginResult, MainModule_1.default.instance, myThis.inviteBy, myThis.shareInfo);
    }
    //重新登入
    reRequestGlobal(callBack = null, thisObj = null) {
        if (callBack) {
            this._reLoginBackParams = {
                callBack: callBack,
                thisObj: thisObj
            };
        }
        //如果是微信平台 这里需要重新走一次微信登入 
        this.getWxInfo();
    }
    //单机模式error返回
    doSingleErrorBack() {
        //如果次数为0
        if (this._reloginCount == 1) {
            LogsManager_1.default.echo("第一次登入失败尝试重新登入");
            this.getWxInfo();
            return;
        }
        //做空数据回调. 这时候会优先判断本地是否有数据
        this.doSingleGlobalBack({ sendTime: 0, uid: "nologin" }, true);
    }
    //单机模式global返回 isError 是否error返回
    doSingleGlobalBack(data, isError = false) {
        //如果是审核服版本 那么重新发送一次globalsever
        if (data.switch) {
            GameSwitch_1.default.coverServerSwitchMap(data.switch);
            if (data.switch.CLOUD_URL && (UserInfo_1.default.platform.global_url_review == "" || UserInfo_1.default.platform.global_url_review != data.switch.CLOUD_URL)) {
                // Global.global_url_review 用于记录审核服主域名【用于区别负载域名】
                UserInfo_1.default.platform.global_url_review = Global_1.default.global_url = data.switch.CLOUD_URL;
                //重新走一次登入
                this.reqGlobal(this._globalParams);
                return;
            }
            if (data.switch.FORCE_UPDATE) {
                VersionManager_1.default.versionStatus = Number(data.switch.FORCE_UPDATE);
            }
        }
        // 登陆返回重置global域名
        if (data.lvsUrl && data.lvsUrl != "") {
            Global_1.default.global_url = data.lvsUrl;
        }
        //做版本更新检查
        this.doCoverVersion(data.onlineVersion);
        var isFirstLogin = Client_1.default.instance.globalLoginBackData == null;
        var resultData = data;
        Client_1.default.instance.hasLoginComplete = !isError;
        Client_1.default.instance.globalLoginBackData = resultData;
        //设置用户openId
        if (resultData.channelUserId) {
            UserInfo_1.default.channelUserId = resultData.channelUserId;
        }
        //卡日曲登录        
        KariqiShareManager_1.default.kariquLogin();
        //如果是调试开关的
        if (data && ((data.user && data.user.isTestAccount) || data.isTestAccount)) {
            //显示日志窗口
            LogsManager_1.default.sendErrorToPlatform("发送客户端错误日志", LogsManager_1.default.errorTage_clientLog, 200, "sendClientError");
            LogsManager_1.default.setLogGroupVisible(true);
        }
        if (data != null && this.checkHasUserData(data.user)) {
            this.checkHasUpdateData(data.user);
        }
        //首次登入 需要做的事情
        if (isFirstLogin) {
            //开始版本更新检查
            this.addUpdateListener();
        }
        else {
            //如果没有错误 那么需要同步一下rid 
            if (!isError) {
                var userdata = UserModel_1.default.instance.getData();
                if (userdata) {
                    userdata.uid = data.uid;
                    userdata._id = data.uid;
                }
            }
            //走重登回来
            Client_1.default.instance.onReloginBack(data, isError);
        }
    }
    //判断是否有用户数据
    checkHasUserData(userData) {
        if (!userData) {
            return false;
        }
        if (userData.uid || userData.sendTime != null) {
            return true;
        }
        ;
        return false;
    }
    //比对数据
    compareData(data) {
        if (!Global_1.default.checkUserCloudStorage()) {
            return;
        }
        var localData = CacheManager_1.default.instance.getGlobalCache(StorageCode_1.default.storage_userinfo);
        if (!localData || localData == "0") {
            //如果服务器有数据了 但是本地没数据 那么直接用服务器的
            // if (data.user &&  (data.user.rid || data.user._id) ) {
            if (this.checkHasUserData(data.user)) {
                localData = data.user;
                LogsManager_1.default.echo("_线上服务器有数据,本地没数据");
                // LogsManager.errorTag("dataSync","_线上服务器有数据,本地没数据", JSON.stringify(data));
            }
            else {
                localData = ModelToServerMap_1.default.initBuildUserData();
            }
            //如果没有发送时间  那么初始化时间
            if (!localData.sendTime) {
                localData.sendTime = 0;
            }
            //如果没数据 那么记录上次保存的时间为0
            // localData = ModelToServerMap.initBuildUserData();
        }
        else {
            try {
                localData = JSON.parse(localData);
            }
            catch (e) {
                localData = ModelToServerMap_1.default.initBuildUserData();
            }
        }
        var userData = data.user;
        if (this.checkHasUserData(userData)) {
            this.checkHasUpdateData(userData);
            var deleteData = TableUtils_1.default.findNullKey(userData, {});
            // 检查服务器是否有null字段
            if (!TableUtils_1.default.isEmptyTable(deleteData)) {
                var params = {
                    clientDirty: { u: {}, d: deleteData }
                };
                Client_1.default.instance.send("349", params, null, null);
                LogsManager_1.default.errorTag("dataNullValue", "玩家数据有空字段," + TableUtils_1.default.safelyJsonStringfy(deleteData));
            }
        }
        else {
            userData = localData;
        }
        if (!localData.sendTime) {
            localData.sendTime = 0;
        }
        SingleCommonServer_1.default._lastBackUpData = {};
        TableUtils_1.default.deepCopy(userData, SingleCommonServer_1.default._lastBackUpData);
        if (userData.sendTime < localData.sendTime) {
            var isUserLocalData = true;
            if (userData.sendTime > 0 && localData.sendTime > 0) {
                var dt = localData.sendTime - userData.sendTime;
                //如果这个时间 异常 用服务器数据
                if (dt > 1 * 365 * 24 * 3600) {
                    LogsManager_1.default.errorTag("userDataError", "用户时间戳错误,", localData.sendTime);
                    isUserLocalData = false;
                }
            }
            LogsManager_1.default.warn("userData:", "本地缓存的数据比服务器的数据新,采用本地数据");
            if (isUserLocalData) {
                userData = localData;
            }
        }
        TableUtils_1.default.adjustEmptyArr(userData);
        //uid 和 isNewAccount赋值
        userData.uid = data.uid;
        userData._id = data.uid;
        userData.isNewAccount = data.isNewAccount;
        //
        var resultData = data;
        resultData.user = userData;
        if (!userData.firstRunSystemInfo) {
            userData.firstRunSystemInfo = Global_1.default.firstRunSystemInfo;
        }
        else {
            Global_1.default.firstRunSystemInfo = userData.firstRunSystemInfo;
        }
        // kakura.Client.instance.hasLoginComplete = !isError;
        // kakura.Client.instance.globalLoginBackData = resultData;
        // if (!hasUpdateData) {
        //     var tmpTable = {};
        //     TableUtils.deepCopy(userData, tmpTable)
        //     tmpTable["hasUpdateData"] = true;
        //     SingleCommonServer.upDateAllData(tmpTable, SingleCommonServer.setUpdateDataFlag, SingleCommonServer);
        // }
        if (resultData.switch && !Global_1.default.checkIsSingleMode()) {
            GameSwitch_1.default.coverServerSwitchMap(resultData.switch);
        }
    }
    checkHasUpdateData(userData) {
        var hasUpdateData;
        if (userData && userData.uid) {
            hasUpdateData = userData.hasUpdateData;
        }
        else {
            hasUpdateData = false;
        }
        SingleCommonServer_1.default.hasUpdateAllData = hasUpdateData;
    }
    //覆盖版本号
    doCoverVersion(serverVersion) {
        if (!serverVersion) {
            return;
        }
        Global_1.default.version = String(serverVersion);
    }
    //获取version name
    getVersionName() {
        return "version.json";
    }
    /**
     * 请求公告数据
     * @param callBack
     * @param thisObject
     */
    getWX() { return ControlConst_1.default.emptyTable; }
    registerAd() { }
    /**移除微信登陆授权按钮 */
    removeLoginBtn() { }
    createSpeLoginBtn(posX, posY, btnW, btnH, callBack, thisObject) {
        var tempFunc = () => {
            if (callBack) {
                // callBack.call(thisObject,-1);
                callBack.call(thisObject, { userInfo: { nickName: UserInfo_1.default.channelUserId } });
            }
        };
        //非授权界面 直接2秒后授权成功
        LogsManager_1.default.echo("xd 没有授权系统,直接2秒后授权成功");
        TimerManager_1.default.instance.add(tempFunc, this, 2000, 1);
    }
    setSystemInfo() { }
    //设置系统信息
    getSystemInfo() { }
    getLaunchOptionsSync(callback, thisObj) { callback.call(thisObj); }
    getWxInfo() { }
    /** 初始化平台数据:广告、分享等 */
    initPlatformData() { }
    /**获取网络状态 */
    getNetwork() { }
    sharePage() { }
    showVideoAd(successCallBack = null, closeCallBack = null, thisObj = null, extraData = {}) {
    }
    loadVideoAd() { }
    /**设置用户来源 */
    setUserComeFrom() { }
    createLoginButton(callBack, thisObject) { callBack && callBack.call(thisObject); }
    /**
     * 用户登录
     */
    login(type) { }
    /**
     * 退出游戏
     */
    loginOut() { Global_1.default.isGameDestory = true; }
    /**
     * 分享
     * @param
     */
    share(id = "", extraData = {}, callback = null, thisObj = null) { }
    shareDynamicAppMessage(data, shareCallBack, activityId) { }
    onShareComplete(shareResult) { }
    ;
    /**
     * 发送到桌面
     */
    sendToDesktop(callback) { }
    /**
     * 支付接口
     * @param id
     * @param name
     * @param price
     * @param count
     * @param type
     */
    pay(id, name, price, count, type) { }
    registerRecord() { }
    recordStart(callback = null, thisObj = null, endCallback = null, durT = 120, recordTimeRange = null, recordType = this.RECORD_TYPE_AUTO) { }
    /**结束录屏 */
    recordStop(recordType = this.RECORD_TYPE_AUTO) { }
    /**对剪辑的视频进行分享 */
    shareVideo(callBack = null, thisObj = null) { }
    recordPause() { }
    recordResume() { }
    /** 头条创建互推按钮 */
    createMoreGamesButton() { }
    /** 头条显示互推列表 */
    showMoreGamesModal(data = null) { }
    jumpToPayXCX(data, succCall = null, failCall = null, thisObj = null) { }
    /**是否有可分享的录屏 */
    //改变剩余的任务数，目前只有一条，
    changeLeftTask(value, tag = null) {
        this._leftWaitTask += value;
        LogsManager_1.default.echo("yrc changeLeftTask", value, this._leftWaitTask, tag);
        if (this._leftWaitTask == 0) {
            this.getUserInfoAndReq();
        }
    }
    isCanShareVideo() { return false; }
    //初始化平台用户id
    initChannelUserId(cuid) {
        if (!cuid) {
            LogsManager_1.default.errorTag(null, "没有设置uid");
            return;
        }
        this.channelUserId = cuid;
        //通知缓存管理器设置rid
        CacheManager_1.default.instance.setRid(cuid);
    }
    /**获取用户设置、信息，执行kakura init */
    getUserInfoAndReq() {
    }
    /**
     * 震动效果
     * isLong 是否为长震动，true为长震动，false为短震动
     * callback内带参数isSuc,表示接口调用的结果
     */
    vibrate(isLong = false, callBack = null, thisObject = null) { callBack && callBack.call(thisObject, true); }
    /**执行count次的短震 */
    vibrateByCount(count) {
        var myThis = this;
        var index = 0;
        var obj = { count: count, index: index };
        myThis.vibrate(false);
        index++;
        if (count <= 1) {
            return;
        }
        Laya.timer.loop(16, obj, function () {
            myThis.vibrate(false);
            index++;
            if (index >= count) {
                Laya.timer.clearAll(obj);
            }
        });
    }
    setVersionCheckResult(num) {
        this.versionCheckResult = num;
        LogsManager_1.default.echo("versionCheckResult:", num);
    }
    getVersionCheckResult() {
        return this.versionCheckResult;
    }
    //转化渠道用户信息
    turnChannelUserInfo(userInfo) {
        this.platformUserInfo = { "name": userInfo.nickName, "headImage": userInfo.avatarUrl, "sex": userInfo.gender, "province": userInfo.province, "city": userInfo.city, "country": userInfo.country };
        var userData = UserModel_1.default.instance.getData();
        //如果授权成功了
        if (this.platformUserInfo.name) {
            userData.name = this.platformUserInfo.name;
            userData.userInfo = this.platformUserInfo;
            UserInfo_1.default.userSex = this.platformUserInfo.sex;
        }
    }
    //设置游戏帧率
    setGameFrame() {
        if (GameConsts_1.default.gameFrameRate == 30) {
            Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
            LogsManager_1.default.echo("zm setGameFrame: ", Laya.stage.frameRate);
        }
        else if (GameConsts_1.default.gameFrameRate == 60) {
            Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
        }
        //初始化battklefunc 帧率相关数据
        if (BattleFunc_1.default["initFrameDates"]) {
            BattleFunc_1.default["initFrameDates"]();
        }
    }
    /**测试同步获取系统信息 */
    testSystemInfoSync() { }
    /**显示游戏圈按钮 */
    showGameClubBtn(posX, posY, btnW, btnH) { }
    hideGameClubBtn() { }
    destroyGameClubBtn() { }
    /**打开客服 */
    openCustomerService(isShowCard = false) { }
    /**显示模态对话框，即弹窗 */
    showPopTip(title, content, extraData = null) {
        var onSureBack = (rt) => {
            extraData.success.call(null, rt);
        };
        var onCancleBack = (rt) => {
            extraData.success.call(null, rt);
        };
        WindowManager_1.default.setPopupTip(2, content, onSureBack, this, title, onCancleBack);
    }
    /**显示消息提示框 */
    showFlyTip(title, icon = "none") { }
    /**
     * 调用wx系源生接口，只做加载即完成后的回调
     * @param packageName 需要加载的分包名
     * @param callback 加载完成后的回调，成功传true，失败传false
     * @param thisObj
     * @param isShowPop 加载失败是否弹出弹窗，继续加载
     */
    loadSubPackage(packageName, callback, thisObj, isShowPop = false) { }
    /**跳转到其他小程序 */
    jumpToMiniProgram(data) { }
    initPhysics3D(message) {
        //同时开始加载lib库
        if (!GameConsts_1.default.isUsePhysics) {
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_subpackage, "not use physics");
            return;
        }
        if (window["Physics3D"]) {
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_subpackage, "has use physics");
            return;
        }
        LogsManager_1.default.echo("_startInitPhysics3d--");
        window["loadLib"]("libs/laya.physics3D.js");
        var code;
        var tempFunc = () => {
            var physics3D = window["Physics3D"];
            if (!physics3D) {
                LogsManager_1.default.echo("Physics3D is not init");
                return;
            }
            TimerManager_1.default.instance.remove(code);
            Laya3D["_enbalePhysics"] = true;
            physics3D(GameConsts_1.default.defaultPhysicsMemory * 1024 * 1024).then(() => {
                //这里需要重新赋值
                if (window["__physics3D"]) {
                    Laya3D["_physics3D"] = window["__physics3D"];
                }
                else {
                    LogsManager_1.default.errorTag("physics", "全局没有找到物理库对象");
                }
                LogsManager_1.default.echo("xd 物理引擎初始化完毕");
                MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_subpackage, message);
            });
        };
        code = TimerManager_1.default.instance.add(tempFunc, this, 10, 9999, false);
        tempFunc();
    }
    /**
     * 对比版本号
     */
    compareVersion(v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');
        const len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            const num1 = parseInt(v1[i]);
            const num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            }
            else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }
    /**
     * 是否可以开启互推功能，各平台自己添加判断。默认互推关闭
     */
    canUseJump() {
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_SHOWJUMP)) {
            LogsManager_1.default.echo('hlx 互推禁用：互推开关关闭');
            return false;
        }
        if (UserInfo_1.default.isOppo() && GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_OPPO_REVIEW)) {
            LogsManager_1.default.echo('hlx 互推禁用：审核模式无互推');
            return false;
        }
        if (!(UserInfo_1.default.isTT() || UserInfo_1.default.isWX() || UserInfo_1.default.isBaidu()) || UserInfo_1.default.isOppo()) {
            LogsManager_1.default.echo('hlx 互推禁用：该平台不支持互推');
            return false;
        }
        if (UserInfo_1.default.isTT()) {
            if (!this.getWX().showMoreGamesModal) {
                LogsManager_1.default.warn("hlx 头条互推禁用 showMoreGamesModal not support");
                return false;
            }
            if (UserInfo_1.default.platform.getSystemInfo().platform == "ios") {
                LogsManager_1.default.echo('hlx 头条互推禁用：IOS不支持头条互推');
                return false;
            }
            if (JumpFunc_1.JumpFunc.instance.getJumpList().length == 0) {
                LogsManager_1.default.warn("hlx 头条互推禁用 互推Jump表未配置，请联系管理员配置");
                return false;
            }
        }
        else if (UserInfo_1.default.isBaidu()) {
            if (JumpFunc_1.JumpFunc.instance.getJumpList().length == 0) {
                LogsManager_1.default.warn("hlx 百度互推禁用 互推Jump表未配置，请联系管理员配置");
                return false;
            }
        }
        return true;
    }
    /** 添加到桌面 */
    addToDesktop(thisObj = null, successCall = null, failCall = null, channelParams = {}) { }
    /** 添加到桌面 */
    addToFavorite(thisObj = null, successCall = null, failCall = null, channelParams = {}) { }
    /**
         * 添加到桌面功能是否可用
         */
    canAddToDesktop() {
        if (!(UserInfo_1.default.isQQGame() || UserInfo_1.default.isBaidu() || UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo())) {
            LogsManager_1.default.echo('hlx 添加到桌面功能禁用：该平台不支持添加到桌面功能');
            return false;
        }
        if (this.getSystemInfo().platform && (this.getSystemInfo().platform == "ios" || this.getSystemInfo().platform == "devtools")) {
            LogsManager_1.default.echo('hlx 添加到桌面功能禁用：IOS不支持');
            return false;
        }
        if (UserInfo_1.default.isQQGame()) {
            if (!this.getWX().saveAppToDesktop) {
                LogsManager_1.default.echo('hlx 添加到桌面功能禁用：saveAppToDesktop不支持');
                return false;
            }
        }
        else if (UserInfo_1.default.isBaidu()) {
            if (typeof (this.getWX().showAddToDesktopGuide) != 'function') {
                LogsManager_1.default.echo('hlx 添加到桌面功能禁用：showAddToDesktopGuide不支持');
                return false;
            }
        }
        else if (UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo()) {
            if (!this.getWX().installShortcut) {
                LogsManager_1.default.echo('hlx 添加到桌面功能禁用：installShortcut不支持');
                return false;
            }
        }
        return true;
    }
    /**
        * 是否可以使用添加到小程序接口
        */
    canAddToFavorite() {
        if (!UserInfo_1.default.isBaidu()) {
            LogsManager_1.default.echo('hlx 添加到桌面功能禁用：该平台不支持添加到桌面功能');
            return false;
        }
        if (this.getSystemInfo().platform == "devtools") {
            LogsManager_1.default.echo('hlx 添加到桌面功能禁用：开发者工具无此功能');
            return false;
        }
        if ((typeof (this.getWX().showFavoriteGuide) != 'function')) {
            return false;
        }
        return true;
    }
    /**是否可以创建开放域 目前只有qq和微信可以，其余平台暂定，等接入时再测试 */
    canCreateDisPlayPbject() {
        if (UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame())
            return true;
        return false;
    }
    /**
         * 创建开放域
         */
    createDisplayObject(type, width, height, x = 0, y = 0) { }
    ;
    /**是否可以设置玩家数据 */
    canSetRankInfo() {
        if (UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame())
            return true;
        return false;
    }
    /**
         * 设置玩家数据
         */
    setUseRankInfo(data) { }
    /**
         * 是否从小程序收藏进入
         * 需要子平台重写判断各自场景值
         */
    isFromFavourite() {
        return true;
    }
    /**
         * 判断是否可以显示视频
         */
    canAdv() {
        if (!GameUtils_1.default.canVideo) {
            return false;
        }
        if (UserInfo_1.default.isWeb())
            return true;
        if (!this._videoId && !UserInfo_1.default.isUC()) {
            return false;
        }
        return true;
    }
    canShareVideo() {
        // 分享开关开启
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_SHAREVIDEO)) {
            LogsManager_1.default.echo("hlx 录屏功能禁用: 开关关闭");
            return false;
        }
        if (this._canShareVideoRt == null) {
            if (!UserInfo_1.default.isTT() && !UserInfo_1.default.isBaidu()) {
                LogsManager_1.default.echo("hlx 录屏功能禁用: 该平台不支持录屏");
                this._canShareVideoRt = false;
                return false;
            }
            if (UserInfo_1.default.isBaidu()) {
                var systemInfo = UserInfo_1.default.platform.getSystemInfo();
                if (systemInfo.host && systemInfo.host != 'baiduboxapp') {
                    // 只有手机百度app有分享录屏功能。
                    LogsManager_1.default.echo("hlx 录屏功能禁用: 百度渠道只有手百支持录屏", systemInfo.host);
                    this._canShareVideoRt = false;
                    return false;
                }
            }
            this._canShareVideoRt = true;
        }
        return this._canShareVideoRt;
    }
    /**
         * 判断是否可以分享
         */
    canShare() {
        if (UserInfo_1.default.isBaidu() || UserInfo_1.default.isTT() || UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo()) {
            LogsManager_1.default.echo("hlx 分享功能禁用: 该平台不开启分享功能：");
            return false;
        }
        // 分享开关开启
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_SHARE_NEW)) {
            LogsManager_1.default.echo("hlx 分享功能禁用: 分享开关关闭");
            return false;
        }
        return true;
    }
    /**
         * 弹出防沉迷弹窗
         */
    showAntiAddtionView() {
        return false;
    }
    /**
         * 获取系统信息
         */
    getLaunchOptions() {
        if (!this._launchOptions) {
            if ('function' == typeof this.getWX().getLaunchOptionsSync) {
                this._launchOptions = this.getWX().getLaunchOptionsSync();
                //通过订阅消息卡片进入游戏打点
                if (this._launchOptions.scene == "1014") {
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SUBSCRIBE_JOIN_GAME, {
                        msgId: this._launchOptions.query.msgId,
                    });
                }
                LogsManager_1.default.echo('_launchOptions', JSON.stringify(this._launchOptions));
            }
            else {
                LogsManager_1.default.echo('该平台不支持 getLaunchOptionsSync');
            }
        }
        return this._launchOptions;
    }
    /** 设置loading条进度：OPPO */
    setLoadingProgress(num) { }
    /** 隐藏laoding条：OPPO */
    hideLoadingProgress() { }
    /**
         * 加载视频成功后回调
         */
    afterVideoLoadCallBack() {
    }
    /**
     * 初始化客户端IP信息
     */
    initCityName() {
        // 除微信平台其他平台不需要初始化IP信息
        if (!UserInfo_1.default.isWX()) {
            return;
        }
        if (!GameConsts_1.default["OPEN_IP_LIST"]) {
            return;
        }
        if (this.cityName) {
            LogsManager_1.default.echo("hlx clientInfo已经初始化完毕，无需重复初始化", JSON.stringify(this.cityName));
        }
        else {
            var url = "https://pv.sohu.com/cityjson?ie=utf-8";
            HttpMessage_1.default.instance.sendOtherHttpRequest(url, null, this.initCityNameCallBack, this, "get", { errorCall: this.initCityNameErrorCallBack, contentType: "application/json" });
        }
        return;
    }
    initCityNameCallBack(data) {
        try {
            var isSuc = false;
            if (data) {
                var matchResult = data.match(/{.*}/);
                if (matchResult[0]) {
                    var jsonArray = JSON.parse(matchResult[0]);
                    if (jsonArray.cname) {
                        UserInfo_1.default.platform.cityName = jsonArray.cname;
                        isSuc = true;
                        Message_1.default.instance.send(CommonEvent_1.default.GET_IPINFO_SUCCESS);
                    }
                }
            }
            if (!isSuc) {
                UserInfo_1.default.platform.clientInfoReqCount++;
                if (UserInfo_1.default.platform.clientInfoReqCount >= 5) {
                    LogsManager_1.default.echo("hlx 获取IP所在城市5次重试错误，跳过", data);
                }
                else {
                    LogsManager_1.default.echo("hlx 获取IP所在城市格式有误，重试", UserInfo_1.default.platform.clientInfoReqCount, data);
                    UserInfo_1.default.platform.initCityName();
                }
            }
        }
        catch (e) {
            LogsManager_1.default.errorTag("get_cityname_error", e.toString());
        }
    }
    initCityNameErrorCallBack(error) {
        try {
            UserInfo_1.default.platform.clientInfoReqCount++;
            if (UserInfo_1.default.platform.clientInfoReqCount >= 5) {
                LogsManager_1.default.echo("hlx 获取IP所在城市5次重试错误，跳过", UserInfo_1.default.platform.clientInfoReqCount, error.toString());
                Message_1.default.instance.send(CommonEvent_1.default.GET_IPINFO_FAIL);
                return;
            }
            else {
                UserInfo_1.default.platform.initCityName();
            }
        }
        catch (e) {
            LogsManager_1.default.errorTag("get_cityname_error", e.toString());
        }
        return;
    }
    //判断是否授权了
    isAuthorized() {
        var data = UserModel_1.default.instance.getData();
        var uInfo = data.userInfo;
        //这里微信平台做下特殊判断 兼容遗留的bug
        if (uInfo && uInfo.name) {
            if (UserInfo_1.default.isWX()) {
                var name = uInfo.name;
                //如果用户名 是微信openid .那么把这个数据修复 .返回失败
                if (name.match("^oE7B")) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    requestSubscribeMessage(tmpIds, successCall, failCall, completeCall) {
    }
    //注册焦点事件
    registFocusEvent() {
        this.hideT = Laya.Browser.now();
        this.showT = this.hideT;
        Laya.stage.on(Laya.Event.FOCUS, this, this.onGetFocus);
        Laya.stage.on(Laya.Event.BLUR, this, this.onLoseFocus);
    }
    //获取游戏焦点
    onGetFocus() {
        LogsManager_1.default.echo("获取焦点");
        this.isHide = false;
        this.showT = Laya.Browser.now();
        Message_1.default.instance.send(MsgCMD_1.default.GAME_ONSHOW);
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.ON_SHOW);
        StatisticsManager_1.default.addLoadingOutTime(this.showT - this.hideT);
    }
    //失去游戏焦点
    onLoseFocus() {
        this.isHide = true;
        this.hideT = Laya.Browser.now();
        LogsManager_1.default.echo('>>OnHide成功回调', this.hideT);
        Message_1.default.instance.send(MsgCMD_1.default.GAME_ONHIDE);
        // 发送阿里云打点日志
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.ON_HIDE, { 'onlineTime': this.hideT - this.showT, 'hideView': GameUtils_1.default.decryptStr(WindowManager_1.default.getCurrentWindowName()) });
    }
    //是否是套壳包 
    isCasingPackage() {
        return false;
    }
    getChildChannelKey() {
        //如果是套壳包 
        if (this.isCasingPackage()) {
            return "other";
        }
        else {
            return "main";
        }
    }
    //获取游戏包名
    getPackageName() {
        return "qhmx." + GameConsts_1.default.gameCode + ".game";
    }
    recvMsg(cmd, data) {
    }
    onAccelerometerChange() { }
    accelerometerClear(x) { }
    accelerometerPause() { }
    /*
    * 注册推送事件
    */
    pushMessage(delay, id, title, subTitle, body, repeats = false) { }
    clearPushMessage(id) { }
    inAppPurchase(productId, amount, orderId, callbackUrl) { }
}
exports.default = GamePlatform;
//# sourceMappingURL=GamePlatform.js.map