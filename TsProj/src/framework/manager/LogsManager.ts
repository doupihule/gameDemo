declare var Md5;
import GameSwitch from "../common/GameSwitch";
import TimerManager from "./TimerManager";
import GlobalData from "../utils/GlobalData";
import WindowManager from "./WindowManager";
import UserModel from "../../game/sys/model/UserModel";
import PackConfigManager from "./PackConfigManager";
import HttpMessage from "../common/HttpMessage";
import UserInfo from "../common/UserInfo";
import DeviceTools from "../utils/DeviceTools";
import GameConsts from "../../game/sys/consts/GameConsts";
import LogsErrorCode from "../consts/LogsErrorCode";
import Client from "../common/kakura/Client";
export default class LogsManager {


	private static logsArr: any[] = [];
	//暂时最对存储1000行日志; 每次打印的日志 如果太长 需要分段截取.
	// 服务器请求回来的数据 注意做一些消息过滤
	private static maxCancheLength: number = 1000;
	private static _sendCache = {};

	static updateFlag = false;
	static autoDisableFlag = false;
	static idTimeout: number = null;
	static autoFlag = true;
	static statVis: boolean = false;
	private static sendMaxLength = 10000;
	private static _aliyunLogsUrl: string = "https://client-error-log.cn-beijing.log.aliyuncs.com/logstores/client_error_log/track?APIVersion=0.6.0&"
	private static _aliyunStaUrl: string = "https://client-business-log.cn-beijing.log.aliyuncs.com/logstores/client_event_log/track?APIVersion=0.6.0&"//打点数据
	private static _aliyunActiveUrl: string = "https://client-business-log.cn-beijing.log.aliyuncs.com/logstores/client_active_log/track?APIVersion=0.6.0&"//打点数据-激活数据
	private static _aliyunLoadingUrl: string = "https://client-business-log.cn-beijing.log.aliyuncs.com/logstores/client_loading_log/track?APIVersion=0.6.0&"//打点数据-记录时长


	//系统界别的报错. 比如空属性
	static errorTag_sysError: string = "sys";
	static errorTag_gameError: string = "game";
	static errorTage_serverError: string = "server";
	static errorTage_clientLog: string = "clientLog";
	static errorTage_memoryWarning: string = "memoryWarning";//内存警告
	//忽略的log
	static ignoreLogs: any[] = ["1201", "1630", "1203", "arena_wordAppear", "arena_wordGuessRight"];
	//每次启动时带的一个唯一标识符.用来区别后面的一些打点请求耗时
	private static _circleId: string;
	//自定义报错;
	private static prevX = 0;
	private static prevY = 0;
	//是否打开日志调试
	public static isOpenLogsDebug: boolean = false;

	public constructor() {
	}

	static initLogsManager() {
		LogsManager.logsArr = [];
	}

	//输出 如果message里面包含#号,optionalParams就按照#n顺序替换规则
	/**
	 * 示例:
	 * echo("这是人名测试:#1,#2","小明","小黄"),
	 * 打印结果 : 这是人名测试:小明,小黄
	 * 后面数组长度和前面#1,#n对应
	 */
	static echo(message?: any, ...optionalParams: any[]) {
		var resultArr = this.turnStr("echo", message, optionalParams);
		// if (!GlobalData.isRelease)
		if (!UserInfo.isSystemMini()) {
			console.log(resultArr.join(" "));
		} else {
			console.log.apply(null, resultArr);
		}

	}

	//警告
	static warn(message?: any, ...optionalParams: any[]) {
		var resultArr = this.turnStr("warn", message, optionalParams);
		if (!UserInfo.isSystemMini()) {
			console.warn(resultArr.join(" "));
		} else {
			console.warn.apply(null, resultArr);
		}
	}

	//错误 errorId:错误日志的聚合id, 按照模块归类.. 比如 文件系统相关的报错  errorId为 file, 配表相关的配表errorId为config.
	private static error(message?: any, ...optionalParams: any[]) {
		console.error("__禁止走到这里来");
		if (UserInfo.isTest()) {
			WindowManager.ShowTip("禁止使用error接口！改为errorTag")
		}

	}

