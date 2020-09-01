
import Global from "../../utils/Global";
import TableUtils from "../utils/TableUtils";
import GameSwitchConst from "../../game/sys/consts/GameSwitchConst";


/**
 * 游戏中的一些开关和静态变量管理器
 */

export default class GameSwitch {

	//命名规范:switch_功能名称 全大写
	//开关静态变量定义
	//gm开关 暂时设置为打开 方便调试 0 是关闭gm,1是打开gm
	static SWITCH_GM_DEBUG: string = "SWITCH_GM_DEBUG";
	//cd修改数据开关 web暂时设置为打开 方便调试 0 是关闭cd,1是打开cd
	static SWITCH_CD_DEBUG: string = "SWITCH_CD_DEBUG";
	//视频广告开关 暂时设为打开(即屏蔽广告) 0 是有广告 1 是禁止广告
	static SWITCH_DISABLE_ADV: string = "SWITCH_DISABLE_ADV";
	//日志显示开关 暂时设为关闭 0是显示  1是 隐藏
	static SWITCH_LOG_PANEL: string = "SWITCH_LOG_PANEL";
	//日志按钮不可显示 暂时设为关闭 0是显示 1 是隐藏
	static SWITCH_LOG_PANEL_DISABLE: string = "SWITCH_LOG_PANEL_DISABLE";
	//是否屏蔽分享开关 打开则为屏蔽分享 0是有分享, 1是屏蔽分享
	static SWITCH_DISABLE_SHARE_NEW: string = "SWITCH_DISABLE_SHARE_NEW";
	//好友邀战 0是开启好友对战  1是禁掉好友对战
	static SWITCH_DISABLE_INVITE_FIGHT: string = "SWITCH_DISABLE_INVITE_FIGHT";
	//是否禁止发送错误日志开关 默认0是发送错误日志 1是禁止发送
	static SWITCH_DISABLE_SENDERRORLOG: string = "SWITCH_DISABLE_SENDERRORLOG";
	//取消文件合并功能 0是使用文件合并功能,1是禁止使用文件合并功能 默认0 是使用合并功能, 开发模式下 可以手动修改为1 不要提交
	static SWITCH_DISABLE_MERGEFILES: string = "SWITCH_DISABLE_MERGEFILES"
	/**是否可以使用分包加载，默认是0：可以使用  1：不可以使用 */
	static SWITCH_DISABLE_SUBPACKAGE = "SWITCH_DISABLE_SUBPACKAGE";
	//取消阿里云上传功能 0是阿里云上传功能,1是禁止阿里云上传功能 默认0 是阿里云上传功能, 开发模式下 可以手动修改为1 不要提交
	static SWITCH_DISABLE_ALIYUN: string = "SWITCH_DISABLE_ALIYUN"
	//是否显示客服功能，1是显示客服 0是不显示客服，默认为0
	static SWITCH_DISABLE_KEFU: string = "SWITCH_DISABLE_KEFU"


	//分享图是否使用本地  默认是0：优先url其次本地分包加载的，1：优先使用本地分包加载其次url
	static SWITCH_DISABLE_SHARE_LOCAL = "SWITCH_DISABLE_SHARE_LOCAL";

	//是否禁止zip功能, 0是 使用zip功能, 1是禁止使用zip功能
	static SWITCH_DISABLE_ZIP: string = "SWITCH_DISABLE_ZIP";
	//是否使用非递归方式创建目录默认0 是使用非递归方式. 
	static SWITCH_DISABLE_MAKEDIR: string = "SWITCH_DISABLE_MAKEDIR";


