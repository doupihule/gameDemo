import WXGamePlatform from "./WXGamePlatform";
import LogsManager from "../manager/LogsManager";
import Client from "../common/kakura/Client";
import UserInfo from "../common/UserInfo";
import Method from "../../game/sys/common/kakura/Method";
import Message from "../common/Message";
import UserModel from "../../game/sys/model/UserModel";
import WindowManager from "../manager/WindowManager";
import MsgCMD from "../../game/sys/common/MsgCMD";
import TranslateFunc from "../func/TranslateFunc";
import ShareConst from "../consts/ShareConst";
import GameConsts from "../../game/sys/consts/GameConsts";
import ControlConst from "../consts/ControlConst";
import Global from "../../utils/Global";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";
import { JumpFunc } from "../func/JumpFunc";
import ShareFunc from "../../game/sys/func/ShareFunc";
import GlobalParamsFunc from "../../game/sys/func/GlobalParamsFunc";
import GameSwitch from "../common/GameSwitch";
import MethodCommon from "../common/kakura/MethodCommon";


export default class UCGamePlatform extends WXGamePlatform {
    public static instance: UCGamePlatform;

    /**
     * 游客Id
     */
    protected guestid = '';
    /**
     * 登录返回的code凭证
     */
    protected code = '';

    public constructor() {
        super();
        GameSwitch.switchMap[GameSwitch.SWITCH_LOCAL_RES] = 0;
        UCGamePlatform.instance = this;
    }

    getWX() {
        return window['uc'];
    }

    //初始化平台数据
    initPlatformData() {
        LogsManager.echo("hlx 初始化平台数据");
        this.registerAd();
    }

    /**调取对应平台的分享 */
    shareAldAppMsg(data: any) {
        this.getWX().shareAppMessage(data);
    }
    myOnShare(callback: Function) {
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
                    } else {
                        // 游客账号
                        mythis._sendGlobalLoginReq();
                    }
                },
                fail: function (data) {
                    LogsManager.warn("hlx isLogin fail");
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
            "method": MethodCommon.global_Account_loginUC,
            "params": {
                "code": this.code,
                "guestid": this.guestid,
                "device": Global.deviceModel,
                "comeFrom": UserInfo.LoginSceneInfo,
                "sceneId": String(Global.sceneId),
            }
        };
        this.reqGlobal(gParams);
    }

    /**
     * 获取游客信息
     */
    _guestLogin(callback = null, thisObj = null) {
        if (this.guestid) {
            LogsManager.echo("hlx _guestLogin 已经进行过游客登录，直接成功回调");
            callback && callback.call(thisObj, true);
            return;
        }

        var myThis = this;
        this.getWX().getGuestInfo({
            success: function (res) {
                LogsManager.echo("getGuestInfo 加载成功", JSON.stringify(res));
                if (res.guestid) {
                    myThis.guestid = res.guestid;
                    // 废弃userInfoData 使用 platformUserInfo
                    myThis.platformUserInfo = { "name": res.nickName, "headImage": res.avatarUrl };
                    callback && callback.call(thisObj, true);
                } else {
                    LogsManager.errorTag("getGuestInfo_error", "getGuestInfo 加载成功,返回值异常");
                    callback && callback.call(thisObj, false);
                }
            },
            fail: function (res) {
                try {
                    LogsManager.errorTag("getGuestInfo_error", "getGuestInfo 加载失败", JSON.stringify(res));
                } catch (e) {
                    LogsManager.errorTag("getGuestInfo_error", "getGuestInfo 加载失败,无法序列化error");
                }
                callback && callback.call(thisObj, false);
            }
        })
    }

    /**
     * 账号登陆
     */
    _login(callback, thisObj) {
        var myThis = this;
        try {
            this.getWX().login({
                success: function (res) {
                    LogsManager.echo('>>login成功回调>>', JSON.stringify(res));
                    myThis.setLaunchOptions();
                    if (res && res.code) {
                        myThis.code = res.code;
                        callback && callback.call(thisObj, true);
                    } else {
                        LogsManager.errorTag("login_error", "login 加载成功,返回值异常");
                        callback && callback.call(thisObj, false);
                    }
                },
                fail: function (err) {
                    LogsManager.warn('>>login失败回调>>', err);
                    callback && callback.call(thisObj, false);
                }
            })
        } catch (e) {
            LogsManager.echo('login_error:', e);
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
                LogsManager.echo("hlx UC getSetting success", JSON.stringify(res));
                if (res.userInfo) {
                    LogsManager.echo("hlx UC start getUserInfo")
                    myThis.getWX().getUserInfo({
                        success(res) {
                            LogsManager.echo("hlx UC getUserInfo success", JSON.stringify(res))
                            // 废弃userInfoData
                            // myThis.userInfoData = {userInfo:res};
                            myThis.platformUserInfo = { "name": res.nickName, "headImage": res.avatarUrl };
                            myThis.sendKakuraInit();
                        }, fail(err) {
                            LogsManager.echo("hlx UC getUserInfo fail", JSON.stringify(err))
                            myThis.sendKakuraInit();
                        }
                    })
                } else {
                    myThis.sendKakuraInit();
                }
            },
            fail: () => {
                LogsManager.echo("hlx UC getSetting ==fail===");
                myThis.sendKakuraInit();
            },
        });
    }
    //添加监听事件
    protected addListener() {
        LogsManager.echo("hlx addListener ",typeof window['onerror']);

        window['onerror'] = function (errorMessage, scriptURI, lineNumber,columnNumber,errorObj)
        {
            LogsManager.systemError("onError!!!!!!!!!!!!", JSON.stringify(errorMessage));
        }
    }
}