	static errorTag(errorId = null, message?: any, ...optionalParams: any[]) {
		var resultArr = this.turnStr("error", message, optionalParams, true);
		var arr = resultArr.slice(1, resultArr.length);
		var concatStr: string = "" + arr.join(",");
		if (UserInfo.isTest()) {
			WindowManager.ShowTip("有错误，去看日志！")
		}
		//这里防止 deviceId调用错误, 故 延迟一帧发送阿里云错误日志
		TimerManager.instance.add(this.sendErrorToPlatform, this, 10, 1, false, [concatStr, this.errorTag_gameError, 200, errorId])
		// this.sendErrorToPlatform(concatStr,this.errorTag_gameError);
		//错误日志 要特殊处理,因为 在sendErrorToPlatform里面需要读取最近的20行日志数据,这样会导致获取重复数据
		this.insterOneLogs(concatStr);
		if (!UserInfo.isSystemMini()) {
			console.error(resultArr.join(" "));
		} else {
			if (UserInfo.isWeb()) {
				console.error.apply(null, resultArr);
			} else {
				console.warn.apply(null, resultArr);
			}
		}


	}

	//系统底层报错
	static systemError(message?: any, ...optionalParams: any[]) {
		var resultArr = this.turnStr("sysError", message, optionalParams, true);
		var arr = resultArr.slice();
		arr.splice(0, 1);
		var concatStr: string = "" + arr.join(",");

		//这里防止 deviceId调用错误, 故 延迟一帧发送阿里云错误日志
		TimerManager.instance.add(this.sendErrorToPlatform, this, 10, 1, false, [concatStr, this.errorTag_sysError])
		// this.sendErrorToPlatform(concatStr,this.errorTag_sysError);
		this.insterOneLogs(concatStr);
		if (UserInfo.isWeb()) {
			console.error.apply(null, resultArr);
		} else {
			console.warn.apply(null, resultArr);
		}
		if (UserInfo.isWeb()) {
			WindowManager.ShowTip("有错误，去看日志！")
		}
	}

	//发送错误日志到平台 tag 日志标识(分片)
	static sendErrorToPlatform(errorStr: string, tag: string = '', maxLength: number = 1000, errorId = null, logLength = 80, startLine = 0, pieceLength = 60, sendCount = 1) {
		var id = 0;
		while (logLength > pieceLength) {
			this.sendErrorToPlatformByPiece(errorStr, tag, maxLength, errorId, pieceLength, startLine, id + 1, sendCount);
			logLength -= pieceLength;
			startLine += pieceLength;
			id++;
		}
		if (id) {
			this.sendErrorToPlatformByPiece(errorStr, tag, maxLength, errorId, logLength, startLine, id + 1, sendCount);
		} else {
			this.sendErrorToPlatformByPiece(errorStr, tag, maxLength, errorId, logLength, startLine, 0, sendCount);
		}
	}

