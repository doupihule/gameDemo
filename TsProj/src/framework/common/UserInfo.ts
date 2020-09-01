import GamePlatform from "../platform/GamePlatform";
import WXGamePlatform from "../platform/WXGamePlatform";
import EgretPlatform from "../platform/EgretPlatform";
import QQGamePlatform from "../platform/QQGamePlatform";
import TTGamePlatform from "../platform/TTGamePlatform";
import OppoGamePlatform from "../platform/OppoGamePlatform";
import Global from "../../utils/Global";
import SceneReference from "../consts/SceneReference";
import {BaiduGamePlatform} from "../platform/BaiduGamePlatform";
import VivoGamePlatform from "../platform/VivoGamePlatform";
import UCGamePlatform from "../platform/UCGamePlatform";
import AndroidGamePlatform from "../platform/AndroidGamePlatform";
import IosGamePlatform from "../manager/IosGamePlatform";
import PackConfigManager from "../manager/PackConfigManager";

/**
 * Created by ericcao on 14/11/25.
 */


export default class UserInfo {
	//url参数
	private static paramStr: string = "";
	private static urlParams: any = null;
	//应用平台ID
	// 如果设置为 "tt"，则为头条
	// static platformId = "web";
	// static platformId = "wxgame";
	// static platformId = "qqgame";
	static platformId = "tt";
	// static platformId = "oppogame";
	// static platformId = "baidugame";
	// static platformId = "android_master";
	// static platformId = "ios_master";
	//当前进入平台
	static platform: GamePlatform = null;
	//当前是wx体验版开发版还是正式版
	static wxVersionType: string = null;

	//媒体类型 1穿山甲, 2广点通 由对应的项目 自己在Main.ts里面设置
	static adMediaType: number = 1;

	//系统 分 mini, android,ios 默认是mini 
	static systemId: string = "mini"

	//是否启用httpServer 默认是false. 需要各自项目在Main.ts里面手动调用 .如果 是使用httpserver的.那么后面需要强制登入成功
	static isUseHttpServer: boolean = false;

	/**场景值信息 */
	static get LoginSceneInfo() {
		return "no info"
	}

	//用户openId
	static channelUserId: string;
	//用户性别
	static userSex: number;

	static language: string = "zh_CN";
	//默认的设计语言,养龙现在是zh_en
	static defaultLanguage: string = "zh_CN"

	static isNewAccount: boolean = false;


	//是否是android游戏 注意和isOnAndroidDevice区分
	static isSystemAndroid() {
		return this.systemId == "android"
	}

	//是否是mini小游戏
	static isSystemMini() {
		return this.systemId == "mini"
	}

	//是否是mini小游戏
	static isSystemIos() {
		return this.systemId == "ios"
	}

	//是否是native游戏 android或者ios
	static isSystemNative() {
		return this.systemId == "ios" || this.systemId == "android";
	}

	//渠道id对应的包名映
	private static _channelIdToPackageMap: any = {
		"android_qs": "akgame",            //android 快手
	}


	//设备所在的系统  ios android window
	static deviceSys: string;

	static initDeviceSys() {
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
	private static initSystemId() {
		var androidStr: string = "android";
		var iosStr: string = "ios";
		if (this.platformId.slice(0, androidStr.length) == androidStr) {
			this.systemId = androidStr;
		} else if (this.platformId.slice(0, iosStr.length) == iosStr) {
			this.systemId = iosStr;
		} else {
			this.systemId = "mini";
		}
		window["LogsManager"].echo("xd initSystemId:" + this.systemId);
	}

	static init(): void {
		this.urlParams = this.parseUrl() || {};
		//初始化systemId  这个不走服务器配置
		this.initSystemId();
		if (this.isSystemAndroid()) {
			this.platform = new AndroidGamePlatform();
		} else if (this.isSystemIos()) {
			this.platform = new IosGamePlatform();
		} else {
			if (this.isTT()) {
				//头条
				this.platform = new TTGamePlatform();
			} else if (this.isWX()) {
				this.platform = new WXGamePlatform();
			} else if (this.isQQGame()) {
				this.platform = new QQGamePlatform();
			} else if (this.isWeb()) {
				this.platform = new EgretPlatform();
			} else if (this.isOppo()) {
				this.platform = new OppoGamePlatform();
			} else if (this.isBaidu()) {
				this.platform = new BaiduGamePlatform();
			} else if (this.isVivo()) {
				this.platform = new VivoGamePlatform();
			} else if (this.isUC()) {
				this.platform = new UCGamePlatform();
			} else {
				this.platform = new EgretPlatform();
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
	static isTest(): boolean {
		if (UserInfo.isWeb() || PackConfigManager.ins.platform.platform == "test") {
			return true;
		}
		return false;
	}


	/**
	 * 获取url后面参数
	 */
	private static parseUrl(): Object {
		var obj: any = {};
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


//应用平台ID
class AppIdType {
	//测试
	static test = "9173";
	//qq浏览器
	static qqbrowser = "ogqq";
	//微信公众号
	static wxhortor = "hortor";
	//微信公众号
	static gz1758 = "i1758";
	//egret
	static egret = "egret";
	//wxgame
	static wxgame = "wxgame";
}

//应用平台ID
export class PlatformIdType {
	//测试
	static test = "9173";
	//qq浏览器
	static qqbrowser = "ogqq";
	//微信公众号
	static wxhortor = "hortor";
	//微信公众号
	static gz1758 = "i1758";
	//egret
	static egret = "egret";
	//wxgame
	static wxgame = "wxgame";
	//web
	static web = "web";
	//facebook
	static facebook = "facebook";
	//qqgame
	static qqgame = "qqgame";
	static tt = "tt";
	//oppogame
	static oppo = "oppogame";
	// 百度
	static baidugame = "baidugame";
	// Vivo
	static vivogame = "vivogame";
	// UC
	static ucgame = "ucgame";
	// android 官网包
	static android_master = "android_master";
	//android 快手
	static android_qs = "android_qs";

	static adMedia_gdt: number = 2;      //广点通
	static adMedia_tt: number = 1;       //穿山甲

}