import LocalStorageManager from "./LocalStorageManager";
import FileUtils from "../utils/FileUtils";
import LogsManager from "./LogsManager";

import UserInfo from "../common/UserInfo";

export default class CacheManager {
	private static _instance: CacheManager;
	private _localCache = {};
	private _globalCache = {};
	private _rid: string;

	private _fileStorage;
	private _fileCacheName = "fileStorageCache.txt";
	private _fileCachePath = "fileStorage/"


	constructor() {
		this._localCache = {};
		this._globalCache = {};
	}

	static get instance(): CacheManager {
		if (!this._instance) {
			this._instance = new CacheManager();
		}
		return this._instance;
	}

	//写入local数据，跟rid相关的，在换号时会清除
	setLocalCache(key: string, value: any) {
		this.addRidKeys(key + this._rid);
		this._localCache[key + this._rid] = value;
		LocalStorageManager.setItem(key + this._rid, value);
	}

	//remove用户相关数据
	clearLocalCache(rid: string = this._rid) {
		var ridKey = LocalStorageManager.getItem(rid);
		if (ridKey) {
			var keys = ridKey.split(",");
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i]
				LocalStorageManager.removeItem(key);
			}
			LocalStorageManager.removeItem(rid);
		}
		this._localCache = {};
	}

	getLocalCache(key: string) {
		var key = key + this._rid;
		if (this._localCache[key]) {
			return this._localCache[key]
		} else {
			this._localCache[key] = LocalStorageManager.getItem(key);
			return this._localCache[key]
		}

	}

	removeLocalCache(key: string) {
		if (key != this._rid) {
			LocalStorageManager.removeItem(key + this._rid);
			this._localCache[key + this._rid] = "0";
		}
	}

	setRid(rid: string) {
		this._rid = rid;
	}

	//在对应的rid下添加key
	addRidKeys(key: string) {
		var ridKey = LocalStorageManager.getItem(this._rid);

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
			LocalStorageManager.setItem(this._rid, ridKey + "," + key);
		}
	}

	//写入全局的缓存数据，在换号登录时不清
	setGlobalCache(key: string, value: any) {
		LocalStorageManager.setItem(key, value);
		this._globalCache[key] = value;
	}

	//写入全局的缓存数据，在换号登录时不清
	removeGlobalCache(key: string) {
		LocalStorageManager.removeItem(key);
		this._globalCache[key] = "0";
	}

	//清除所有数据
	clearStorage() {
		LocalStorageManager.clearStorage();
	}

	//获取全局缓存
	getGlobalCache(key: string) {
		if (this._globalCache[key]) {
			return this._globalCache[key]
		} else {
			this._globalCache[key] = LocalStorageManager.getItem(key);
			return this._globalCache[key]
		}
	}


	//设置文件级别的缓存
	setFileStorageCache(key: string, value: any) {
		if (!FileUtils.isUserWXSource() || UserInfo.isVivo()) {
			this.setGlobalCache(key, value);
			return;
		}
		this.initFileStorageCahce();
		//如果已经相等了 那么就没必要再写文件了,防止频繁写文件报错
		if (this._fileStorage[key] == value) {
			return
		}
		this._fileStorage[key] = value;
		var jsStr = JSON.stringify(this._fileStorage);
		//把这个写入文件系统
		FileUtils.saveFileData(this._fileCacheName, this._fileCachePath, jsStr);
	}

	getFileStorageCache(key: string) {
		//web版 走正常的cache
		if (!FileUtils.isUserWXSource() || UserInfo.isVivo()) {
			return this.getGlobalCache(key);
		}
		this.initFileStorageCahce();
		return this._fileStorage[key] || "0";

		// this._fileStorage
	}

	//初始化文件缓存
	private initFileStorageCahce() {
		if (this._fileStorage) {
			return;
		}
		var fileInfo = FileUtils.getLocalFileData(this._fileCachePath + this._fileCacheName);

		if (this._fileStorage) {
			LogsManager.warn("出现了文件存在但是读取失败的现象,防止_fileStorage 被覆盖")
			return;
		}

		if (!fileInfo) {
			this._fileStorage = {};
		} else {
			LogsManager.echo("fileCachestr:", fileInfo);
			try {
				this._fileStorage = JSON.parse(fileInfo);
			} catch (e) {
				this._fileStorage = {};
				LogsManager.warn("FileStorageCahceError", "cacheStr:" + fileInfo);
			}
		}

	}


}
