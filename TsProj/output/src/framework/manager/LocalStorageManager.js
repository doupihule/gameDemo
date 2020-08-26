"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageKey = void 0;
const UserInfo_1 = require("../common/UserInfo");
const FileUtils_1 = require("../utils/FileUtils");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
const TableUtils_1 = require("../utils/TableUtils");
const LogsManager_1 = require("./LogsManager");
var StorageKey;
(function (StorageKey) {
    StorageKey["HIGHEST_SCORE"] = "HIGHEST_SCORE";
    StorageKey["HIGHEST_GOAL"] = "HIGHEST_GOAL";
    StorageKey["HIGHEST_COIN"] = "HIGHEST_COIN";
})(StorageKey = exports.StorageKey || (exports.StorageKey = {}));
class LocalStorageManager {
    static setItem(key, value) {
        if (UserInfo_1.default.isSystemNative()) {
            this.nativeSetItem(key, value);
            return;
        }
        if (FileUtils_1.default.isUserWXSource()) {
            try {
                window["wx"].setStorageSync(key, value);
            }
            catch (e) { }
            return;
        }
        else {
            localStorage.setItem(key, value);
        }
    }
    static getItem(key) {
        if (UserInfo_1.default.isSystemNative()) {
            return this.nativeGetItem(key);
        }
        if (FileUtils_1.default.isUserWXSource()) {
            try {
                var value1 = window["wx"].getStorageSync(key);
                if (value1) {
                    return value1;
                }
                else {
                    return "0";
                }
            }
            catch (e) {
                return "0";
            }
        }
        else {
            var value = localStorage.getItem(key);
            if (value) {
                return value;
            }
            return "0";
        }
    }
    static removeItem(key) {
        if (UserInfo_1.default.isSystemNative()) {
            this.nativeRemoveItem(key);
            return;
        }
        if (UserInfo_1.default.isWX()) {
            try {
                window["wx"].removeStorageSync(key);
            }
            catch (e) { }
            return;
        }
        else {
            localStorage.removeItem(key);
        }
    }
    static clearStorage() {
        if (UserInfo_1.default.isWX()) {
            try {
                window["wx"].clearStorageSync();
            }
            catch (e) { }
            return;
        }
        else {
            localStorage.clear();
        }
    }
    static initNativeStorageMap() {
        if (this._localStorageMap != null) {
            return;
        }
        if (!window["conchConfig"]) {
            return;
        }
        var path = window["conchConfig"].getStoragePath();
        this._localStorageUrl = path + "/" + GameConsts_1.default.gameCode + "_" + UserInfo_1.default.platformId;
        var localStr = window["readFileSync"](this._localStorageUrl, 'utf8') || '{}';
        this._localStorageMap = TableUtils_1.default.safelyJsonParse(localStr);
    }
    static saveNativeCacheMap() {
        window["writeStrFileSync"](this._localStorageUrl, JSON.stringify(this._localStorageMap));
    }
    //针对native设置本地缓存
    static nativeSetItem(key, value) {
        this.initNativeStorageMap();
        if (!this._localStorageMap) {
            localStorage.setItem(key, value);
            return;
        }
        this._localStorageMap[key] = value;
        this.saveNativeCacheMap();
    }
    static nativeRemoveItem(key) {
        this.initNativeStorageMap();
        if (!this._localStorageMap) {
            localStorage.removeItem(key);
            return;
        }
        delete this._localStorageMap[key];
        this.saveNativeCacheMap();
    }
    //针对native 获取本地缓存
    static nativeGetItem(key) {
        this.initNativeStorageMap();
        if (!this._localStorageMap) {
            return localStorage.getItem(key);
        }
        var rt = this._localStorageMap[key];
        LogsManager_1.default.echo("nativeGetItem:" + key, rt);
        if (!rt) {
            rt = localStorage.getItem(key);
            LogsManager_1.default.echo("localStorage.getItem:" + key, rt);
            if (rt) {
                this._localStorageMap[key] = rt;
            }
        }
        return rt || "0";
    }
}
exports.default = LocalStorageManager;
//# sourceMappingURL=LocalStorageManager.js.map