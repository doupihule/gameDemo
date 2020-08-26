"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../../utils/Global");
const Method_1 = require("../../game/sys/common/kakura/Method");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const GamePlatform_1 = require("./GamePlatform");
const Message_1 = require("../common/Message");
const LogsManager_1 = require("../manager/LogsManager");
const ShareFunc_1 = require("../../game/sys/func/ShareFunc");
const TranslateFunc_1 = require("../func/TranslateFunc");
const WindowManager_1 = require("../manager/WindowManager");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
const MainModule_1 = require("../manager/MainModule");
const TimerManager_1 = require("../manager/TimerManager");
const BaseFunc_1 = require("../func/BaseFunc");
const CacheManager_1 = require("../manager/CacheManager");
const DeviceTools_1 = require("../utils/DeviceTools");
const StorageCode_1 = require("../../game/sys/consts/StorageCode");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
const VersionManager_1 = require("../manager/VersionManager");
const PackConfigManager_1 = require("../manager/PackConfigManager");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const GlobalParamsFunc_1 = require("../../game/sys/func/GlobalParamsFunc");
const JumpManager_1 = require("../manager/JumpManager");
const SubPackageManager_1 = require("../manager/SubPackageManager");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
const AdVideoManager_1 = require("./AdVideoManager");
const StatisticsCommonConst_1 = require("../consts/StatisticsCommonConst");
const GameSwitch_1 = require("../common/GameSwitch");
const TableUtils_1 = require("../utils/TableUtils");
const JumpConst_1 = require("../../game/sys/consts/JumpConst");
const AdResponse_1 = require("./AdResponse");
const UserModel_1 = require("../../game/sys/model/UserModel");
const FrameWorkHandle_1 = require("../../game/sys/manager/FrameWorkHandle");
const KariquShareConst_1 = require("../consts/KariquShareConst");
const KariqiShareManager_1 = require("../manager/KariqiShareManager");
const UserInfo_1 = require("../common/UserInfo");
const MethodCommon_1 = require("../common/kakura/MethodCommon");
const Client_1 = require("../common/kakura/Client");
const FullJumpFunc_1 = require("../func/FullJumpFunc");
const ShareOrTvManager_1 = require("../manager/ShareOrTvManager");
const StatisticsExtendManager_1 = require("../manager/StatisticsExtendManager");
const JSToNativeEvent_1 = require("../event/JSToNativeEvent");
class WXGamePlatform extends GamePlatform_1.default {
    constructor() {
        super();
        this._hasCheckUpdateListener = false;
        //分包下载失败次数.默认给一次自动重下
        this._subPackErrorCount = 0;
        WXGamePlatform.instance = this;
        //定义微信平台为分包模式
        this._isSubPackage = true;
        this.listenTime = Laya.Browser.now();
        LogsManager_1.default.echo('构造platform');
    }
    /**
     * 初始化平台信息
     */
    initPlatform() {
        // 初始化通用事件
        this.addListener();
        // 设置版本检查
        this.setVersionCheckResult(0);
        // 设置用户来源
        this.setUserComeFrom();
        // 获取系统信息
        this.setSystemInfo();
        // 初始化录屏组件
        this.registerRecord();
        // 设置屏幕常亮
        this.setKeeyScreenOn();
        // 初始化用户Ip信息
        this.initCityName();
    }
    /**
     * 设置屏幕常亮
     */
    setKeeyScreenOn() {
        if ('function' == typeof this.getWX().setKeepScreenOn) {
            this.getWX().setKeepScreenOn({ keepScreenOn: true });
        }
    }
    //设置获取系统信息
    setSystemInfo() {
        var myThis = this;
        if ("function" === typeof this.getWX().getSystemInfo) {
            this.getWX().getSystemInfo({
                success(systemInfo) {
                    LogsManager_1.default.echo('>>getSystemInfo成功回调', JSON.stringify(systemInfo));
                    myThis.initSystemInfoData(systemInfo);
                }, fail(err) {
                    LogsManager_1.default.echo('>>getSystemInfo失败回调', JSON.stringify(err));
                    var data = myThis.getWX().getSystemInfoSync();
                    LogsManager_1.default.echo('>>getSystemInfo失败回调 重新同步拉取', JSON.stringify(data));
                    if (data) {
                        myThis.initSystemInfoData(data);
                    }
                }
            });
        }
    }
    /**
        * 初始化系统数据
        */
    initSystemInfoData(systemInfo, isDelay = false) {
        if (systemInfo != undefined) {
            if (!systemInfo.windowWidth) {
                // Vivo平台无windowWidth字段
                systemInfo.windowWidth = systemInfo.screenWidth;
            }
            if (!systemInfo.windowHeight) {
                // Vivo平台无windowWidth字段
                systemInfo.windowHeight = systemInfo.screenHeight;
            }
            this.systemInfo = systemInfo;
            ScreenAdapterTools_1.default.setPhoneSys(systemInfo);
            //执行3次获取系统信息
            if (!isDelay) {
                TimerManager_1.default.instance.add(this._delayCheckSystemInfo, this, 3000, 3);
                TimerManager_1.default.instance.add(this._delayCheckSystemInfo, this, 1000, 1);
            }
        }
    }
    //延迟检测system 获取最新的宽高. 防止因为宽高异常 导致获取到的banner位置有问题
    _delayCheckSystemInfo() {
        var systemInfo = this.getWX().getSystemInfoSync();
        LogsManager_1.default.echo("xd _delayCheckSystemInfo:", this.systemInfo.windowHeight, systemInfo.windowHeight);
        if (systemInfo.windowHeight && systemInfo.windowHeight > this.systemInfo.windowHeight) {
            this.initSystemInfoData(systemInfo, true);
        }
    }
    /**
     * 获取系统信息
     */
    getSystemInfo() {
        if (!this.systemInfo && "function" === typeof this.getWX().getSystemInfoSync) {
            var systemInfo = this.getWX().getSystemInfoSync();
            this.initSystemInfoData(systemInfo);
        }
        return this.systemInfo;
    }
    /**wx登陆，获取登陆参数。请求global */
    getWxInfo() {
        var myThis = this;
        // 重新计算刘海屏
        this.reCheckBar();
        var data = {
            success: (res) => {
                LogsManager_1.default.echo('>>login成功回调>>', res);
                myThis.setLaunchOptions();
                if (res != undefined) {
                    var gParams = {};
                    var noCode = false;
                    if (UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame()) {
                        if (!res.code) {
                            noCode = true;
                        }
                    }
                    else if (UserInfo_1.default.isTT()) {
                        if (!res.anonymousCode && !res.code) {
                            noCode = true;
                        }
                    }
                    if (noCode) {
                        myThis.retryGetWxInfo();
                        return;
                    }
                    if (UserInfo_1.default.isWX()) {
                        gParams = {
                            "method": MethodCommon_1.default.global_Account_loginWx,
                            "params": {
                                "js_code": res.code,
                                "device": Global_1.default.deviceModel,
                                "comeFrom": UserInfo_1.default.LoginSceneInfo,
                                "sceneId": String(Global_1.default.sceneId)
                            }
                        };
                    }
                    else if (UserInfo_1.default.isQQGame()) {
                        gParams = {
                            "method": MethodCommon_1.default.global_Account_loginQQ,
                            "params": {
                                "js_code": res.code,
                                "device": Global_1.default.deviceModel,
                                "comeFrom": UserInfo_1.default.LoginSceneInfo
                            }
                        };
                    }
                    else if (UserInfo_1.default.isTT()) {
                        gParams = {
                            "method": Method_1.default.global_Account_loginTT,
                            "params": {
                                "code": res.code,
                                "anonymous_code": res.anonymousCode,
                                "device": Global_1.default.deviceModel,
                                "comeFrom": UserInfo_1.default.LoginSceneInfo
                            }
                        };
                    }
                    else if (UserInfo_1.default.isOppo()) {
                        gParams = {
                            "method": MethodCommon_1.default.global_Account_loginOppo,
                            "params": {
                                "token": res.data.token,
                                "device": Global_1.default.deviceModel,
                                "comeFrom": UserInfo_1.default.LoginSceneInfo
                            }
                        };
                    }
                    else if (UserInfo_1.default.isVivo()) {
                        gParams = {
                            "method": MethodCommon_1.default.global_Account_loginVivo,
                            "params": {
                                "token": res.token,
                                "device": Global_1.default.deviceModel,
                                "comeFrom": UserInfo_1.default.LoginSceneInfo
                            }
                        };
                    }
                    else if (UserInfo_1.default.isUC()) {
                        gParams = {
                            "method": MethodCommon_1.default.global_Account_loginUC,
                            "params": {
                                "code": res.code,
                                "device": Global_1.default.deviceModel,
                                "comeFrom": UserInfo_1.default.LoginSceneInfo
                            }
                        };
                    }
                    myThis.reqGlobal(gParams);
                }
            },
            fail(err) {
                LogsManager_1.default.echo('>>login失败回调>>', JSON.stringify(err));
                myThis.retryGetWxInfo();
            }, complete() {
            }
        };
        if (UserInfo_1.default.isTT()) {
            data["force"] = false;
        }
        this.getWX().login(data);
    }
    retryGetWxInfo() {
        this.curReqGlobalCount++;
        if (this.curReqGlobalCount >= this.maxReqGlobalCount) {
            LogsManager_1.default.warn(".login未获取到code超过五次", LogsManager_1.default.errorTag_gameError);
            WindowManager_1.default.setPopupTip(1, "登陆失败，请重试！", () => {
                this.getWxInfo();
            }, this);
        }
        else {
            this.getWxInfo();
        }
        return;
    }
    /**做一些微信的初始化及获取参数 */
    setLaunchOptions() {
        if (this.isDoWxThings)
            return;
        if (UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo() || UserInfo_1.default.isUC()) {
            LogsManager_1.default.echo('Oppo Vivo 无 getLaunchOptions接口');
            return;
        }
        this.isDoWxThings = true;
        var myThis = this;
        var launchRes = this.getLaunchOptions();
        if (!launchRes) {
            return;
        }
        LogsManager_1.default.echo("yrc getLaunchOptions", JSON.stringify(launchRes));
        if (!Global_1.default.sceneId)
            Global_1.default.sceneId = launchRes.scene;
        Global_1.default.currentSceneId = launchRes.scene;
        var queryData = launchRes.query;
        if (queryData) {
            myThis.inviteBy = queryData.inviterRid;
            myThis.shareInfo = queryData.shareInfo;
            //分享图id打点
            if (queryData.imgId) {
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_ENTER_GAME, { imgId: queryData.imgId, inviteBy: queryData.inviterRid });
            }
            myThis.shareLinkParams = queryData;
        }
    }
    /**
         * 计算刘海屏高度
         */
    reCheckBar() {
        if (typeof this.getWX().getMenuButtonBoundingClientRect == 'function') {
            try {
                var menuInfo = this.getWX().getMenuButtonBoundingClientRect();
                LogsManager_1.default.echo('hlx menuInfo:', JSON.stringify(menuInfo));
                ScreenAdapterTools_1.default.reCheckBar(menuInfo);
            }
            catch (e) {
                LogsManager_1.default.echo('getMenuButtonBoundingClientRect 方法报错:', JSON.stringify(e));
            }
        }
        else {
            LogsManager_1.default.echo('无 getMenuButtonBoundingClientRect 方法');
        }
    }
    //添加监听事件
    addListener() {
        var thisObj = this;
        if (UserInfo_1.default.isUC()) {
            LogsManager_1.default.echo("UC平台无全局事件注册");
            return;
        }
        //获取报错信息
        if (this.getWX().onError) {
            this.getWX().onError((res) => {
                LogsManager_1.default.systemError("onError!!!!!!!!!!!!", JSON.stringify(res));
            });
        }
        if (this.getWX().onMemoryWarning) {
            //监听内存不足告警事件
            this.getWX().onMemoryWarning((res) => {
                var errContent = "内存警告";
                if (res) {
                    errContent += JSON.stringify(res);
                }
                // LogsManager.sendErrorToPlatform(errContent, LogsManager.errorTage_memoryWarning, 80, LogsErrorCode.MEMORY_WARN);
            });
        }
        else {
            LogsManager_1.default.warn("没有找到onMemoryWarning这个接口");
        }
        // 添加onshow回调移动到构造函数保证最开始运行
        this.addOnShowListener();
    }
    getLoginResult() {
        //完成一个任务
        this.changeLeftTask(-1, "getLoginResult");
    }
    //获取用户信息. 关于授权的
    getUserInfoAndReq() {
        var myThis = this;
        myThis.platformUserInfo = {};
        this.getWX().getSetting({
            success: (res) => {
                LogsManager_1.default.echo("yrc wx getSetting success", JSON.stringify(res));
                if (res.authSetting['scope.userInfo']) {
                    LogsManager_1.default.echo("yrc wx start getUserInfo");
                    myThis.getWX().getUserInfo({
                        withCredentials: true,
                        lang: "",
                        success(res) {
                            LogsManager_1.default.echo("yrc wx getUserInfo success", JSON.stringify(res));
                            if (UserInfo_1.default.isBaidu()) {
                                LogsManager_1.default.echo("xd 百度不处理授权数据");
                                return;
                            }
                            myThis.userInfoData = res;
                            var userInfo = res.userInfo;
                            myThis.turnChannelUserInfo(userInfo);
                            if (UserInfo_1.default.isQQGame()) {
                                //QQ没有complete回调，特殊处理
                                myThis.sendKakuraInit();
                            }
                        },
                        fail(err) {
                            LogsManager_1.default.echo("yrc getUserInfo fail", JSON.stringify(err));
                        }, complete(res) {
                            LogsManager_1.default.echo("yrc getUserInfo complete", JSON.stringify(res));
                            if (!UserInfo_1.default.isQQGame()) {
                                myThis.sendKakuraInit();
                            }
                        }
                    });
                }
                else {
                    myThis.sendKakuraInit();
                }
            },
            fail: () => {
                LogsManager_1.default.echo("yrc getSetting ==fail===");
                myThis.sendKakuraInit();
            },
            complete: () => {
                LogsManager_1.default.echo("yrc getSetting ==complete===");
            }
        });
    }
    /**创建中心处授权按钮，用作登陆时强制授权，暂时不用 */
    createLoginButton(callBack, thisObject) {
        var designWidth = 640;
        var designHeight = 1136;
        var button = this.getWX().createUserInfoButton({
            type: 'image',
            text: '   点击获取微信授权    ',
            image: 'common/loading_bt_jinruyouxi.png',
            style: {
                left: ((designWidth - 233) * 0.5) / designWidth * UserInfo_1.default.platform.getSystemInfo().windowWidth,
                top: 3 * 0.25 * UserInfo_1.default.platform.getSystemInfo().windowHeight,
                width: 233 / designWidth * UserInfo_1.default.platform.getSystemInfo().windowWidth,
                height: 70 / designHeight * UserInfo_1.default.platform.getSystemInfo().windowHeight,
                backgroundColor: '#00000033',
                color: '#ff0000',
                textAlign: 'center',
            }
        });
        button.onTap((res) => {
            if (res.errMsg == "getUserInfo:ok") {
                LogsManager_1.default.echo('>>createLoginButton成功回调>>', JSON.stringify(res));
                LogsManager_1.default.echo("yrc wx authorize success", JSON.stringify(res));
                callBack && callBack.call(thisObject);
                button.hide();
                button.destroy();
            }
            else {
                LogsManager_1.default.echo("拒绝授权 wx GetUserInfo 数据：" + JSON.stringify(res));
                button.hide();
                button.destroy();
                callBack && callBack.call(thisObject);
            }
        });
    }
    /**创建特殊的透明登陆授权按钮 */
    createSpeLoginBtn(posX, posY, btnW, btnH, callBack, thisObject) {
        var left = posX / ScreenAdapterTools_1.default.width * ScreenAdapterTools_1.default.windowWidth;
        var top = posY / ScreenAdapterTools_1.default.height * ScreenAdapterTools_1.default.windowHeight;
        var width = btnW / ScreenAdapterTools_1.default.width * ScreenAdapterTools_1.default.windowWidth;
        var height = btnH / ScreenAdapterTools_1.default.height * ScreenAdapterTools_1.default.windowHeight;
        this.removeLoginBtn();
        var button = this.getWX().createUserInfoButton({
            type: 'image',
            image: 'open/res/openImg.png',
            withCredentials: false,
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
            }
        });
        button.onTap((res) => {
            LogsManager_1.default.echo(">>>>>>onTap>>>>>>>>", res.errMsg == "getUserInfo:ok", res);
            if (res.errMsg == "getUserInfo:ok") {
                LogsManager_1.default.echo('>>loginbutton onTap 成功回调>>', JSON.stringify(res));
                callBack && callBack.call(thisObject, res);
            }
            else {
                LogsManager_1.default.echo("拒绝授权 wx GetUserInfo 数据：" + JSON.stringify(res));
                callBack && callBack.call(thisObject, -1);
            }
        });
        this.loginBtn = button;
    }
    /**移除微信登陆授权按钮 */
    removeLoginBtn() {
        if (this.loginBtn) {
            this.loginBtn.hide();
            this.loginBtn.destroy();
        }
    }
    /**分享
     *
     *  extraData: {}表格式 .
     *
     */
    share(id, extraData, callback, thisObj) {
        LogsManager_1.default.echo("yrc wx share", id, extraData);
        if (this._isShare)
            return;
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_SHARE);
        this._isShare = true;
        TimerManager_1.default.instance.setTimeout(() => {
            this._isShare = false;
        }, this, 1300);
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_SHARE_NEW)) {
            LogsManager_1.default.echo("yrc share 开关关了");
            callback && callback.call(thisObj, true);
            return;
        }
        var shareQuery = "";
        this._shareId = id;
        this._shareExtraData = {};
        TableUtils_1.default.deepCopy(extraData, this._shareExtraData);
        this._shareCallback = callback;
        this._shareThisObj = thisObj;
        if (extraData && extraData.noWait) {
            this._shareNoWait = true;
        }
        else {
            this._shareNoWait = false;
        }
        this._shareTime = Client_1.default.instance.miniserverTime;
        var rid = UserModel_1.default.instance.getUserRid();
        var sinfo = "";
        var shareData = {};
        if (extraData) {
            shareData.des = extraData.des || "";
            shareData.imgUrl = extraData.imgUrl || "";
            if (extraData.shareInfo) {
                sinfo = "&shareInfo=" + extraData.shareInfo;
            }
        }
        //判断是否是接入卡日曲的
        var tempShareData = KariqiShareManager_1.default.getOneRandomShareInfo();
        if (tempShareData) {
            shareData = tempShareData;
        }
        else {
            if (id) {
                shareData = ShareFunc_1.default.instance.getShareData(id, "wxgame");
            }
        }
        if (!shareData) {
            callback && callback.call(thisObj, false);
            return;
        }
        var shareContentId;
        if (shareData.extraData && shareData.extraData.contentId) {
            shareContentId = shareData.extraData.contentId;
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_TOTAL_CLICK, { contentId: shareContentId });
        }
        else {
            shareContentId = null;
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_TOTAL_CLICK);
        }
        //如果有手动传递的扩展参数
        if (extraData) {
            shareQuery = this.turnDataToShareQuery(extraData);
        }
        //根据各自项目自行扩展
        if (shareData.extraData) {
            if (!shareQuery) {
                shareQuery = this.turnDataToShareQuery(shareData.extraData);
            }
            else {
                shareQuery += "&" + this.turnDataToShareQuery(shareData.extraData);
            }
        }
        //判断是否包含inviterRid字段
        if (shareQuery && shareQuery.indexOf("inviterRid=") == -1) {
            if (shareQuery != "") {
                shareQuery += "&inviterRid=" + rid;
            }
            else {
                shareQuery = "inviterRid=" + rid;
            }
        }
        var data = {
            title: shareData["desc"],
            imageUrl: shareData["imgUrl"],
            imgUrl: shareData["imgUrl"],
            query: shareQuery || "inviterRid=" + rid,
        };
        if (UserInfo_1.default.isUC()) {
            var data = {
                title: shareData["desc"],
                imageUrl: shareData["imgUrl"],
                query: shareQuery || "inviterRid=" + rid,
                target: "wechat",
                success: res => {
                    LogsManager_1.default.echo("hlx 分享成功回调", JSON.stringify(res));
                    callback && callback.call(thisObj, true);
                },
                fail: err => {
                    LogsManager_1.default.echo("hlx 分享失败回调", JSON.stringify(err));
                    callback && callback.call(thisObj, false);
                }
            };
        }
        else {
            var data = {
                title: shareData["desc"],
                imageUrl: shareData["imgUrl"],
                imgUrl: shareData["imgUrl"],
                query: shareQuery || "inviterRid=" + rid,
            };
        }
        this._lastShareImg = shareData.imgId;
        LogsManager_1.default.echo("yrc wxshare", data);
        var shareCallBack = (res) => {
            LogsManager_1.default.echo('分享成功回调', res);
            if (res != null) {
                this._doShareCallBack(res == 1);
                return;
            }
            else {
                LogsManager_1.default.warn('分享失败回调');
            }
        };
        if (id == "2" && extraData.shareInfo) {
            var arr = extraData.shareInfo.split(".");
            if (arr.length == 3 && arr[2].length > 0) {
                this.shareDynamicAppMessage(data, shareCallBack, arr[2]);
            }
            else {
                this.shareNormalAppMessage(data, shareCallBack);
            }
        }
        else {
            this.shareNormalAppMessage(data, shareCallBack);
        }
    }
    //分享非动态消息
    shareNormalAppMessage(data, shareCallBack) {
        LogsManager_1.default.echo("yrc shareNormalAppMessage");
        if (this.getWX().updateShareMenu) {
            // 百度无updateShareMenu接口
            this.getWX().updateShareMenu({
                withShareTicket: true,
                isUpdatableMessage: false,
            });
        }
        this.shareAldAppMsg(data, shareCallBack);
    }
    //分享动态消息
    shareDynamicAppMessage(data, shareCallBack, activityId) {
        LogsManager_1.default.echo("yrc shareDynamicAppMessage");
        if (this.getWX().updateShareMenu) {
            // 百度无updateShareMenu接口
            this.getWX().updateShareMenu({
                withShareTicket: true,
                isUpdatableMessage: true,
                activityId: activityId,
                templateInfo: {
                    parameterList: [{
                            name: 'member_count',
                            value: '1'
                        }, {
                            name: 'room_limit',
                            value: '4'
                        }]
                }
            });
        }
        this.shareAldAppMsg(data, shareCallBack);
    }
    shareAldAppMsg(data, shareCallBack) {
        //阿拉丁分享统计
        this.getWX().shareAppMessage({
            title: data.title,
            imageUrl: data.imgUrl,
            query: data.query,
            success(res) {
                console.log(">>>>>>>>share succ1>>>>>>>", res);
                shareCallBack(1);
            },
            fail(res) {
                console.log(">>>>>>>>share fail1>>>>>>>", res);
                shareCallBack(0);
            }
        });
        console.log(">>>>>>>>shareAppMessage>>>>>>>", data);
    }
    /**判断是否分享超过3秒 */
    checkShareSucc() {
        var newTime = Client_1.default.instance.miniserverTime;
        LogsManager_1.default.echo("yrc checkShareSucc newTime", newTime);
        if (this._shareTime && this._shareTime > 0) {
            var distime = newTime - this._shareTime;
            this._shareTime = 0;
            var kariquRt = KariqiShareManager_1.default.checkShareResult(distime);
            LogsManager_1.default.echo("kariquRt", kariquRt);
            if (kariquRt == -1) {
                FrameWorkHandle_1.default.instance.onCheckShareSucess(distime, this._shareExtraData);
            }
            else {
                //如果成功
                if (kariquRt == 1) {
                    this.onShareComplete(true);
                }
                else {
                    //失败 走项目自己的失败逻辑 传入时间为0. 分系统判断失败 执行对应的失败逻辑
                    FrameWorkHandle_1.default.instance.onCheckShareSucess(0, this._shareExtraData);
                }
            }
        }
    }
    //分享完成后回调
    onShareComplete(shareResult) {
        //如果是分享成功 卡日曲上报分享成功
        if (shareResult == true) {
            KariqiShareManager_1.default.saveShareRecord();
        }
        TimerManager_1.default.instance.setTimeout(() => {
            this._doShareCallBack(shareResult);
        }, this, 500);
    }
    // test
    sharePage() {
        LogsManager_1.default.echo("hlx 初始默认分享配置");
        if (UserInfo_1.default.isUC()) {
            LogsManager_1.default.echo("hlx UC平台无三个点分享配置");
            return;
        }
        this.getWX().showShareMenu({
            withShareTicket: true
        });
        var myThis = this;
        var callback = function () {
            var query = "";
            var imgUrl;
            var title;
            if (BaseFunc_1.default.globalCfgsHasLoad) {
                var tempShareData = KariqiShareManager_1.default.getOneRandomShareInfo();
                var shareData;
                if (tempShareData) {
                    shareData = tempShareData;
                }
                else {
                    shareData = ShareFunc_1.default.instance.getShareData("1");
                }
                if (shareData.extraData) {
                    query += myThis.turnDataToShareQuery(shareData.extraData);
                }
                imgUrl = shareData.imgUrl;
                title = shareData.desc;
            }
            if (UserModel_1.default.instance.getUserRid()) {
                if (!query) {
                    query = "inviterRid=" + UserModel_1.default.instance.getUserRid();
                }
                else {
                    query += "&inviterRid=" + UserModel_1.default.instance.getUserRid();
                }
            }
            LogsManager_1.default.echo("wx share:", query, imgUrl);
            myThis._lastShareImg = shareData.imgId;
            return {
                imageUrl: imgUrl,
                title: title,
                query: query,
            };
        };
        this.myOnShare(callback);
    }
    /**右上角三点分享监听函数 */
    myOnShare(callback) {
        this.getWX().onShareAppMessage(callback);
    }
    //初始化平台数据
    initPlatformData() {
        // 初始化分享
        this.sharePage();
        this.registerAd();
        // 初始化平台参数
        AdVideoManager_1.default.instance._isInitAdv = true;
        // 为了开启速度，不再预加载banner 插屏
        // // 初始化插屏广告
        // AdVideoManager.instance.registerInterstitialAd();
        // // 初始化banner广告
        //BannerAdManager.registerBanner();
        // 初始化视频广告
    }
    loadVideoAd() {
        LogsManager_1.default.echo('hlx reload VideoAd');
        var thisObj = this;
        if (!this._videoAd) {
            this.registerAd();
        }
        else {
            var promise = this._videoAd.load();
            if (typeof promise === 'object' && promise.then) {
                promise
                    .then(() => {
                    LogsManager_1.default.echo('videoAd 注册广告加载成功');
                    thisObj.loadAdvFailed = false;
                    thisObj.advHasShow = false;
                })
                    .catch(err => {
                    thisObj.loadAdvFailed = true;
                    LogsManager_1.default.echo('videoAd 广告手动加载失败', err);
                    KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager_1.default.curOrderName }, true);
                });
            }
        }
    }
    canAdv() {
        if (!super.canAdv()) {
            return false;
        }
        if (UserInfo_1.default.isUC() && "function" != typeof this.getWX().createRewardVideoAd) {
            LogsManager_1.default.warn("hlx adv 这个设备没有视频广告组件");
            return false;
        }
        else if ("function" != typeof this.getWX().createRewardedVideoAd) {
            LogsManager_1.default.warn("hlx adv这个设备没有视频广告组件");
            return false;
        }
        return true;
    }
    /**注册广告事件 */
    registerAd() {
        this.loadAdvFailed = false;
        LogsManager_1.default.echo("yrc registerAd", this._videoId);
        if (this._videoAd)
            return;
        if (!this.canAdv()) {
            this.loadAdvFailed = true;
            KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager_1.default.curOrderName }, true);
            return;
        }
        var thisObj = this;
        //判断是否有广告,如果没有广告
        if (UserInfo_1.default.isUC()) {
            this._videoAd = this.getWX().createRewardVideoAd();
        }
        else {
            var obj;
            if (UserInfo_1.default.isBaidu()) {
                obj = {
                    adUnitId: this._videoId,
                    appSid: this._appSid
                };
            }
            else if (UserInfo_1.default.isVivo()) {
                obj = {
                    posId: this._videoId,
                };
            }
            else {
                obj = { adUnitId: this._videoId };
            }
            this._videoAd = this.getWX().createRewardedVideoAd(obj);
        }
        LogsManager_1.default.echo("yrc registerAd this._videoAd", typeof this._videoAd);
        if (this._videoAd) {
            var videoAd = this._videoAd;
            videoAd.onError((err) => {
                thisObj.loadAdvFailed = true;
                KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager_1.default.curOrderName }, true);
                WindowManager_1.default.SwitchMaskUI(false, 0.5);
                LogsManager_1.default.echo("videoAd.onError:", JSON.stringify(err));
                thisObj.videoState = 0;
                if (thisObj._videoLoaded) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_ad_error"));
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD_FAIL);
                    thisObj._doVedioCallBack(false);
                }
            });
            videoAd.onLoad(() => {
                LogsManager_1.default.echo("videoAd.onLoad:");
                thisObj.loadAdvFailed = false;
                // 加载成功新广告，advHasShow = false
                thisObj.advHasShow = false;
                // 加载完成回调。用于vivo显示广告
                thisObj.afterVideoLoadCallBack();
            });
            videoAd.onClose(res => {
                Message_1.default.instance.send(MsgCMD_1.default.VIDEO_PLAY, res && res.isEnded);
                this.isPlayVideo = false;
                WindowManager_1.default.SwitchMaskUI(false, 0.5);
                if (res && res.isEnded) {
                    // 给予奖励
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_SUCCESS);
                    LogsManager_1.default.echo("yrc show WX video suc");
                    thisObj._extraData && thisObj._extraData.callback && thisObj._extraData.callback.call(thisObj._extraData.thisObj, true);
                    thisObj.onVideoComplete(true);
                }
                else {
                    thisObj.onTurnOffAdsEarly();
                    thisObj._extraData && thisObj._extraData.callback && thisObj._extraData.callback.call(thisObj._extraData.thisObj, false);
                }
            });
        }
        else {
            this.loadAdvFailed = true;
            KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager_1.default.curOrderName }, true);
        }
    }
    onVideoComplete(videoResult) {
        LogsManager_1.default.echo("onVideoComplete time:", Client_1.default.instance.miniserverTime);
        // 由于回调有延迟。为防止拉取下一条视频后OnError回调。提前置空回调
        // 定时器到了再回调
        this.videoState = 0;
        this._videoLoaded = false;
        var tempFunc = videoResult ? this._videoSucCallback : this._videoFailCallback;
        var tempObj = this._videoThisObj;
        this._videoFailCallback = null;
        this._videoSucCallback = null;
        this._videoThisObj = null;
        this._extraData = null;
        // 视频回调后将videoLoaded 重置避免手动加载广告失败
        this._videoLoaded = false;
        TimerManager_1.default.instance.setTimeout(() => {
            TimerManager_1.default.instance.setTimeout(() => {
                tempFunc && tempFunc.call(tempObj, videoResult);
            }, this, 50);
        }, this, 50);
    }
    //提前关闭视频广告      (在这里实现不同游戏需求  例如弹窗点确定后继续拉取广告等)
    onTurnOffAdsEarly() {
        var thisObj = this;
        var failHandleType = GlobalParamsFunc_1.default.instance.videoHandleType;
        if (failHandleType == 1) {
            LogsManager_1.default.echo("看视频中途退出");
            thisObj.onVideoComplete(false);
        }
        else if (failHandleType == 2) {
            thisObj.videoState = 1;
            this.showPopTip("提示", TranslateFunc_1.default.videoTranslateArr[Math.floor(Math.random() * TranslateFunc_1.default.videoTranslateArr.length)], {
                confirmText: TranslateFunc_1.default.videoLabTranslate,
                success: (res) => {
                    if (res.confirm) {
                        LogsManager_1.default.echo('用户点击确定,再次拉起视频');
                        //再次拉起视频
                        thisObj.showVideoAd(thisObj._videoSucCallback, thisObj._videoFailCallback, thisObj._videoThisObj, thisObj._extraData);
                    }
                    else if (res.cancel) {
                        LogsManager_1.default.echo("用户取消了再次看视频");
                        thisObj.onVideoComplete(false);
                    }
                }
            });
        }
    }
    /**播放激励视频 */
    showVideoAd(successCallBack = null, closeCallBack = null, thisObj = null, extraData = {}) {
        // 点击观看视频打点
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NORMAL_VIDEO_AD);
        this.isPlayVideo = false;
        this._videoSucCallback = successCallBack;
        this._videoFailCallback = closeCallBack;
        this._extraData = extraData;
        this._videoLoaded = true;
        this._videoThisObj = thisObj;
        WindowManager_1.default.SwitchMaskUI(true, 0.5);
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
        var myThis = this;
        //设置videoState 状态 
        this.videoState = 1;
        WindowManager_1.default.ShowTip("视频加载中");
        videoAd.show()
            .then(() => {
            LogsManager_1.default.echo('广告显示成功');
            myThis.isPlayVideo = true;
            Message_1.default.instance.send(MsgCMD_1.default.VIDEO_STOP);
        })
            .catch(err => {
            LogsManager_1.default.echo('广告组件出现问题', err);
            // 可以手动加载一次
            videoAd.load()
                .then(() => {
                LogsManager_1.default.echo('手动加载成功');
                //如果当前不是广告播放状态 没必要在显示了
                if (myThis.videoState == 0) {
                    LogsManager_1.default.echo("当前没有播放广告的回调.可能是在注册的时候初始化失败了-已经做了失败回调了");
                    return;
                }
                //如果没有回调要执行的回调 就不show了
                videoAd.show()
                    .then(() => {
                    LogsManager_1.default.echo('广告显示成功');
                    myThis.isPlayVideo = true;
                    Message_1.default.instance.send(MsgCMD_1.default.VIDEO_STOP);
                })
                    .catch(err => {
                    LogsManager_1.default.echo('hlx video.广告组件第二次show失败，执行失败回调', err);
                    myThis.loadAdvFailed = true;
                    KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager_1.default.curOrderName }, true);
                    myThis.videoState = 0;
                    myThis._doVedioCallBack(false);
                });
            })
                .catch(err => {
                LogsManager_1.default.echo('广告手动加载失败', err);
                myThis.loadAdvFailed = true;
                KariqiShareManager_1.default.addAdvPoint({ eventId: KariquShareConst_1.default.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager_1.default.curOrderName }, true);
                myThis.videoState = 0;
                myThis._doVedioCallBack(false);
            });
        });
    }
    /**
    * 视频回调
    */
    _doVedioCallBack(result) {
        LogsManager_1.default.echo("_doVedioCallBack and 重置视频参数 _videoCallback _videoThisObj");
        this.videoState = 0;
        var tempFunc = result ? this._videoSucCallback : this._videoFailCallback;
        var tempObj = this._videoThisObj;
        this._videoFailCallback = null;
        this._videoSucCallback = null;
        this._videoThisObj = null;
        this._extraData = null;
        // 视频回调后将videoLoaded 重置避免手动加载广告失败
        this._videoLoaded = false;
        tempFunc && tempFunc.call(tempObj, result);
    }
    /**
     * 分享回调
     */
    _doShareCallBack(result) {
        LogsManager_1.default.echo("_doShareCallBack and 重置分享参数 _shareCallback _shareThisObj _shareId _shareExtra");
        var tempFunc = this._shareCallback;
        var tempObj = this._shareThisObj;
        this._shareCallback = null;
        this._shareThisObj = null;
        this._shareId = null;
        this._shareExtraData = null;
        this._shareNoWait = null;
        tempFunc && tempFunc.call(tempObj, result);
    }
    //重写登出函数
    loginOut() {
        // this.getWX().getUpdateManager().applyUpdate();
        var obj = {
            success: () => {
                console.log("_loginOut success__");
            },
            fail: () => {
                console.log("_loginOut fail__");
            },
            complete: () => {
                console.log("_loginOut complete__");
            }
        };
        if (this.getWX().exitMiniProgram) {
            this.getWX().exitMiniProgram(obj);
        }
    }
    vibrate(isLong = false, callBack = null, thisObject = null) {
        if (isLong) {
            if ("function" === typeof this.getWX().vibrateLong) {
                this.getWX().vibrateLong({
                    success: (res) => {
                        // LogsManager.echo("yrc wx vibrateLong suc", res);
                        //震动成功
                        callBack && callBack.call(thisObject, true);
                    },
                    fail: (err) => {
                        // LogsManager.echo("yrc wx vibrateLong fail", err);
                        //震动失败
                        callBack && callBack.call(thisObject, false);
                    }
                });
            }
        }
        else {
            if ("function" === typeof this.getWX().vibrateShort) {
                this.getWX().vibrateShort({
                    success: (res) => {
                        // LogsManager.echo("yrc wx vibrateShort suc", res);
                        callBack && callBack.call(thisObject, true);
                    },
                    fail: (err) => {
                        // LogsManager.echo("yrc wx vibrateShort fail", err);
                        callBack && callBack.call(thisObject, false);
                    }
                });
            }
        }
    }
    //添加版本更新监听
    addUpdateListener() {
        this.getNetwork();
        var thisObj = this;
        //判断如果超时则判定为无新版本，走下一步
        var timeCode = TimerManager_1.default.instance.setTimeout(() => {
            thisObj.isOutTime = true;
            if (thisObj._hasCheckUpdateListener) {
                LogsManager_1.default.echo("wxgme xd 已经处理过更新检查了--000000000");
                return;
            }
            thisObj._hasCheckUpdateListener = true;
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "updateListerner timeover");
        }, this, 1000);
        this.changeLeftTask(-1, "addUpdateListener");
        //开始加载分包资源
        this.startDownloadSubPackage();
        super.addUpdateListener();
        if (typeof this.getWX().getUpdateManager === 'function') { // 请在使用前先判断是否支持
            const updateManager = this.getWX().getUpdateManager();
            if (!VersionManager_1.default.checkIsForceUpdate()) {
                LogsManager_1.default.echo("krma. no ForceUpdate");
                timeCode && TimerManager_1.default.instance.remove(timeCode);
                if (thisObj._hasCheckUpdateListener) {
                    LogsManager_1.default.echo("wxgme xd 已经处理过更新检查了--000000000");
                    return;
                }
                thisObj._hasCheckUpdateListener = true;
                MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "task_updateListerner back");
            }
            var timer = Client_1.default.instance.miniserverTime;
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                LogsManager_1.default.echo("请求完新版本信息的回调", res.hasUpdate, "costTime :", Client_1.default.instance.miniserverTime - timer);
                thisObj.setVersionCheckResult(res.hasUpdate ? 2 : 1);
                if (thisObj.isOutTime)
                    return;
                if (timeCode) {
                    TimerManager_1.default.instance.remove(timeCode);
                }
                if (thisObj._hasCheckUpdateListener) {
                    LogsManager_1.default.echo("wxgme xd 已经处理过更新检查了--000000000");
                    return;
                }
                thisObj._hasCheckUpdateListener = true;
                if (!res.hasUpdate && VersionManager_1.default.checkIsForceUpdate()) {
                    //没有版本更新 才出现主界面
                    MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "task_updateListerner back");
                }
                else {
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.CLIENT_UPDATE);
                }
                // Message.instance.send(ControlConst.VERSION_CHECK_COMPLETE);
            });
            updateManager.onUpdateReady(function () {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                LogsManager_1.default.echo("新版本下载完毕", "costTime :", Client_1.default.instance.miniserverTime - timer);
                //如果不是强更状态 return
                if (!VersionManager_1.default.checkIsForceUpdate()) {
                    LogsManager_1.default.warn("本次是非强更，无需重启客户端,localversion:", PackConfigManager_1.default.ins.platform.vms_version, "vmsversion:", VersionManager_1.default.vmsVersion);
                    return;
                }
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                LogsManager_1.default.echo("新版本下载完毕");
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#versionUpdateReady"));
                TimerManager_1.default.instance.setTimeout(() => {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    Global_1.default.isGameDestory = true;
                    updateManager.applyUpdate();
                }, null, 300);
            });
            updateManager.onUpdateFailed(function () {
                if (thisObj._hasCheckUpdateListener) {
                    LogsManager_1.default.echo("wxgme xd 已经处理过更新检查了--000000000");
                    return;
                }
                thisObj._hasCheckUpdateListener = true;
                // 新的版本下载失败
                LogsManager_1.default.echo("新版本下载失败", "costTime :", Laya.timer.currTimer - timer);
                MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "task_updateListerner back");
            });
        }
        else {
            LogsManager_1.default.echo('this.getWX().getUpdateManager不支持');
            timeCode && TimerManager_1.default.instance.remove(timeCode);
            this.setVersionCheckResult(1);
            if (thisObj._hasCheckUpdateListener) {
                LogsManager_1.default.echo("wxgme xd 已经处理过更新检查了--000000000");
                return;
            }
            thisObj._hasCheckUpdateListener = true;
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "task_updateListerner back");
        }
    }
    //设置游戏帧率为30
    setGameFrame() {
        super.setGameFrame();
        if (GameConsts_1.default.gameFrameRate == 30) {
            if ("function" === typeof this.getWX().setPreferredFramesPerSecond) {
                // this.getWX().setPreferredFramesPerSecond(30);
            }
            else {
                LogsManager_1.default.echo("hlx 该平台不支持设置帧率函数");
            }
        }
    }
    /**阿拉丁数据打点 */
    aldSendEvent(eventId, eventData = {}) {
        // var sendObj = {}
        // // 新版阿拉丁会修改eventData。需要深度拷贝数据
        // TableUtils.deepCopy(eventData, sendObj);
        // var senjsonStr = JSON.stringify(sendObj);
        // // LogsManager.echo("yrc aldSendEvent eventId:", eventId, senjsonStr)
        // if (senjsonStr.length > 255) {
        //     // 大于255字符无法发送
        //     LogsManager.errorTag('ald_data_length_error', "string:" + senjsonStr)
        //     return;
        // }
        // this.getWX().aldSendEvent(eventId, sendObj);
    }
    /**添加onshow监听 */
    addOnShowListener() {
        var myThis = this;
        // 首次注册初始化showT
        this.showT = Laya.Browser.now();
        LogsManager_1.default.echo('wx_listener 初始化onShow showT：', this.showT);
        if (!(UserInfo_1.default.isOppo() || UserInfo_1.default.isVivo())) {
            this.getWX().onShow((res) => {
                var nowTime = Laya.Browser.now();
                LogsManager_1.default.echo('>>OnShow成功回调', nowTime, JSON.stringify(res));
                if (!this.isHide || !myThis.hideT) {
                    if (this.listenTime) {
                        this.mainToListen = this.listenTime - StatisticsManager_1.default.mainStartT;
                        LogsManager_1.default.echo("krma. noHide show start " + StatisticsManager_1.default.mainStartT + " listen " + this.listenTime + " mainToListen " + this.mainToListen + " now " + nowTime + " mainToNow " + (nowTime - StatisticsManager_1.default.mainStartT));
                    }
                    else {
                        LogsManager_1.default.echo("krma. noHide show start " + StatisticsManager_1.default.mainStartT + " no listen " + " now " + nowTime + " mainToNow " + (nowTime - StatisticsManager_1.default.mainStartT));
                    }
                    StatisticsManager_1.default.mainStartT = nowTime;
                }
                //拿到分享链接参数
                if (res.query) {
                    myThis.shareLinkParams = res.query;
                }
                this.isHide = false;
                myThis.onGetFocus();
                myThis.checkShareSucc();
                JumpManager_1.default.openJumpListViewById(FullJumpFunc_1.default.ID_ONSHOW);
            });
        }
        else {
            this.getWX().onShow(() => {
                myThis.checkShareSucc();
                myThis.onGetFocus();
            });
        }
        this.getWX().onHide((res) => {
            myThis.onLoseFocus();
        });
    }
    //下载分包资源
    startDownloadSubPackage() {
        //如果不使用物理引擎 return
        if (!GameConsts_1.default.isUsePhysics) {
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_subpackage, "xd wx-loadSubpackage,quick");
            return;
        }
        if (window["Physics3D"]) {
            //这里需要重新赋值
            if (window["__physics3D"]) {
                Laya3D["_physics3D"] = window["__physics3D"];
            }
            LogsManager_1.default.echo("__已经拥有3D库了表示不会走到这里;");
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_subpackage, "xd wx-loadSubpackage,quick");
            return;
        }
        //如果不使用分包模式
        if (!this._isSubPackage) {
            this.initPhysics3D("xd wx-loadSubpackage,no subpackage");
            return;
        }
        LogsManager_1.default.echo("xd- startDownloadSubPackage");
        var t1 = Client_1.default.instance.miniserverTime;
        var thisObj = this;
        this.getWX().loadSubpackage({
            name: "physics",
            success: function (res) {
                //完成一个任务
                thisObj.initPhysics3D("xd wx-loadSubpackage,costTime:" + (Client_1.default.instance.miniserverTime - t1) + "res:" + res);
            },
            fail: function (res) {
                //失败弹出异常提示框 重连
                LogsManager_1.default.echo("___分包下载异常--重新下载");
                WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#subPackageError"), thisObj.startDownloadSubPackage, thisObj);
            },
            complete: function (res) {
                LogsManager_1.default.echo("___分包下载complete", res);
            }
        });
    }
    getWX() {
        return window["wx"];
    }
    /**设置用户来源 */
    setUserComeFrom() {
        var cacheData = CacheManager_1.default.instance.getGlobalCache(StorageCode_1.default.storage_firstrun_data);
        if (cacheData == "0") {
            //如果本地没有来源数据则获取一下并且存一个
            try {
                var launchRes = this.getLaunchOptions();
                if (launchRes) {
                    var appId = "";
                    if (launchRes["referrerInfo"] && launchRes["referrerInfo"]["appId"]) {
                        appId = "_appId:" + launchRes["referrerInfo"]["appId"];
                    }
                    //首次启动数据缓存起来
                    Global_1.default.firstRunSystemInfo = { appId: appId, sceneId: launchRes.scene };
                    LogsManager_1.default.echo("sanmen getLaunchOptionsSync", JSON.stringify(launchRes), "sendStr:", UserInfo_1.default.LoginSceneInfo);
                    //存本地
                    CacheManager_1.default.instance.setGlobalCache(StorageCode_1.default.storage_firstrun_data, JSON.stringify(Global_1.default.firstRunSystemInfo));
                }
            }
            catch (err) {
                LogsManager_1.default.echo("sanmen getLaunchOptionsSync err");
            }
        }
        else {
            //如果有 就取本地的来源数据
            try {
                Global_1.default.firstRunSystemInfo = JSON.parse(cacheData);
            }
            catch (e) {
                Global_1.default.firstRunSystemInfo = {};
            }
            LogsManager_1.default.echo("sanmen setUserComeFrom", UserInfo_1.default.LoginSceneInfo);
        }
        Global_1.default.sceneId = Global_1.default.firstRunSystemInfo.sceneId;
    }
    getNetwork() {
        if (this.getWX().getNetworkType) {
            this.getWX().getNetworkType({
                success: (res) => {
                    if (res && res.networkType) {
                        DeviceTools_1.default.network = res.networkType;
                    }
                },
            });
        }
    }
    /**显示模态对话框，即弹窗 */
    showPopTip(title, content, extraData = null) {
        LogsManager_1.default.echo("yrc showPopTip:", title, content, extraData);
        if (this.getWX().showModal) {
            var data = TableUtils_1.default.copyOneTable(extraData) || {};
            data.title = title;
            data.content = content;
            this.getWX().showModal(data);
        }
    }
    /**
     * 显示消息提示框
     * @param title 显示的提示文字
     * @param icon 图标类型，none为没有图标
     */
    showFlyTip(title, icon = "none") {
        LogsManager_1.default.echo("yrc showFlyTip:", title);
        if (this.getWX().showToast) {
            this.getWX().showToast({
                title: title,
                icon: icon
            });
        }
    }
    /**调用wx系源生接口，只做加载即完成后的回调 */
    loadSubPackage(packageName, callback, thisObj, isShowPop = false) {
        var t1 = Client_1.default.instance.miniserverTime;
        if (!this.getWX().loadSubpackage) {
            LogsManager_1.default.errorTag(LogsErrorCode_1.default.WX_SDK_ERROR, "yrc loadSubPackage 无分包加载接口");
            callback && callback.call(thisObj, false);
            return;
        }
        var myThis = this;
        var timeCode = 0;
        var failFunc = (res) => {
            TimerManager_1.default.instance.remove(timeCode);
            if (!callback) {
                return;
            }
            LogsManager_1.default.echo("yrc loadSubpackage fail packageName:", packageName, "_subPackErrorCount ", myThis._subPackErrorCount, " errRes:", TableUtils_1.default.safelyJsonStringfy(res));
            myThis._subPackErrorCount++;
            //如果第一次下载失败
            if (myThis._subPackErrorCount == 1) {
                LogsManager_1.default.echo("xd _重试---下载分包", packageName);
                TimerManager_1.default.instance.add(myThis.loadSubPackage, myThis, 100, 1, false, [packageName, callback, thisObj, isShowPop]);
                callback = null;
            }
            else {
                if (isShowPop) {
                    //区分加载超时还是失败
                    if (res == "timeOut") {
                        StatisticsExtendManager_1.default.onEvent(StatisticsCommonConst_1.default.CLIENT_SUBPACK_TIMEOUT, { time: myThis._subPackErrorCount, position: packageName, type: DeviceTools_1.default.network });
                    }
                    else {
                        StatisticsExtendManager_1.default.onEvent(StatisticsCommonConst_1.default.CLIENT_SUBPACK_ERROR, { time: myThis._subPackErrorCount, position: packageName, type: DeviceTools_1.default.network });
                    }
                    if (callback) {
                        //这里需要 清空callback .因为超时或者fail都会做回调.为了避免多次回调 需要做特殊处理 .执行一次callback 需要把 这个callback对象清空
                        var tempCallBack = callback;
                        callback = null;
                        WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#error110"), () => {
                            LogsManager_1.default.echo("yrc111 loadSubpackage fail 弹窗重新加载点击确认");
                            myThis.loadSubPackage(packageName, tempCallBack, thisObj, true);
                        }, myThis);
                    }
                }
                else {
                    callback && callback.call(thisObj, false);
                }
            }
        };
        //暂定5秒以后判定分包失败 重连
        timeCode = TimerManager_1.default.instance.add(failFunc, this, 10000, 1, false, ["timeOut"]);
        this.getWX().loadSubpackage({
            name: packageName,
            success: (res) => {
                myThis._subPackErrorCount = 0;
                LogsManager_1.default.echo("yrc loadSubpackage success packageName:", packageName, "   sucRes:", res, "cosTime:", Client_1.default.instance.miniserverTime - t1);
                SubPackageManager_1.default.setLoadStatus(packageName);
                //这里延迟一帧做回调
                if (callback) {
                    TimerManager_1.default.instance.setTimeout(callback, thisObj, 30, true);
                    //成功需要清理callback
                    callback = null;
                }
                TimerManager_1.default.instance.remove(timeCode);
                // callback && callback.call(thisObj, true);
            },
            fail: failFunc,
            complete: (res) => {
                TimerManager_1.default.instance.remove(timeCode);
                LogsManager_1.default.echo("yrc loadSubpackage complete packageName:", packageName);
            }
        });
    }
    /**打开客服会话 */
    openCustomerService(isShowCard = false) {
        if (this.getWX().openCustomerServiceConversation) {
            this.getWX().openCustomerServiceConversation({
                showMessageCard: isShowCard,
                sendMessageTitle: "我要领钻石",
                sendMessageImg: "common/main_btn_lingzuan.png",
                success: (res) => {
                    LogsManager_1.default.echo("yrc111 openCustomerServiceConversation success", res);
                    Message_1.default.instance.send(MsgCMD_1.default.CUSTOMER_BACK);
                },
                fail: (res) => {
                    LogsManager_1.default.echo("yrc111 openCustomerServiceConversation fail", res);
                },
                complete: (res) => {
                    LogsManager_1.default.echo("yrc111 openCustomerServiceConversation complete", res);
                },
            });
        }
    }
    /**跳转到其他小程序
        * data.extraData是额外传的数据，包含各种回调等，但不是跳转需要传递的extraData,跳转需要传递的extraData是data.extraData.ext
       */
    jumpToMiniProgram(data) {
        if (KariqiShareManager_1.default.checkIsKariquChannel()) {
            if (this.getWX().navigateToMiniProgram) {
                this.getWX().navigateToMiniProgram({
                    appId: data.appId,
                    path: data.path,
                    extraData: data.extraData && data.extraData.ext,
                    success: (res) => {
                        LogsManager_1.default.echo("yrc navigateToMiniProgram success", res);
                        JumpManager_1.default.sendKariquJumpClickData(data.jumpData);
                        //额外数据处理
                        if (data.extraData) {
                            data.extraData.callBack && data.extraData.callBack.call(data.extraData.thisObj, data);
                        }
                        var gameName = "";
                        if (data && data.jumpData && data.jumpData.GameName) {
                            gameName = data.jumpData.GameName;
                        }
                        var toAppId = "";
                        if (data && data.appId) {
                            toAppId = data.appId;
                        }
                        var position = 0;
                        if (data && data.jumpData && data.jumpData.Position) {
                            position = data.jumpData.Position;
                        }
                        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.JUMP_TO_OTHER_GAME_SUCCESS, { gameName: gameName, from: data.extraData && data.extraData.from, toAppId: toAppId, position: position });
                    },
                    fail: (res) => {
                        LogsManager_1.default.echo("yrc navigateToMiniProgram fail", res);
                        if (data.extraData.callBack) {
                            data.extraData.callBack.call();
                        }
                    },
                    complete: (res) => {
                        LogsManager_1.default.echo("yrc navigateToMiniProgram complete", res);
                    },
                });
            }
        }
        else if (JumpManager_1.default.jumpChannel == JumpConst_1.default.JUMP_CHANNEL_ZHISE) {
            var jump = AdResponse_1.AdResponse.changeDataToZhise(data);
            JumpManager_1.default.zhiseData.navigate2Mini(jump, UserInfo_1.default.channelUserId, () => {
                //StatisticsManager.ins.onEvent(StatisticsManager.JUMP_OTHERGAMESUCCESS, { name: data.jumpData.GameName })
            }, () => {
            });
        }
        else {
            if (this.getWX().navigateToMiniProgram) {
                this.getWX().navigateToMiniProgram({
                    appId: data.appId,
                    path: data.path,
                    extraData: data.extraData && data.extraData.ext,
                    success: (res) => {
                        LogsManager_1.default.echo("yrc navigateToMiniProgram success", res);
                        //额外数据处理
                        if (data.extraData) {
                            data.extraData.callBack && data.extraData.callBack.call(data.extraData.thisObj, data.appId);
                        }
                        var gameName = "";
                        if (data && data.jumpData && data.jumpData.GameName) {
                            gameName = data.jumpData.GameName;
                        }
                        var toAppId = "";
                        if (data && data.appId) {
                            toAppId = data.appId;
                        }
                        var position = 0;
                        if (data && data.jumpData && data.jumpData.Position) {
                            position = data.jumpData.Position;
                        }
                        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.JUMP_TO_OTHER_GAME_SUCCESS, { gameName: gameName, from: data.extraData && data.extraData.from, toAppId: toAppId, position: position });
                        JumpManager_1.default.removeJumpedApp(toAppId);
                    },
                    fail: (res) => {
                        LogsManager_1.default.echo("yrc navigateToMiniProgram fail", res);
                        // Message.instance.send(WxEvent.WX_EVENT_JUMPFAIL);
                        JumpManager_1.default.showDrawerView(data.extraData && data.extraData.from);
                        if (data.extraData && data.extraData.failCall) {
                            data.extraData.failCall && data.extraData.failCall.call(data.extraData.thisObj, data);
                        }
                    },
                    complete: (res) => {
                        LogsManager_1.default.echo("yrc navigateToMiniProgram complete", res);
                        // Message.instance.send(WxEvent.WX_EVENT_JUMPCOMPLETE);
                    },
                });
            }
        }
    }
    /**设置排行榜数据 */
    setUseRankInfo(data = []) {
        if (this.getWX().setUserCloudStorage) {
            this.getWX().setUserCloudStorage({
                KVDataList: data,
                success(res) {
                    LogsManager_1.default.echo('setUserCloudStorage>>成功回调', JSON.stringify(res));
                }, fail(err) {
                    LogsManager_1.default.echo('setUserCloudStorage>>失败回调', JSON.stringify(err));
                }
            });
        }
        else {
            LogsManager_1.default.errorTag(null, "没有找到setUserCloudStorage这个接口");
        }
    }
    /**
         * 是否从小程序收藏进入
         */
    isFromFavourite() {
        if (Global_1.default.currentSceneId != "1001") {
            return false;
        }
        return true;
    }
    //转化表为分享数据格式
    turnDataToShareQuery(data) {
        var str = "";
        if (typeof data == "string") {
            return data;
        }
        for (var i in data) {
            if (!str) {
                str = i + "=" + data[i];
            }
            else {
                str += "&" + i + "=" + data[i];
            }
        }
        return str;
    }
    showGameClubBtn(posX, posY, btnW, btnH) {
        if (!this.getWX().createGameClubButton) {
            return;
        }
        if (!this._gameClubBtn) {
            var left = posX / ScreenAdapterTools_1.default.width * Global_1.default.windowWidth;
            var top = posY / ScreenAdapterTools_1.default.height * Global_1.default.windowHeight;
            var width = btnW / ScreenAdapterTools_1.default.width * Global_1.default.windowWidth;
            var height = btnH / ScreenAdapterTools_1.default.height * Global_1.default.windowHeight;
            var btn = this.getWX().createGameClubButton({
                type: "image",
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                },
                icon: "light"
            });
            this._gameClubBtn = btn;
        }
        if (this._gameClubBtn) {
            this._gameClubBtn.show();
        }
    }
    hideGameClubBtn() {
        if (this._gameClubBtn) {
            this._gameClubBtn.hide();
        }
    }
    destroyGameClubBtn() {
        if (this._gameClubBtn) {
            this._gameClubBtn.destroy();
        }
    }
    /**
     * 请求订阅消息
     * @param tmpIds 模板id列表
     * @param successCall 成功回调
     * @param failCall 失败回调
     * @param completeCall 完成回调
     */
    requestSubscribeMessage(tmpIds, successCall, failCall, completeCall) {
        if ('function' == typeof this.getWX().requestSubscribeMessage) {
            var sendMessage = {};
            sendMessage['tmplIds'] = tmpIds;
            sendMessage['success'] = successCall;
            sendMessage['fail'] = failCall;
            sendMessage['complete'] = completeCall;
            this.getWX().requestSubscribeMessage(sendMessage);
        }
    }
    /**
     * 监听加速度
     */
    onAccelerometerChange() {
        if (UserInfo_1.default.platform.getWX().onAccelerometerChange) {
            UserInfo_1.default.platform.getWX().onAccelerometerChange((accelVec) => {
                accelVec.x = accelVec.x * 10;
                Message_1.default.instance.send(JSToNativeEvent_1.default.NATIVE_ACCEL_BACK, accelVec);
            });
        }
    }
    /**
     * 暂定加速器监听
     */
    accelerometerPause() {
        if (UserInfo_1.default.platform.getWX().stopAccelerometer) {
            UserInfo_1.default.platform.getWX().stopAccelerometer({
                success: null,
                fail: null,
                complete: null
            });
        }
    }
}
exports.default = WXGamePlatform;
//# sourceMappingURL=WXGamePlatform.js.map