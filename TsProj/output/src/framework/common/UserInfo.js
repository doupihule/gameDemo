"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformIdType = void 0;
const WXGamePlatform_1 = require("../platform/WXGamePlatform");
const EgretPlatform_1 = require("../platform/EgretPlatform");
const QQGamePlatform_1 = require("../platform/QQGamePlatform");
const TTGamePlatform_1 = require("../platform/TTGamePlatform");
const OppoGamePlatform_1 = require("../platform/OppoGamePlatform");
const Global_1 = require("../../utils/Global");
const SceneReference_1 = require("../consts/SceneReference");
const BaiduGamePlatform_1 = require("../platform/BaiduGamePlatform");
const VivoGamePlatform_1 = require("../platform/VivoGamePlatform");
const UCGamePlatform_1 = require("../platform/UCGamePlatform");
const AndroidGamePlatform_1 = require("../platform/AndroidGamePlatform");
const IosGamePlatform_1 = require("../manager/IosGamePlatform");
const PackConfigManager_1 = require("../manager/PackConfigManager");
/**
 * Created by ericcao on 14/11/25.
 */
class UserInfo {
    /**场景值信息 */
    static get LoginSceneInfo() {
        if (!Global_1.default.firstRunSystemInfo.sceneId) {
            return "no info";
        }
        return SceneReference_1.default.getSceneName(Global_1.default.firstRunSystemInfo.sceneId) + Global_1.default.firstRunSystemInfo.appId;
    }
    //是否是android游戏 注意和isOnAndroidDevice区分
    static isSystemAndroid() {
        return this.systemId == "android";
    }
    //是否是mini小游戏 
    static isSystemMini() {
        return this.systemId == "mini";
    }
    //是否是mini小游戏 
    static isSystemIos() {
        return this.systemId == "ios";
    }
    //是否是native游戏 android或者ios
    static isSystemNative() {
        return this.systemId == "ios" || this.systemId == "android";
    }
    static initDeviceSys() {
        if (this.deviceSys) {
            return;
        }
        if (UserInfo.systemId == "mini") {
            var rt = Global_1.default.getOs();
            if (rt == "IPad" || rt == "IOS" || rt == "IPhone") {
                this.deviceSys = "ios";
            }
            else if (rt == "Android") {
                this.deviceSys = "android";
            }
            else {
                this.deviceSys = "window";
            }
        }
        else if (UserInfo.isSystemIos()) {
            this.deviceSys = "ios";
        }
        else if (UserInfo.isSystemAndroid()) {
            this.deviceSys = "android";
        }
        else {
            this.deviceSys = "window";
        }
    }
    //是否是ios设备
    static isOnIosDevice() {
        this.initDeviceSys();
        return this.deviceSys == "ios";
    }
    //是否是android设备
    static isOnAndroidDevice() {
        this.initDeviceSys();
        return this.deviceSys == "android";
    }
    //初始化系用户
    static initSystemId() {
        var androidStr = "android";
        var iosStr = "ios";
        if (this.platformId.slice(0, androidStr.length) == androidStr) {
            this.systemId = androidStr;
        }
        else if (this.platformId.slice(0, iosStr.length) == iosStr) {
            this.systemId = iosStr;
        }
        else {
            this.systemId = "mini";
        }
        window["LogsManager"].echo("xd initSystemId:" + this.systemId);
    }
    static init() {
        this.urlParams = this.parseUrl() || {};
        //初始化systemId  这个不走服务器配置
        this.initSystemId();
        if (this.isSystemAndroid()) {
            this.platform = new AndroidGamePlatform_1.default();
        }
        else if (this.isSystemIos()) {
            this.platform = new IosGamePlatform_1.default();
        }
        else {
            if (this.isTT()) {
                //头条
                this.platform = new TTGamePlatform_1.default();
            }
            else if (this.isWX()) {
                this.platform = new WXGamePlatform_1.default();
            }
            else if (this.isQQGame()) {
                this.platform = new QQGamePlatform_1.default();
            }
            else if (this.isWeb()) {
                this.platform = new EgretPlatform_1.default();
            }
            else if (this.isOppo()) {
                this.platform = new OppoGamePlatform_1.default();
            }
            else if (this.isBaidu()) {
                this.platform = new BaiduGamePlatform_1.BaiduGamePlatform();
            }
            else if (this.isVivo()) {
                this.platform = new VivoGamePlatform_1.default();
            }
            else if (this.isUC()) {
                this.platform = new UCGamePlatform_1.default();
            }
            else {
                this.platform = new EgretPlatform_1.default();
            }
        }
        this.platform.initPlatform();
        ////@change 框架底层调用 用户来源
        // this.platform.setUserComeFrom();
    }
    static isWeb() {
        return this.platformId == PlatformIdType.web;
    }
    /**是否为头条 */
    static isTT() {
        return this.platformId == PlatformIdType.tt;
    }
    static isWX() {
        return this.platformId == PlatformIdType.wxgame;
    }
    static isQQGame() {
        return this.platformId == PlatformIdType.qqgame;
    }
    static isOppo() {
        return this.platformId == PlatformIdType.oppo;
    }
    static isBaidu() {
        return this.platformId == PlatformIdType.baidugame;
    }
    static isVivo() {
        return this.platformId == PlatformIdType.vivogame;
    }
    //static addMsg(msg:string):void {
    //    this.msgLab.text += msg + "\r\n";
    //}
    static isUC() {
        return this.platformId == PlatformIdType.ucgame;
    }
    /**
     * 是否是测试状态
     */
    static isTest() {
        if (UserInfo.isWeb() || PackConfigManager_1.default.ins.platform.platform == "test") {
            return true;
        }
        return false;
    }
    //获取native默认的用户id 目前暂定 systemid+deviceid
    static getNativeDefaultUid() {
        return this.systemId + Global_1.default.deviceId;
    }
    /**
     * 获取url后面参数
     */
    static parseUrl() {
        var obj = {};
        if (this.paramStr) {
            var params = this.paramStr.split('&');
            var len = params.length;
            for (var i = 0; i < len; i++) {
                var value = params[i].replace(/#.*$/g, '').split('=');
                if (!value[1]) {
                    value[1] = '';
                }
                obj[value[0]] = value[1];
            }
        }
        return obj;
    }
}
exports.default = UserInfo;
//url参数
UserInfo.paramStr = "";
UserInfo.urlParams = null;
//应用平台ID
// 如果设置为 "tt"，则为头条
// static platformId = "web";
// static platformId = "wxgame";
// static platformId = "qqgame";
UserInfo.platformId = "tt";
// static platformId = "oppogame";
// static platformId = "baidugame";
// static platformId = "android_master";
// static platformId = "ios_master";
//当前进入平台
UserInfo.platform = null;
//当前是wx体验版开发版还是正式版
UserInfo.wxVersionType = null;
//媒体类型 1穿山甲, 2广点通 由对应的项目 自己在Main.ts里面设置
UserInfo.adMediaType = 1;
//系统 分 mini, android,ios 默认是mini 
UserInfo.systemId = "mini";
//是否启用httpServer 默认是false. 需要各自项目在Main.ts里面手动调用 .如果 是使用httpserver的.那么后面需要强制登入成功
UserInfo.isUseHttpServer = false;
UserInfo.language = "zh_CN";
//默认的设计语言,养龙现在是zh_en
UserInfo.defaultLanguage = "zh_CN";
UserInfo.isNewAccount = false;
//渠道id对应的包名映 
UserInfo._channelIdToPackageMap = {
    "android_qs": "akgame",
};
//应用平台ID
class AppIdType {
}
//测试
AppIdType.test = "9173";
//qq浏览器
AppIdType.qqbrowser = "ogqq";
//微信公众号
AppIdType.wxhortor = "hortor";
//微信公众号
AppIdType.gz1758 = "i1758";
//egret
AppIdType.egret = "egret";
//wxgame
AppIdType.wxgame = "wxgame";
//应用平台ID
class PlatformIdType {
}
exports.PlatformIdType = PlatformIdType;
//测试
PlatformIdType.test = "9173";
//qq浏览器
PlatformIdType.qqbrowser = "ogqq";
//微信公众号
PlatformIdType.wxhortor = "hortor";
//微信公众号
PlatformIdType.gz1758 = "i1758";
//egret
PlatformIdType.egret = "egret";
//wxgame
PlatformIdType.wxgame = "wxgame";
//web
PlatformIdType.web = "web";
//facebook
PlatformIdType.facebook = "facebook";
//qqgame
PlatformIdType.qqgame = "qqgame";
PlatformIdType.tt = "tt";
//oppogame
PlatformIdType.oppo = "oppogame";
// 百度
PlatformIdType.baidugame = "baidugame";
// Vivo
PlatformIdType.vivogame = "vivogame";
// UC
PlatformIdType.ucgame = "ucgame";
// android 官网包
PlatformIdType.android_master = "android_master";
//android 快手
PlatformIdType.android_qs = "android_qs";
PlatformIdType.adMedia_gdt = 2; //广点通
PlatformIdType.adMedia_tt = 1; //穿山甲
//# sourceMappingURL=UserInfo.js.map