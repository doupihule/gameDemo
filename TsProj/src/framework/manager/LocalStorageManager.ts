import UserInfo from "../common/UserInfo";
import FileUtils from "../utils/FileUtils";
import GameConsts from "../../game/sys/consts/GameConsts";
import TableUtils from "../utils/TableUtils";
import LogsManager from "./LogsManager";

export enum StorageKey {
	HIGHEST_SCORE = "HIGHEST_SCORE",
	HIGHEST_GOAL = "HIGHEST_GOAL",
	HIGHEST_COIN = "HIGHEST_COIN",
}

export default class LocalStorageManager {
	public static setItem(key: string, value: string): void {
		if (UserInfo.isSystemNative()) {
			this.nativeSetItem(key, value);
			return;
		}
		if (FileUtils.isUserWXSource()) {
			try {
				window["wx"].setStorageSync(key, value)
			} catch (e) {
			}

			return;
		} else {
			localStorage.setItem(key, value);
		}
	}

	public static getItem(key: string): string {
		if (UserInfo.isSystemNative()) {
			return this.nativeGetItem(key);
		}
	}

	public static removeItem(key: string): void {
		if (UserInfo.isSystemNative()) {
			this.nativeRemoveItem(key);
			return;
		}
		if (UserInfo.isWX()) {
			try {
				window["wx"].removeStorageSync(key)
			} catch (e) {
			}

			return;
		} else {
			localStorage.removeItem(key);
		}
	}

	public static clearStorage(): void {
		if (UserInfo.isWX()) {
			try {
				window["wx"].clearStorageSync();
			} catch (e) {
			}
			return;
		} else {
			localStorage.clear();
		}
	}

	private static _localStorageMap: any;
	private static _localStorageUrl: string;

	private static initNativeStorageMap() {
		if (this._localStorageMap != null) {
			return;
		}
		if (!window["conchConfig"]) {
			return;
		}
		var path = window["conchConfig"].getStoragePath();
		this._localStorageUrl = path + "/" + GameConsts.gameCode + "_" + UserInfo.platformId;
		var localStr = window["readFileSync"](this._localStorageUrl, 'utf8') || '{}';

		this._localStorageMap = TableUtils.safelyJsonParse(localStr);
	}

	private static saveNativeCacheMap() {
		window["writeStrFileSync"](this._localStorageUrl, JSON.stringify(this._localStorageMap));
	}


	//针对native设置本地缓存
	public static nativeSetItem(key: string, value) {
		this.initNativeStorageMap();
		if (!this._localStorageMap) {
			localStorage.setItem(key, value);
			return;
		}
		this._localStorageMap[key] = value;
		this.saveNativeCacheMap()
	}

	public static nativeRemoveItem(key: string) {
		this.initNativeStorageMap();
		if (!this._localStorageMap) {
			localStorage.removeItem(key);
			return;
		}
		delete this._localStorageMap[key];
		this.saveNativeCacheMap()
	}

	//针对native 获取本地缓存
	public static nativeGetItem(key: string) {
		this.initNativeStorageMap()
		if (!this._localStorageMap) {
			return localStorage.getItem(key);
		}
		var rt = this._localStorageMap[key]
		LogsManager.echo("nativeGetItem:" + key, rt);
		if (!rt) {
			rt = localStorage.getItem(key)
			LogsManager.echo("localStorage.getItem:" + key, rt);
			if (rt) {
				this._localStorageMap[key] = rt
			}
		}


		return rt || "0"
	}
}