	//插屏广告延迟时间
	static SCREEN_AD_DELAY: string = "SCREEN_AD_DELAY";
	//原生广告延迟时间
	static ORIGIN_AD_DELAY: string = "ORIGIN_AD_DELAY";
	//banner广告id
	static BANNER_ID: string = "BANNER_ID";
	//视频广告id
	static VIDEO_ID: string = "VIDEO_ID";
	//原生广告插屏 id
	static ORIGIN_ID: string = "ORIGIN_ID";
	//原生广告ICON id
	static ORIGIN_ICON_ID: string = "ORIGIN_ICON_ID";
	//插屏广告id
	static SCREEN_ID: string = "SCREEN_ID";
	//插屏广告间隔时间
	static INTERVAL_TIME: string = "INTERVAL_TIME";
	//插屏广告每日最大次数
	static MAX_TIME: string = "MAX_TIME";
	//原生广告最大次数
	static ORIGIN_TIME: string = "ORIGIN_TIME";
	//红包开关
	static SWITCH_DISABLE_REDPACKET: string = "SWITCH_DISABLE_REDPACKET"
	/**是否资源走本地 0不走 ,1走*/
	static SWITCH_LOCAL_RES: string = "SWITCH_LOCAL_RES";
	//游戏模式：single是单机模式, network是联网模式，默认单机模式
	static SWITCH_GAMEMODE: string = "SWITCH_GAMEMODE";

	/******************************OPPO **********************************/
	/**插屏开关 0显示插屏 1不显示 */
	static SWITCH_DISABLE_INTERSTITIALAD = "SWITCH_DISABLE_INTERSTITIALAD";
	//是否显示直接添加的banner 默认是 0 显示 1为不显示
	static SWITCH_DISABLE_QUICKBANNER = "SWITCH_DISABLE_QUICKBANNER";
	//是否显示带诱导的banner 默认是 0 显示 1为不显示
	static SWITCH_DISABLE_LEADBANNER = "SWITCH_DISABLE_LEADBANNER";
	//是否显示神秘礼包 默认是0 显示 1不显示
	static SWITCH_DISABLE_MYSTERIOUSGIFT = "SWITCH_DISABLE_MYSTERIOUSGIFT";
	/** 神秘礼包显示方式 默认是1 banner>推荐 2 推荐>banner 3序列*/
	static SWITCH_MYSTERIOUSGIFT_TYPE = "SWITCH_MYSTERIOUSGIFT_TYPE";
	//是否显示互推 默认是0 显示 1不显示
	static SWITCH_DISABLE_SHOWJUMP = "SWITCH_DISABLE_SHOWJUMP";
	//是否显示抽屉互推 默认是0 显示 1不显示
	static SWITCH_DISABLE_SHOWJUMP_DRAWER_VIEW = "SWITCH_DISABLE_SHOWJUMP_DRAWER_VIEW";
	// 按event name关闭阿里云日志
	static SWITCH_DISABLE_LOG = "SWITCH_DISABLE_LOG";
	// 按event group关闭阿里云日志
	static SWITCH_DISABLE_LOG_GROUP = "SWITCH_DISABLE_LOG_GROUP";
	//使用服务器同步的cd,  这不是开关值
	public static SWITCH_UPDATE_USERDATA_CD: string = "SWITCH_UPDATE_USERDATA_CD"
	/** 普通banner显示方式 默认是1 广告 2 广告>推荐 3 推荐 4 推荐>广告 */
	static SWITCH_QUICKBANNER_TYPE = "SWITCH_QUICKBANNER_TYPE";
	/** 插屏类型 默认是1    1 广告 2 广告>推荐 3 推荐 4 推荐>广告 */
	static SWITCH_INTERSTITIAL_TYPE = "SWITCH_INTERSTITIAL_TYPE";
	/** 插屏类型 默认值2    1 无 2 广告 > 原生 3 原生 > 广告*/
	static SWITCH_INTERSTITIAL_OPPO_TYPE = "SWITCH_INTERSTITIAL_OPPO_TYPE";

