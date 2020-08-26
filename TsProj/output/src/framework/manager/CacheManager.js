"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStorageManager_1 = require("./LocalStorageManager");
const FileUtils_1 = require("../utils/FileUtils");
const LogsManager_1 = require("./LogsManager");
const UserInfo_1 = require("../common/UserInfo");
class CacheManager {
    constructor() {
        this._localCache = {};
        this._globalCache = {};
        this._fileCacheName = "fileStorageCache.txt";
        this._fileCachePath = "fileStorage/";
        this._localCache = {};
        this._globalCache = {};
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new CacheManager();
        }
        return this._instance;
    }
    //写入local数据，跟rid相关的，在换号时会清除
    setLocalCache(key, value) {
        this.addRidKeys(key + this._rid);
        this._localCache[key + this._rid] = value;
        LocalStorageManager_1.default.setItem(key + this._rid, value);
    }
    //remove用户相关数据
    clearLocalCache(rid = this._rid) {
        var ridKey = LocalStorageManager_1.default.getItem(rid);
        if (ridKey) {
            var keys = ridKey.split(",");
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                LocalStorageManager_1.default.removeItem(key);
            }
            LocalStorageManager_1.default.removeItem(rid);
        }
        this._localCache = {};
    }
    getLocalCache(key) {
        var key = key + this._rid;
        if (this._localCache[key]) {
            return this._localCache[key];
        }
        else {
            this._localCache[key] = LocalStorageManager_1.default.getItem(key);
            return this._localCache[key];
        }
    }
    removeLocalCache(key) {
        if (key != this._rid) {
            LocalStorageManager_1.default.removeItem(key + this._rid);
            this._localCache[key + this._rid] = "0";
        }
    }
    setRid(rid) {
        this._rid = rid;
    }
    //在对应的rid下添加key
    addRidKeys(key) {
        var ridKey = LocalStorageManager_1.default.getItem(this._rid);
        var isHave = false;
        if (ridKey) {
            var keys = ridKey.split(",");
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == key) {
                    isHave = true;
                    break;
                }
            }
        }
        if (!isHave) {
            LocalStorageManager_1.default.setItem(this._rid, ridKey + "," + key);
        }
    }
    //写入全局的缓存数据，在换号登录时不清
    setGlobalCache(key, value) {
        LocalStorageManager_1.default.setItem(key, value);
        this._globalCache[key] = value;
    }
    //写入全局的缓存数据，在换号登录时不清
    removeGlobalCache(key) {
        LocalStorageManager_1.default.removeItem(key);
        this._globalCache[key] = "0";
    }
    //清除所有数据
    clearStorage() {
        LocalStorageManager_1.default.clearStorage();
    }
    //获取全局缓存
    getGlobalCache(key) {
        if (this._globalCache[key]) {
            return this._globalCache[key];
        }
        else {
            this._globalCache[key] = LocalStorageManager_1.default.getItem(key);
            return this._globalCache[key];
        }
    }
    //设置文件级别的缓存
    setFileStorageCache(key, value) {
        if (!FileUtils_1.default.isUserWXSource() || UserInfo_1.default.isVivo()) {
            this.setGlobalCache(key, value);
            return;
        }
        this.initFileStorageCahce();
        //如果已经相等了 那么就没必要再写文件了,防止频繁写文件报错
        if (this._fileStorage[key] == value) {
            return;
        }
        this._fileStorage[key] = value;
        var jsStr = JSON.stringify(this._fileStorage);
        //把这个写入文件系统
        FileUtils_1.default.saveFileData(this._fileCacheName, this._fileCachePath, jsStr);
    }
    getFileStorageCache(key) {
        //web版 走正常的cache
        if (!FileUtils_1.default.isUserWXSource() || UserInfo_1.default.isVivo()) {
            return this.getGlobalCache(key);
        }
        this.initFileStorageCahce();
        return this._fileStorage[key] || "0";
        // this._fileStorage
    }
    //初始化文件缓存
    initFileStorageCahce() {
        if (this._fileStorage) {
            return;
        }
        var fileInfo = FileUtils_1.default.getLocalFileData(this._fileCachePath + this._fileCacheName);
        if (this._fileStorage) {
            LogsManager_1.default.warn("出现了文件存在但是读取失败的现象,防止_fileStorage 被覆盖");
            return;
        }
        if (!fileInfo) {
            this._fileStorage = {};
        }
        else {
            LogsManager_1.default.echo("fileCachestr:", fileInfo);
            try {
                this._fileStorage = JSON.parse(fileInfo);
            }
            catch (e) {
                this._fileStorage = {};
                LogsManager_1.default.warn("FileStorageCahceError", "cacheStr:" + fileInfo);
            }
        }
    }
}
exports.default = CacheManager;
//# sourceMappingURL=CacheManager.js.map