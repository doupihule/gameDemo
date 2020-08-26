"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScreenAdapterTools_1 = require("../framework/utils/ScreenAdapterTools");
const LogsManager_1 = require("../framework/manager/LogsManager");
const UserModel_1 = require("../game/sys/model/UserModel");
const CacheManager_1 = require("../framework/manager/CacheManager");
const GameUtils_1 = require("./GameUtils");
const StorageCode_1 = require("../game/sys/consts/StorageCode");
class Global {
    static setPhoneSys(sysInfo) {
        var phoneModel = sysInfo.model;
        Global.deviceModel = phoneModel;
        if (phoneModel.indexOf("iPhone") > -1 || phoneModel.indexOf("iPad") > -1) {
            this.phoneSys = "iphone";
        }
        else if (phoneModel.indexOf("Android"))
            this.phoneSys = "android";
        var keys = Object.keys(this.PHONE_BANGS);
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var key = keys[i];
            if (phoneModel.indexOf(key) > -1) {
                LogsManager_1.default.echo("yrc 配置机型", phoneModel, key);
                this.isPhoneBangs = true;
                ScreenAdapterTools_1.default.toolBarWidth = 60;
            }
        }
        //如果长宽比小于2 那么一定不是刘海设备
        if (ScreenAdapterTools_1.default.height / ScreenAdapterTools_1.default.width > 2) {
            var barH = sysInfo.statusBarHeight;
            if (barH > 44) {
                LogsManager_1.default.echo("yrc 根据微信/头条返回的判断为刘海屏,statusBarHeight", barH);
                this.isPhoneBangs = true;
                ScreenAdapterTools_1.default.toolBarWidth = 60;
            }
        }
        this.windowWidth = sysInfo.windowWidth || this.windowWidth;
        this.windowHeight = sysInfo.windowHeight || this.windowHeight;
        if (sysInfo.version) {
            this.wxVersion = sysInfo.version;
        }
        if (sysInfo.SDKVersion) {
            this.SDKVersion = sysInfo.SDKVersion;
        }
        if (sysInfo && sysInfo.platform && sysInfo.platform == "devtools") {
            Global.isDevTools = true;
        }
        // ScreenAdapterTools.toolBarWidth = Global.IPXOffset;
        LogsManager_1.default.echo(">>>>>system>>>>>>", sysInfo);
    }
    /**获取当前操作系统 */
    static getOs() {
        if (Laya.Browser.onAndroid) {
            return "Android";
        }
        else if (Laya.Browser.onEdge) {
            return "Edge";
        }
        else if (Laya.Browser.onIE) {
            return "IE";
        }
        else if (Laya.Browser.onIOS) {
            return "IOS";
        }
        else if (Laya.Browser.onIPhone) {
            return "IPhone";
        }
        else if (Laya.Browser.onIPad) {
            return "IPad";
        }
        else if (Laya.Browser.onPC) {
            return "PC";
        }
        else {
            return "UnKnown";
        }
    }
    /**是否已授权用户信息 */
    static isAuthorized() {
        if (!this._isAuthorized) {
            var headImg = UserModel_1.default.instance.getUserHead();
            if (headImg && headImg.indexOf("localres") <= -1) {
                //判断如果头像不是localRes的，则认为是已经授权过的
                this._isAuthorized = true;
            }
        }
        return this._isAuthorized;
    }
    /**判断是否未经过第一次引导 */
    static isNotGuide() {
        var guideSta = CacheManager_1.default.instance.getFileStorageCache(StorageCode_1.default.storage_wxGuide);
        var notGuide = guideSta == "0";
        return notGuide;
    }
    /**判断是否未经过老玩家转换 */
    static isNew() {
        var guideSta = CacheManager_1.default.instance.getFileStorageCache(StorageCode_1.default.storage_isOldPlayer);
        var notGuide = guideSta == "0";
        return notGuide;
    }
    static get deviceId() {
        if (!this._deviceId) {
            var deviceStr = StorageCode_1.default.storage_deviceStr;
            var deId = CacheManager_1.default.instance.getFileStorageCache(deviceStr);
            if (!deId || deId == "0") {
                deId = "" + Laya.Browser.now() + "_" + GameUtils_1.default.getRandomInt(10000, 99999);
                CacheManager_1.default.instance.setFileStorageCache(deviceStr, deId);
            }
            this._deviceId = deId;
        }
        return this._deviceId;
    }
    /**获取wx等客户端版本号及基础库SDK版本号 */
    static getSDKInfo() {
        var info = "";
        if (this.wxVersion) {
            info += "  version:" + this.wxVersion;
        }
        if (this.SDKVersion) {
            info += "  SDKVersion:" + this.SDKVersion;
        }
        if (info != "") {
            info += "\n";
        }
        return info;
    }
    /**根据获取到的胶囊位置再次判断是否为刘海屏设备 */
    static reCheckBar(menuInfo) {
        if (this.isPhoneBangs) {
            //如果已经判断是刘海设备，则不需要
            return;
        }
        if (!menuInfo) {
            return;
        }
        var top = menuInfo.top || 0;
        if (top > 16) {
            var offset = top * ScreenAdapterTools_1.default.height / this.windowHeight;
            if (offset > 60) {
                offset = 60;
            }
            ScreenAdapterTools_1.default.toolBarWidth = offset;
            LogsManager_1.default.echo("yrc111 reCheckBar top:", top, "    this.height:", ScreenAdapterTools_1.default.height, "    this.windowHeight:", this.windowHeight, "    toolBarWidth:", ScreenAdapterTools_1.default.toolBarWidth);
        }
    }
    //判断是否是单机
    static checkIsSingleMode() {
        return this.gameMode == this.gameMode_single;
    }
    //判断是否使用云存储
    static checkUserCloudStorage() {
        return this.gameMode == this.gameMode_single;
        // return false;
    }
}
exports.default = Global;
//客户端版本号
Global.client_version = "1.0.0.1";
Global.isCDN = true;
//版本号
Global.version = "";
//设备型号
Global.deviceModel = "blank";
//游戏是否销毁中
Global.isGameDestory = false;
Global.phoneSys = "";
Global.isPhoneBangs = false;
Global.gameMode_single = "single";
Global.gameMode_network = "network";
//暂定10秒同步一次后台数据
Global.updateUserDataDelay = 10000;
//游戏模式  single是单机模式, network是联网模式
Global.gameMode = Global.gameMode_single;
Global.PHONE_BANGS = { "iPhone X": 45, "PACM00": 36, "ANE-AL00": 52, "COL-AL10": 52, "JSN-AL00a": 52, "V1813BA": 52, "PBEM00": 52, "vivo Z3x": 52, "MI 9": 50, "LYA-AL00": 52, "TL00": 52, "GM1910": 52 };
Global.windowWidth = 640;
Global.windowHeight = 1136;
Global.firstRunSystemInfo = {}; //首次启动数据
//wx、tt、qq对应的客户端版本号、基础库版本号
Global.wxVersion = "";
Global.SDKVersion = "";
/**判断是否为开发者工具 */
Global.isDevTools = false;
Global._isAuthorized = false;
//# sourceMappingURL=Global.js.map