	//推荐组件 BannerId
	static RECOMMEN_BANNER_ID: string = "RECOMMEN_BANNER_ID";
	//推荐组件 插屏Id
	static RECOMMEN_PORTAL_ID: string = "RECOMMEN_PORTAL_ID";
	//落地頁開關 
	static SWITCH_DISABLE_LANGDINGPAGE: string = "SWITCH_DISABLE_LANGDINGPAGE";
	// 原生广告关闭
	static SWITCH_DISABLE_ORIGIN: string = "SWITCH_DISABLE_ORIGIN";
	//充值开关
	static SWITCH_DISIBLE_CHARGE: string = "SWITCH_DISIBLE_CHARGE";
	// 百度互推开关
	static SWITCH_DISIBLE_RECOMMEND_BAIDU: string = "SWITCH_DISIBLE_RECOMMEND_BAIDU";

	static SWITCH_DISABLE_LOWDEVICE: string = "SWITCH_DISABLE_LOWDEVICE";
	// 插屏互推开关
	static SWITCH_INTER_JUMP: string = "SWITCH_INTER_JUMP";
	//是否开启审核版本 默认是0 1当前是审核版本 0是不是审核版本
	static SWITCH_DISABLE_REVIEW: string = "SWITCH_DISABLE_REVIEW"
	//是否开启永久白名单
	static SWITCH_ALL_IN_WHITE_LIST: string = "SWITCH_ALL_IN_WHITE_LIST"
	//互推抽屉样式 1全屏 2抽屉
	static SWITCH_DRAWER_TYPE: string = "SWITCH_DRAWER_TYPE";
	//移位误触开关 0关闭 1开启
	static SWITCH_BTN_MOVE: string = "SWITCH_BTN_MOVE";
	//黑明单城市名称
	static SWITCH_BLACK_IP_CITY: string = "SWITCH_BLACK_IP_CITY";
	//获取ip对应城市失败，是否拉黑用户 1拉黑 0不处理
	static SWITCH_BLACK_IP_FAIL_TYPE: string = "SWITCH_BLACK_IP_FAIL_TYPE";
	//屏蔽指定报错errorTag组格式用竖线分割  configserror|testerror|...
	static LOGS_ERRORTAG_GROP: string = "LOGS_ERRORTAG_GROP"

	// 百度互推开关
	static SWITCH_DISABLE_BAIDU_HUTUI: string = "SWITCH_DISABLE_BAIDU_HUTUI";

	//订阅消息开关 0关闭 1打开 默认为1
	static SWITCH_SUBSCRIBE_MESSAGE: string = "SWITCH_SUBSCRIBE_MESSAGE";
	//分享录屏开关
	static SWITCH_DISABLE_SHAREVIDEO: string = "SWITCH_DISABLE_SHAREVIDEO";
	//是否开启OPPO审核模式
	static SWITCH_OPPO_REVIEW: string = "SWITCH_OPPO_REVIEW"
	//vivo是否开启添加到桌面
	static SWITCH_VIVO_ADDTODESK: string = "SWITCH_VIVO_ADDTODESK"
	//OPPO、vivo原生插屏自动点击开关
	static SWITCH_DISABLE_NATIVE_AUTOCLICK: string = "SWITCH_DISABLE_NATIVE_AUTOCLICK"

	// 互推返回是否移除已点击图标
	static SWITCH_REMOVE_JUMPED_APP: string = "SWITCH_REMOVE_JUMPED_APP"

	//强更开关 默认 关闭ios强更  ,  0 关闭ios强更  1. 关闭android强更,      2. ios和android强更都关闭. 3. ios 和android 都开强更 
	static SWITCH_FORCE_UPDATE: string = "SWITCH_FORCE_UPDATE";

	//转换url的平台   默认是wx
	static SWITCH_TURNURL_PLAT: string = "SWITCH_TURNURL_PLAT";

	//是否开启货币溢出报警，默认为0 关闭，1 开启
	static SWITCH_COIN_WARNING: string = "SWITCH_COIN_WARNING";

