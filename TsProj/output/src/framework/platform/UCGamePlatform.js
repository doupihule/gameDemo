"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WXGamePlatform_1 = require("./WXGamePlatform");
const LogsManager_1 = require("../manager/LogsManager");
const UserInfo_1 = require("../common/UserInfo");
const Global_1 = require("../../utils/Global");
const GameSwitch_1 = require("../common/GameSwitch");
const MethodCommon_1 = require("../common/kakura/MethodCommon");
class UCGamePlatform extends WXGamePlatform_1.default {
    constructor() {
        super();
        /**
         * 游客Id
         */
        this.guestid = '';
        /**
         * 登录返回的code凭证
         */
        this.code = '';
        GameSwitch_1.default.switchMap[GameSwitch_1.default.SWITCH_LOCAL_RES] = 0;
        UCGamePlatform.instance = this;
    }
    getWX() {
        return window['uc'];
    }
    //初始化平台数据
    initPlatformData() {
        LogsManager_1.default.echo("hlx 初始化平台数据");
        this.registerAd();
    }
    /**调取对应平台的分享 */
    shareAldAppMsg(data) {
        this.getWX().shareAppMessage(data);
    }
    myOnShare(callback) {
        this.getWX().onShareAppMessage(callback);
    }
    getWxInfo() {
        var mythis = this;
        // 获取游客信息
        this._guestLogin((result) => {
            if (!result) {
                mythis.retryGetWxInfo();
                return;
            }
            // 判断是否登录账号
            mythis.getWX().isLogin({
                success: function (data) {
                    if (data && data.isLogin) {
                        // 登录账号
                        mythis._login((result) => {
                            if (!result) {
                                mythis.retryGetWxInfo();
                                return;
                            }
                            // 发送登录请求
                            mythis._sendGlobalLoginReq();
                        }, mythis);
                    }
                    else {
                        // 游客账号
                        mythis._sendGlobalLoginReq();
                    }
                },
                fail: function (data) {
                    LogsManager_1.default.warn("hlx isLogin fail");
                    mythis.retryGetWxInfo();
                    return;
                },
            });
        }, this);
    }
    /**
     * 发送登录请求
     */
    _sendGlobalLoginReq() {
        var gParams = {
            "method": MethodCommon_1.default.global_Account_loginUC,
            "params": {
                "code": this.code,
                "guestid": this.guestid,
                "device": Global_1.default.deviceModel,
                "comeFrom": UserInfo_1.default.LoginSceneInfo,
                "sceneId": String(Global_1.default.sceneId),
            }
        };
        this.reqGlobal(gParams);
    }
    /**
     * 获取游客信息
     */
    _guestLogin(callback = null, thisObj = null) {
        if (this.guestid) {
            LogsManager_1.default.echo("hlx _guestLogin 已经进行过游客登录，直接成功回调");
            callback && callback.call(thisObj, true);
            return;
        }
        var myThis = this;
        this.getWX().getGuestInfo({
            success: function (res) {
                LogsManager_1.default.echo("getGuestInfo 加载成功", JSON.stringify(res));
                if (res.guestid) {
                    myThis.guestid = res.guestid;
                    // 废弃userInfoData 使用 platformUserInfo
                    myThis.platformUserInfo = { "name": res.nickName, "headImage": res.avatarUrl };
                    callback && callback.call(thisObj, true);
                }
                else {
                    LogsManager_1.default.errorTag("getGuestInfo_error", "getGuestInfo 加载成功,返回值异常");
                    callback && callback.call(thisObj, false);
                }
            },
            fail: function (res) {
                try {
                    LogsManager_1.default.errorTag("getGuestInfo_error", "getGuestInfo 加载失败", JSON.stringify(res));
                }
                catch (e) {
                    LogsManager_1.default.errorTag("getGuestInfo_error", "getGuestInfo 加载失败,无法序列化error");
                }
                callback && callback.call(thisObj, false);
            }
        });
    }
    /**
     * 账号登陆
     */
    _login(callback, thisObj) {
        var myThis = this;
        try {
            this.getWX().login({
                success: function (res) {
                    LogsManager_1.default.echo('>>login成功回调>>', JSON.stringify(res));
                    myThis.setLaunchOptions();
                    if (res && res.code) {
                        myThis.code = res.code;
                        callback && callback.call(thisObj, true);
                    }
                    else {
                        LogsManager_1.default.errorTag("login_error", "login 加载成功,返回值异常");
                        callback && callback.call(thisObj, false);
                    }
                },
                fail: function (err) {
                    LogsManager_1.default.warn('>>login失败回调>>', err);
                    callback && callback.call(thisObj, false);
                }
            });
        }
        catch (e) {
            LogsManager_1.default.echo('login_error:', e);
        }
    }
    /**
     * 获取用户授权信息
     */
    getUserInfoAndReq() {
        var myThis = this;
        myThis.platformUserInfo = {};
        this.getWX().getSetting({
            success: (res) => {
                LogsManager_1.default.echo("hlx UC getSetting success", JSON.stringify(res));
                if (res.userInfo) {
                    LogsManager_1.default.echo("hlx UC start getUserInfo");
                    myThis.getWX().getUserInfo({
                        success(res) {
                            LogsManager_1.default.echo("hlx UC getUserInfo success", JSON.stringify(res));
                            // 废弃userInfoData
                            // myThis.userInfoData = {userInfo:res};
                            myThis.platformUserInfo = { "name": res.nickName, "headImage": res.avatarUrl };
                            myThis.sendKakuraInit();
                        }, fail(err) {
                            LogsManager_1.default.echo("hlx UC getUserInfo fail", JSON.stringify(err));
                            myThis.sendKakuraInit();
                        }
                    });
                }
                else {
                    myThis.sendKakuraInit();
                }
            },
            fail: () => {
                LogsManager_1.default.echo("hlx UC getSetting ==fail===");
                myThis.sendKakuraInit();
            },
        });
    }
    //添加监听事件
    addListener() {
        LogsManager_1.default.echo("hlx addListener ", typeof window['onerror']);
        window['onerror'] = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
            LogsManager_1.default.systemError("onError!!!!!!!!!!!!", JSON.stringify(errorMessage));
        };
    }
}
exports.default = UCGamePlatform;
//# sourceMappingURL=UCGamePlatform.js.map