	//发送错误日志到平台 tag 日志标识
	static sendErrorToPlatformByPiece(errorStr: string, tag: string = '', maxLength: number = 1000, errorId = null, logLength = 80, startLine = 0, id = 0, sendCount) {
		//如果是禁掉 发送错误日志的
		if (UserInfo.isWeb()) return;//web版本不发送
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SENDERRORLOG)) {
			return
		}
		// url编码
		errorStr = this.turnURIContent(errorStr);
		errorStr = errorStr.replace(/[\n\r]+/g, " ");
		errorStr = errorStr.slice(0, Math.min(errorStr.length, maxLength));
		this.sendDataToAiCloud(errorStr, tag, logLength, errorId, startLine, id, sendCount);
	}

	//获取最大日志长度
	private static getMaxLogsLength() {
		var state: string = GameSwitch.getSwitchState(GameSwitch.SWITCH_TURNURL_PLAT);
		if (state && state.indexOf(UserInfo.platformId) != -1) {
			return this.sendMaxLength;
		}
		return this.sendMaxLength / 3
	}

	//转化url字符串
	private static turnURIContent(str: string) {
		var state: string = GameSwitch.getSwitchState(GameSwitch.SWITCH_TURNURL_PLAT);
		if (state && state.indexOf(UserInfo.platformId) != -1) {
			return str;
		}
		return encodeURIComponent(str);
	}


	//发送错误日志到阿里云
	private static sendDataToAiCloud(errorStack: string, tag: string, logLength: number = 80, errorId = null, startLine = 0, messageId = 0, sendCount = 1) {
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ALIYUN)) {
			return;
		}
		var errorName = messageId + "_" + errorStack
		//同一条请求只发送一次
		if (this._sendCache[errorName]) {
			return
		}
		this._sendCache[errorName] = true;

		var id;
		if (!errorId) {
			id = Md5.init(errorStack);
		} else {
			id = errorId;
		}
		var errorTagGroup: string = GameSwitch.getSwitchState(GameSwitch.LOGS_ERRORTAG_GROP);
		if (errorTagGroup && errorTagGroup.indexOf(errorId) != -1) {
			LogsManager.echo("忽略报错日志", errorId);
			return;
		}
		var message = "";
		if (messageId) {
			message = messageId + "_"
		}
		var params = {
			id: id,
			game: GameConsts.gameCode,
			platform: PackConfigManager.ins.platform.platform,
			time: Client.instance.serverTime,
			os: GlobalData.getOs(),
			device: GlobalData.deviceModel,
			cver: GlobalData.client_version,
			ver: GlobalData.version,
			rid: UserModel.instance.getUserRid(),
			error_message: message,
			error_stack: errorStack,
			error_type: tag,
			context: "",
			deviceId: GlobalData.deviceId,
		}
		var sdkInfo = GlobalData.getSDKInfo();
		if (sdkInfo) {
			params["context"] = sdkInfo + params["context"];
		}
		var urlParams: string = HttpMessage.instance.objectToUrlParam(params);

		var url = this._aliyunLogsUrl + urlParams;

		//如果发送消息失败 这里需要把信息存储起来 后续优化
		var onErrorCall = () => {

			console.log("__onerrorCall")
			this.sendErrorToPlatform(errorStack, tag, 200, errorId, 60, 0, 30, 2);
		}

		var webParams = {
			errorCall: onErrorCall,
			isOrigin: true,
			thisObj: this,
			sendCount: sendCount
		}
		var allLength = this.getMaxLogsLength() - url.length;
		params["context"] = this.turnURIContent(params["context"] + this.getNearestLogs(logLength, id, startLine, allLength));
		var urlParams1 = HttpMessage.instance.objectToUrlParam(params);
		var url1 = this._aliyunLogsUrl + urlParams1;
		HttpMessage.instance.sendOtherHttpRequest(url1, null, null, null, "get", webParams, 1);

	}


	/**将打点数据发送到阿里云 */
	static sendStaticToAiCloud(eventId: string, eventData: any) {
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ALIYUN)) {
			return;
		}
		var params: any = {
			game: GameConsts.gameCode,
			platform: PackConfigManager.ins.platform.platform,
			cver: GlobalData.client_version,
			deviceId: GlobalData.deviceId,
			eventId: eventId,
			rid: UserModel.instance.getUserRid(),
			device: GlobalData.deviceModel,
			circleId: this.getCircleId(),
			t: Client.instance.miniserverTime
		}
		if (eventData) {
			//打点上报，这两个参数要单独发
			if (eventData["sortId"]) {
				params["sortId"] = eventData["sortId"];
				delete eventData["sortId"]
			}
			if (eventData["groupId"]) {
				params["groupId"] = eventData["groupId"];
				delete eventData["groupId"]
			}
			if (eventData["comeFrom"]) {
				params["comeFrom"] = eventData["comeFrom"];
				delete eventData["comeFrom"]
			}
			if (eventData["channelUserId"]) {
				params["channelUserId"] = eventData["channelUserId"];
				delete eventData["channelUserId"]
			}
			if (eventData["sex"]) {
				params["sex"] = eventData["sex"];
				delete eventData["sex"]
			}
			if (eventData["cver"]) {
				params["cver"] = eventData["cver"];
				delete eventData["cver"]
			}
		}
		//如果是套壳包 
		params.childChannelId = UserInfo.platform.getChildChannelKey()

		if (eventData && JSON.stringify(eventData) != "{}") {
			params["value"] = JSON.stringify(eventData);
		}
		var urlParams: string = HttpMessage.instance.objectToUrlParam(params);

		var url = this._aliyunStaUrl + urlParams;
		//如果发送消息失败 这里需要把信息存储起来 后续优化
		var onErrorCall = () => {
			console.log("__onerrorCall")
		}

		var webParams = {
			errorCall: onErrorCall,
			isOrigin: true,
		}

		HttpMessage.instance.sendOtherHttpRequest(url, null, null, null, "get", webParams);
	}


	/**将打点-激活数据发送到阿里云 */
	static sendActiveToAiCloud(isNew: number) {
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ALIYUN)) {
			return;
		}
		var params = {
			game: GameConsts.gameCode,
			platform: PackConfigManager.ins.platform.platform,
			deviceId: GlobalData.deviceId,
			device: GlobalData.deviceModel,
			isNew: isNew,
		}

		var urlParams: string = HttpMessage.instance.objectToUrlParam(params);

		var url = this._aliyunActiveUrl + urlParams;
		//如果发送消息失败 这里需要把信息存储起来 后续优化
		var onErrorCall = () => {
			console.log("__onerrorCall")
		}

		var webParams = {
			errorCall: onErrorCall,
			isOrigin: true,
		}

		HttpMessage.instance.sendOtherHttpRequest(url, null, null, null, "get", webParams);
	}

	/**将loading总时长发送到阿里云 */
	static sendLoadingToAiCloud(time: number) {
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ALIYUN)) {
			return;
		}
		var params = {
			game: GameConsts.gameCode,
			platform: PackConfigManager.ins.platform.platform,
			deviceId: GlobalData.deviceId,
			device: GlobalData.deviceModel,
			isNew: GlobalData.isNew() ? 1 : 0,
			network: DeviceTools.network,
			time: time
		}
		LogsManager.echo("yrc1111 sendLoadingToAiCloud", JSON.stringify(params))
		var urlParams: string = HttpMessage.instance.objectToUrlParam(params);
		var url = this._aliyunLoadingUrl + urlParams;
		//如果发送消息失败 这里需要把信息存储起来 后续优化
		var onErrorCall = () => {
			console.log("__onerrorCall")
		}
		var webParams = {
			errorCall: onErrorCall,
			isOrigin: true,
		}
		HttpMessage.instance.sendOtherHttpRequest(url, null, null, null, "get", webParams);
	}

	//后面封装日志缓存接口,方便查看日志 比如 
	//插入一个日志,这个不做长度校验
	static insterOneLogs(str: string) {
		var rowLen = 50;
		//最多截取1000个字符
		// if (str.length > 1000) {
		// 	str = str.slice(0, 1000);
		// }
		// while (str.length > rowLen) {
		// 	var substring = str.substr(0, rowLen);
		// 	str = str.substr(rowLen, str.length - rowLen);
		// 	LogsManager.logsArr.push({ label: substring });
		// }
		LogsManager.logsArr.push({label: str});
		//判断长度
		if (LogsManager.logsArr.length > LogsManager.maxCancheLength) {
			LogsManager.logsArr.splice(0, 1);
		}
	}

	//获取最近指定行数的日志,0表示返回所有日志，是倒着数的
	static getNearestLogs(line: number, id = null, startLine = 0, allLength) {
		if (id == LogsErrorCode.ALIYUN_SENDERROR) return "";
		if (line == 0) {
			return this.logsArr
		}
		var len: number = this.logsArr.length;
		if (line + startLine > len) {
			line = Math.max(0, len - startLine);
		}
		var start: number = len - line - startLine;
		if (start < 0) {
			start = 0;
		}
		var str: string = "";
		// LogsManager.echo("krma. " + "len " + len + " startLine " + startLine + " line " + line + " start " + start + " ")
		for (var i = start; i < start + line; i++) {
			str += this.logsArr[i].label + "\n"
		}
		if (!str.length) {
			str = "all " + len + " start " + startLine + " ,log already end";
		}
		if (allLength) {
			if (str.length > allLength) {
				str = str.slice(0, allLength);
			}
		}
		// str = this.getSureByte(str, allLength);
		return str;
	}


	//字符串转换
	private static turnStr(title: string, message: any, optionalParams: any[], isError: boolean = false) {
		//如果是有通配符替换的
		if (typeof message != "string") {
			message = message + "";
		}
		var timeStr: string = this.getTimeStr(title);
		var resultStr: string;
		var length: number = optionalParams.length;

		var arr: any[];

		if (message.indexOf("#") != -1) {

			resultStr = message;
			for (var i = 0; i < length; i++) {
				resultStr = resultStr.replace("#" + (i + 1), optionalParams[i]);
			}
			arr = [resultStr];
		} else {

			if (length > 0) {
				resultStr = message + " " + optionalParams.join(" ");
			} else {
				resultStr = message;
			}
			optionalParams.splice(0, 0, message);
			arr = optionalParams


		}
		resultStr = timeStr + " " + resultStr;
		if (!isError) {
			this.insterOneLogs(resultStr);
		}

		arr.splice(0, 0, timeStr);
		return arr;
	}

	private static getTimeStr(title: string) {
		var time: Date = new Date();

		return "[" + title + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " ] "
	}


	static initLogPanel() {

	}


	static checkGM() {
		return;
	}


	static addTouchShow(target: any) {
	}



	/**收到服务器push消息时，发送客户端日志，并显示log日志 */
	public static sendAndShowLog() {
		this.sendErrorToPlatform("发送客户端错误日志", this.errorTage_clientLog, 200, "sendClinetError");
		LogsManager.setLogGroupVisible(true);
	}


	public static setLogGroupVisible(visible) {


	}

	public static getCircleId() {
		if (!this._circleId) {
			this._circleId = GlobalData.deviceId + "_" + Client.instance.miniserverTime + Math.floor(Math.random() * 100000);
		}
		return this._circleId;
	}
}