	//native 激励视频类型 1 是优先可关闭视频   2是优先不可关闭视频 默认是1
	static SWITCH_NATIVE_VEDIO_TYPE: string = "SWITCH_NATIVE_VEDIO_TYPE"


	static SWITCH_DISABLE_HOTFIX: string = "SWITCH_DISABLE_HOTFIX";		//是否禁止热更 0 是允许强更 1是禁止强更

	//原生ICON刷新间隔
	static SWITCH_ORIGIN_ICON_REFRESH_SECOND: string = "SWITCH_ORIGIN_ICON_REFRESH_SECOND";

	//货币不足，是否弹出转盘界面:1 打开 0 不打开
	static SWITCH_MONEY_NOTENOUGH_OPEN_TURNABLE: string = "SWITCH_MONEY_NOTENOUGH_OPEN_TURNABLE";

	//针对套壳包的处理方式  默认0或者空 表示 禁止玩游戏. 1表示可以玩游戏但是无法看广告
	static SWITCH_SIGN_METHOD: string = "SWITCH_SIGN_METHOD"

	static SWITCH_KARIQU_DISABLE_JUMP_LIST: string = "SWITCH_KARIQU_DISABLE_JUMP_LIST"//热门推荐界面跳转，默认为0 可以转向，1不可转向
	static SWITCH_KARIQU_JUMP_LIST_DELAY: string = "SWITCH_KARIQU_JUMP_LIST_DELAY"//热门推荐界面继续游戏延时

	//设置游戏帧率 默认0或者空表示不改变当前游戏帧率.否则就把帧率改成设置的值
	static SWITCH_GAME_FRAME_RATE: string = "SWITCH_GAME_FRAME_RATE"

