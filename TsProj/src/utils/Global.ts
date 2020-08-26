import ScreenAdapterTools from "../framework/utils/ScreenAdapterTools";
import LogsManager from "../framework/manager/LogsManager";
import UserModel from "../game/sys/model/UserModel";
import CacheManager from "../framework/manager/CacheManager";
import GameUtils from "./GameUtils";
import StorageCode from "../game/sys/consts/StorageCode";


export default class Global {
	//客户端版本号
	static client_version: string = "1.0.0.1";
	static isCDN: boolean = true;
	//版本号
	static version: string = "";
	static kakura_url: string;
	static global_url: string;
	static resource_url: string;
	static nocdn_resource_url: string;
	//设备型号
	static deviceModel: string = "blank";
	//游戏是否销毁中
	static isGameDestory: boolean = false;

	public static phoneSys: string = "";

	public static isPhoneBangs: boolean = false;
	public static gameMode_single: string = "single";
	public static gameMode_network: string = "network";
	//暂定10秒同步一次后台数据
	public static updateUserDataDelay: number = 10000
	//游戏模式  single是单机模式, network是联网模式
	public static gameMode: string = Global.gameMode_single;
	private static PHONE_BANGS: any = {
		"iPhone X": 45,
		"PACM00": 36,
		"ANE-AL00": 52,
		"COL-AL10": 52,
		"JSN-AL00a": 52,
		"V1813BA": 52,
		"PBEM00": 52,
		"vivo Z3x": 52,
		"MI 9": 50,
		"LYA-AL00": 52,
		"TL00": 52,
		"GM1910": 52
	};


	private static _deviceId: string;//设备id，由时间戳+ 五位随机数生成

	static windowWidth: number = 640;
	static windowHeight: number = 1136;

	static sceneId; //场景值
	static currentSceneId: string;  //当前的场景
	static firstRunSystemInfo: any = {};	//首次启动数据
	//wx、tt、qq对应的客户端版本号、基础库版本号
	public static wxVersion: string = "";
	public static SDKVersion: string = "";
	/**判断是否为开发者工具 */
	public static isDevTools: boolean = false;


	public static setPhoneSys(sysInfo: any): void {
		var phoneModel = sysInfo.model;
		Global.deviceModel = phoneModel;

		if (phoneModel.indexOf("iPhone") > -1 || phoneModel.indexOf("iPad") > -1) {
			this.phoneSys = "iphone";
		} else if (phoneModel.indexOf("Android"))
			this.phoneSys = "android";


		var keys = Object.keys(this.PHONE_BANGS);
		var len: number = keys.length;
		for (var i: number = 0; i < len; i++) {
			var key: string = keys[i];
			if (phoneModel.indexOf(key) > -1) {
				LogsManager.echo("yrc 配置机型", phoneModel, key);
				this.isPhoneBangs = true;
				ScreenAdapterTools.toolBarWidth = 60;
			}
		}

		//如果长宽比小于2 那么一定不是刘海设备
		if (ScreenAdapterTools.height / ScreenAdapterTools.width > 2) {
			var barH: number = sysInfo.statusBarHeight;
			if (barH > 44) {
				LogsManager.echo("yrc 根据微信/头条返回的判断为刘海屏,statusBarHeight", barH);
				this.isPhoneBangs = true;
				ScreenAdapterTools.toolBarWidth = 60;
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
		LogsManager.echo(">>>>>system>>>>>>", sysInfo);

	}


	/**获取当前操作系统 */
	public static getOs() {
		if (Laya.Browser.onAndroid) {
			return "Android";
		} else if (Laya.Browser.onEdge) {
			return "Edge";
		} else if (Laya.Browser.onIE) {
			return "IE";
		} else if (Laya.Browser.onIOS) {
			return "IOS";
		} else if (Laya.Browser.onIPhone) {
			return "IPhone";
		} else if (Laya.Browser.onIPad) {
			return "IPad";
		} else if (Laya.Browser.onPC) {
			return "PC";
		} else {
			return "UnKnown";
		}
	}

	public static _isAuthorized: boolean = false;

	/**是否已授权用户信息 */
	static isAuthorized() {
		if (!this._isAuthorized) {
			var headImg: string = UserModel.instance.getUserHead();
			if (headImg && headImg.indexOf("localres") <= -1) {
				//判断如果头像不是localRes的，则认为是已经授权过的
				this._isAuthorized = true;
			}
		}
		return this._isAuthorized;
	}

	/**判断是否未经过第一次引导 */
	static isNotGuide() {
		var guideSta = CacheManager.instance.getFileStorageCache(StorageCode.storage_wxGuide);
		var notGuide = guideSta == "0";
		return notGuide;
	}

	/**判断是否未经过老玩家转换 */
	static isNew() {
		var guideSta = CacheManager.instance.getFileStorageCache(StorageCode.storage_isOldPlayer);
		var notGuide = guideSta == "0";
		return notGuide;
	}

	static get deviceId() {
		if (!this._deviceId) {
			var deviceStr = StorageCode.storage_deviceStr;
			var deId = CacheManager.instance.getFileStorageCache(deviceStr);
			if (!deId || deId == "0") {
				deId = "" + Laya.Browser.now() + "_" + GameUtils.getRandomInt(10000, 99999);
				CacheManager.instance.setFileStorageCache(deviceStr, deId);
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
	static reCheckBar(menuInfo: any) {
		if (this.isPhoneBangs) {
			//如果已经判断是刘海设备，则不需要
			return;
		}
		if (!menuInfo) {
			return;
		}
		var top = menuInfo.top || 0;
		if (top > 16) {
			var offset = top * ScreenAdapterTools.height / this.windowHeight;
			if (offset > 60) {
				offset = 60;
			}
			ScreenAdapterTools.toolBarWidth = offset;
			LogsManager.echo("yrc111 reCheckBar top:", top, "    this.height:", ScreenAdapterTools.height, "    this.windowHeight:", this.windowHeight, "    toolBarWidth:", ScreenAdapterTools.toolBarWidth)
		}
	}

	//判断是否是单机
	public static checkIsSingleMode() {
		return this.gameMode == this.gameMode_single;
	}

	//判断是否使用云存储
	public static checkUserCloudStorage() {
		return this.gameMode == this.gameMode_single;
		// return false;
	}

}