	//开关表
	/**
	 * 开关key,
	 * 值 1表示打开开关 0或者空表示 开关是关闭的
	 */
		//可以在这里初始化定义一些调试开关.后面可以走服务器控制
		// 比如是否显示日志, 所有的开关默认是关闭的
	public static _switchMap: any = {
		[GameSwitch.SWITCH_GM_DEBUG]: 0,
		[GameSwitch.SWITCH_CD_DEBUG]: 0,
		[GameSwitch.SWITCH_DISABLE_ADV]: 0,
		[GameSwitch.SWITCH_DISABLE_SHARE_NEW]: 0,
		[GameSwitch.SWITCH_LOG_PANEL]: 0,
		[GameSwitch.SWITCH_DISABLE_SUBPACKAGE]: 0,
		[GameSwitch.SWITCH_LOG_PANEL_DISABLE]: 0,
		[GameSwitch.SWITCH_DISABLE_INVITE_FIGHT]: 0,
		[GameSwitch.SWITCH_DISABLE_SENDERRORLOG]: 0,
		[GameSwitch.SWITCH_DISABLE_MERGEFILES]: 0,
		[GameSwitch.SWITCH_DISABLE_ALIYUN]: 0,

		[GameSwitch.SWITCH_DISABLE_KEFU]: 0,
		[GameSwitch.SWITCH_DISABLE_QUICKBANNER]: 0,
		[GameSwitch.SWITCH_DISABLE_LEADBANNER]: 1,
		[GameSwitch.SWITCH_DISABLE_SHOWJUMP]: 0,
		[GameSwitch.SWITCH_DISABLE_SHARE_LOCAL]: 0,

		[GameSwitch.SWITCH_DISABLE_ZIP]: 1,
		[GameSwitch.SWITCH_DISABLE_MAKEDIR]: 1,
		[GameSwitch.SWITCH_GAMEMODE]: 1,


		[GameSwitch.SCREEN_AD_DELAY]: 1,
		[GameSwitch.ORIGIN_AD_DELAY]: 1,
		[GameSwitch.BANNER_ID]: 0,
		[GameSwitch.VIDEO_ID]: 0,
		[GameSwitch.ORIGIN_ID]: 0,
		[GameSwitch.SCREEN_ID]: 0,
		[GameSwitch.INTERVAL_TIME]: 0,
		[GameSwitch.MAX_TIME]: 0,
		[GameSwitch.ORIGIN_TIME]: 4,
		[GameSwitch.SWITCH_LOCAL_RES]: 0,
		[GameSwitch.SWITCH_DISABLE_INTERSTITIALAD]: 0,
		[GameSwitch.SWITCH_DISABLE_QUICKBANNER]: 0,
		[GameSwitch.SWITCH_DISABLE_LEADBANNER]: 0,
		[GameSwitch.SWITCH_DISABLE_MYSTERIOUSGIFT]: 0,
		[GameSwitch.SWITCH_MYSTERIOUSGIFT_TYPE]: 1,
		[GameSwitch.SWITCH_DISABLE_SHOWJUMP]: 0,
		[GameSwitch.SWITCH_DISABLE_SHOWJUMP_DRAWER_VIEW]: 0,
		[GameSwitch.SWITCH_DISABLE_REDPACKET]: 0,
		[GameSwitch.SWITCH_DISABLE_LOG]: "",
		[GameSwitch.SWITCH_DISABLE_LOG_GROUP]: "S_banner",
		[GameSwitch.SWITCH_QUICKBANNER_TYPE]: 1,
		[GameSwitch.SWITCH_INTERSTITIAL_TYPE]: 1,
		[GameSwitch.SWITCH_INTERSTITIAL_OPPO_TYPE]: 2,
		[GameSwitch.SWITCH_DISABLE_LANGDINGPAGE]: 0,
		[GameSwitch.SWITCH_DISABLE_ORIGIN]: 0,
		[GameSwitch.SWITCH_DISIBLE_CHARGE]: 1,
		[GameSwitch.SWITCH_DISIBLE_RECOMMEND_BAIDU]: 0,
		[GameSwitch.SWITCH_INTER_JUMP]: "1",
		[GameSwitch.SWITCH_DISABLE_REVIEW]: 0,
		[GameSwitch.SWITCH_DISABLE_LOWDEVICE]: 0,
		[GameSwitch.SWITCH_ALL_IN_WHITE_LIST]: 0,
		// [GameSwitch.LOGS_ERRORTAG_GROP]: "clientLog|dasdsad",
		[GameSwitch.SWITCH_DRAWER_TYPE]: '2',
		[GameSwitch.SWITCH_BTN_MOVE]: '0',
		[GameSwitch.SWITCH_BLACK_IP_CITY]: '广州|深圳|未知|中国',
		[GameSwitch.SWITCH_BLACK_IP_FAIL_TYPE]: 1,
		[GameSwitch.SWITCH_DISABLE_BAIDU_HUTUI]: 0,
		[GameSwitch.SWITCH_SUBSCRIBE_MESSAGE]: 1,
		[GameSwitch.SWITCH_DISABLE_SHAREVIDEO]: 0,
		[GameSwitch.SWITCH_OPPO_REVIEW]: 0,
		[GameSwitch.SWITCH_VIVO_ADDTODESK]: 0,
		[GameSwitch.SWITCH_DISABLE_NATIVE_AUTOCLICK]: 0,
		[GameSwitch.SWITCH_REMOVE_JUMPED_APP]: 1,
		[GameSwitch.SWITCH_TURNURL_PLAT]: "wxgame|android_master|ios_master|web",
		[GameSwitch.SWITCH_NATIVE_VEDIO_TYPE]: "2",
		[GameSwitch.SWITCH_COIN_WARNING]: 0,
		[GameSwitch.SWITCH_MONEY_NOTENOUGH_OPEN_TURNABLE]: 1,

		[GameSwitch.SWITCH_KARIQU_DISABLE_JUMP_LIST]: 0,
		[GameSwitch.SWITCH_KARIQU_JUMP_LIST_DELAY]: 2000,
	}
	/**
	 * 是否已初始化switch
	 */
	private static _hasInitSwitch = false;
	//开关生效条件 全部是字符串 一般跟版本号相关  如果生效条件满足了,那么就算_switchmap 配置0了 开关一样算生效1 是为了兼容线上版本.
	// key 和开关的key 保持一致.  
	// value 采用 条件,客户端版本号的 配置方式; , 是用配置的版本号  和 global.client_version 进行比较  比如 1.0.11.12  >= global.client_version
	// 可以支持多个条件.是或的关系 多个条件只要满足一个就算满足了 比如 3,1.0.1;3,1.0.2  表示 版本号为 1.0.1 或者 1.0.2的时候 生效
	// 1 是>= , 2是> ,3是= 4是 <= 5是 <, 后面对应某个版本号 ,默认为空, 表示开关不生效,  
	static _switchCondition: any = {}

	/**
	 * 获取switch
	 */
	static get switchMap() {
		if (!this._hasInitSwitch) this.initSwitch();
		return this._switchMap;
	}

	/**
	 * 写入 switch
	 */
	static set switchMap(data) {
		if (!this._hasInitSwitch) this.initSwitch();
		this._switchMap = data;
	}

	private static initSwitch() {
		TableUtils.deepMerge(this._switchMap, GameSwitchConst._switchMap);
		this._hasInitSwitch = true;
	}

	public constructor() {
	}

	//判断某个开关是否开启 true 表示开启,false 表示关闭
	static checkOnOff(key: string) {
		//如果是屏蔽广告开关
		var resultValue: boolean;
		//如果满足开关条件了 那么返回开关的值
		if (this.checkCondition(this._switchCondition[key])) {
			if (Number(this.switchMap[key]) == 1 || this.switchMap[key] == true) {
				resultValue = true;
			} else {
				resultValue = false;
			}
			return resultValue;
		}

		return false

	}


	//改变开关状态 1 表示开启,0 表示关闭
	static setOnOff(key: string, value: number) {
		this.switchMap[key] = value;
	}

	//获取开关值，针对oppo
	static getSwitchState(key: string) {
		return this.switchMap[key];
	}

	//判断是否满足条件
	static checkCondition(value: string) {
		//没有condition 返回满足开关条件
		if (!value || value == "" || value == " ") {
			return true;
		}
		var resultBo: boolean = false
		//支持数组配置 多个参数条件 只要满足一个条件就返回true.这样可以支持配置多个版本开关生效条件
		var groupArr: string[] = value.split(";");
		for (var i = 0; i < groupArr.length; i++) {
			var tempValue: string = groupArr[i];
			if (tempValue && tempValue != "") {
				var tempArr: string[] = tempValue.split(",");
				var condition1: number = Number(tempArr[0]);
				//需要把版本号转成数字
				var conditionVersionNums: number = this.countVersionToNumber(tempArr[1]);
				var clientVersionNums: number = this.countVersionToNumber(Global.client_version);
				var tempRt: boolean;
				if (condition1 == 1) {
					tempRt = conditionVersionNums > clientVersionNums;
				} else if (condition1 == 2) {
					tempRt = conditionVersionNums >= clientVersionNums;
				} else if (condition1 == 3) {
					tempRt = conditionVersionNums == clientVersionNums;
				} else if (condition1 == 4) {
					tempRt = conditionVersionNums <= clientVersionNums;
				} else if (condition1 == 5) {
					tempRt = conditionVersionNums < clientVersionNums;
				}
				if (tempRt) {
					return true;
				}
			}
		}
		//全部条件满足就算完成
		return false

	}

	//版本号字符串转化成数字
	static countVersionToNumber(version: string) {
		if (version) {
			var tempArr: string[] = version.split(".");
			var resultNum: number = 0;
			var len: number = tempArr.length;
			for (var i = len - 1; i >= 0; i--) {
				resultNum += Math.pow(1000, len - i - 1) * Number(tempArr[i]);
			}
			return resultNum;
		}
		return 0;
	}

}