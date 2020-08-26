import WaitManager from "../manager/WaitManager";
import ErrCodeManager from "../manager/ErrCodeManager";
import LogsManager from "../manager/LogsManager";
import TimerManager from "../manager/TimerManager";
import TranslateFunc from "../func/TranslateFunc";
import WindowManager from "../manager/WindowManager";
import ErrorCode from "../../game/sys/common/kakura/ErrorCode";
import Global from "../../utils/Global";
import UserInfo from "./UserInfo";
import LogsErrorCode from "../consts/LogsErrorCode";
import Client from "./kakura/Client";
import PackConfigManager from "../manager/PackConfigManager";

export default class HttpMessage {
	private static _instance: HttpMessage;
	static URLLoaderDataFormat = {
		TEXT: "text",
		TEXTURE: "texture",
		BINARY: "binary"
	}


	//请求数据队列
	private _connectCacheArr: any[] = null;

	//当前的请求
	private _currentConn: any;

	//请求数据ID
	private reqsId: number = 0;
	//是否请求数据中
	private isReqs: boolean = false;
	//服务器时间
	private sTime: number = 0;

	reqTime: number = 0;
	//请求key
	key: string = "";

	private errCount: number = 0;
	private _reconnectCount: number = 0;	//失败重连次数.
	private autoConnectCount: number = 0;//自动重连次数,目前只自动重连1次

	constructor() {
		this._connectCacheArr = [];
	}

	static get instance(): HttpMessage {
		if (!this._instance) {
			this._instance = new HttpMessage();
		}
		return this._instance;
	}


	/**
	 * 发送消息
	 * @param url
	 * @param params
	 * @param callBack
	 * @param thisObject
	 * @param isParams
	 * @param webParams 默认值为空  {
	 *      isOrigin:  是否回调的数据 返回原始数据, 默认是json parse过的,
	 *      dataFormat: 传输的数据类型,默认HttpMessage.URLLoaderDataFormat.TEXT,               可使用HttpMessage.URLLoaderDataFormat.BINARY,
	 *      isCache:  是否 缓存,默认false 针对微信或者头条本地文件系统.
	 *      errorCall:网络错误时 也走回调， 并返回error 字段
	 * }
	 */
	send(url: string, params: any, callBack: Function, thisObject: any, method: string = "get", webParams: any = null): void {
		url = url;
		if (!webParams) {
			webParams = {dataFormat: HttpMessage.URLLoaderDataFormat.TEXT}
		}
		var connectData = {
			url: url,
			params: params,
			callBack: callBack,
			thisObj: thisObject,
			method: method,
			webParams: webParams
		}
		this._connectCacheArr.push(connectData);
		this.doRequest()
	}

	doRequest() {
		//如果当前有请求的
		if (this._currentConn) {
			return;
		}
		if (this._connectCacheArr.length == 0) {
			return;
		}
		var con: any = this._connectCacheArr[0];
		this._connectCacheArr.splice(0, 1);
		this._currentConn = con;

		// this.requestSocket(con);
		this.sureSend(con)


	}

	private _currentHp: any;

	/**
	 * 发送数据
	 * @param data
	 */
	private sureSend(data: any): void {
		var url: string = data.url;
		var params: any = data.params || {};
		var callBack: Function = data.callBack;
		var thisObject: any = data.thisObj;
		var method: string = data.method;
		var format: string = data.webParams.dataFormat

		//这里必须要取随机 .否则在android下会有浏览器缓存导致post请求没有返回值 卡死.
		// url += "?test="+Client.instance.miniserverTime+  Math.round( Math.random()*100000);

		//@备注:这里需要等待资源加载完毕才能显示这个wait
		// WaitManager.instance.add(url);

		var hr: Laya.HttpRequest = new Laya.HttpRequest();
		hr.http.time = 60000;
		hr.once(Laya.Event.COMPLETE, this, this.onHttpSuccess);
		hr.once(Laya.Event.ERROR, this, this.onHttpError);
		this._currentHp = hr;

		var targetStrData: string = params;
		var sendMethod = "";
		if (typeof targetStrData != "string") {
			if (params.method) {
				sendMethod = params.method
			}
			if (params) {
				//如果已经有了  reqid 那么添加一个标记
				if (params.reqId) {
					params.reqId = "req_repeat_" + Global.deviceId + "_" + Client.instance.miniserverTime + "_" + Math.floor(Math.random() * 100000)
				} else {
					params.reqId = "req" + Global.deviceId + "_" + Client.instance.miniserverTime + "_" + Math.floor(Math.random() * 100000)
				}

			}

			targetStrData = JSON.stringify(params);
		}
		var shortSendData: string = this.turnShortLogs(targetStrData);
		LogsManager.echo("http send url is :" + url.slice(0, Math.min(200, url.length)) + "   method :" + sendMethod + "  data is : " + shortSendData)
		//记录初始时间
		this.reqTime = Laya.Browser.now();

		var head = null;
		if (UserInfo.isSystemNative()) {
			head = ["Content-Type", "application/json;charset=utf-8"]
		}

		if (method.indexOf("get") > -1) {
			var dataStr = this.objectToUrlParam(params);
			hr.send(url, dataStr, method, "text", head);
		} else if (method.indexOf("post") > -1) {
			hr.send(url, targetStrData, method, "text", head);
		}


	}

	//日志转化
	private turnShortLogs(targetStr: string) {
		//如果是打开了日志调试的 不做转化
		if (LogsManager.isOpenLogsDebug) {
			return targetStr;
		}
		if (PackConfigManager.ins.platform.platform == "dev" || PackConfigManager.ins.platform.platform == "test") {
			return targetStr
		}
		if (targetStr.length < 1000) {
			return targetStr;
		}
		return targetStr.slice(0, 1000);

	}


	/**
	 * 发送消息
	 * @param url
	 * @param params
	 * @param callBack
	 * @param thisObject
	 * @param webParams 默认值为空  {
	 *      isOrigin:  是否回调的数据 返回原始数据, 默认是json parse过的,
	 *      dataFormat: 传输的数据类型,默认HttpMessage.URLLoaderDataFormat.TEXT,               可使用HttpMessage.URLLoaderDataFormat.BINARY,
	 *      isCache:  是否 缓存,默认false 针对微信或者头条本地文件系统.
	 *      errorCall:网络错误时 也走回调， 并返回error 字段
	 *      contentType:默认为空
	 * }
	 * @param addParams
	 */
	private _currentOtherHttp: any;

	public sendOtherHttpRequest(url: string, params: any, callBack: Function, thisObject: any, method: string = "get", webParams: any = null, sendCount = 1, addParams: any = null) {
		var hr: Laya.HttpRequest = new Laya.HttpRequest();
		hr.http.time = 60000;
		var startTime = Laya.Browser.now();
		var onComplete = (data) => {
			LogsManager.echo("sendOtherHttpRequest cost time:", Laya.Browser.now() - startTime, "url:", url.slice(0, Math.min(100, url.length)));
			if (callBack) {
				callBack.call(thisObject, data, addParams)
			}

		}

		var onError = (error) => {
			if (sendCount > 1) {
				error = error.slice(0, 100);
				LogsManager.errorTag(LogsErrorCode.ALIYUN_SENDERROR, error);
			} else {
				if (webParams) {
					var callback = webParams.errorCall;
					callback && callback.call(webParams.thisObj);
				}
			}
		}

		hr.once(Laya.Event.COMPLETE, this, onComplete);
		hr.once(Laya.Event.ERROR, this, onError);

		this._currentOtherHttp = hr;

		var head: any = null
		if (!UserInfo.isWeb() && webParams && webParams.contentType) {
			head = ["Content-Type", webParams.contentType]
		} else {
			if (UserInfo.isSystemNative()) {
				head = ["Content-Type", "application/json;charset=UTF-8"]
			}
		}
		// head = ["Content-Type", "application/x-www-form-urlencoded; charset=utf-8"]
		// console.log("http sendOtherHttpRequest url is :" + url.slice(0,Math.min(200,url.length)) + "  data is : " + JSON.stringify(params) + "   method is :" + method)
		//记录初始时间
		// this.reqTime = Laya.Browser.now();
		// url+= "?test="+Client.instance.miniserverTime+  Math.round( Math.random()*100000);

		if (method.indexOf("get") > -1) {
			var dataStr = this.objectToUrlParam(params);
			hr.send(url, dataStr, method, "text", head);
		} else if (method.indexOf("post") > -1) {
			hr.send(url, params, method, "text", head);
		}
	}


	//http成功
	private onHttpSuccess(data = null) {
		var url: string = this._currentConn.url
		WaitManager.instance.remove(url);
		if (data && (typeof data == "string") && data.indexOf("!DOCTYPE HTML") != -1) {
			LogsManager.echo("url is off," + url);
			HttpMessage.instance.onHttpError({error: {code: ErrorCode.webOffline}})
			return;
		}
		if (!data) {
			HttpMessage.instance.onHttpError({error: {code: ErrorCode.webOffline}})
			return;
		}
		//LogsManager.echo(this._currentConn.webParams.isCache, "this._currentConn.webParams.isCache")
		//如果是正常返回的 而且是要缓存数据到本地的

		if (!data) {
			LogsManager.echo("没有返回数据")
			HttpMessage.instance.onHttpError({error: {code: ErrorCode.webOffline}})
			return;
		}
		// LogsManager.echo("HttpMessage sureSend:",data);

		var callBack = this._currentConn.callBack
		var thisObj = this._currentConn.thisObj;
		//是否是原始数据 ,默认返回的数据结构需要json.parse
		var isOrigin = this._currentConn.webParams.isOrigin


		var originData: string = data;
		//错误码提示
		//如果不是需要原始数据的 那么需要把结果解析一下 回调
		if (!isOrigin) {
			try {
				data = JSON.parse(data);
			} catch (e) {
				LogsManager.errorTag(null, "httpError,url:", url, "backData:");
				HttpMessage.instance.onHttpError({error: {code: ErrorCode.webOffline}})
				return;
			}

			var platforms: any[] = data;
			var len: number = platforms.length;
			for (var i: number = 0; i < len; i++) {
				if ((!platforms[i].result) || platforms[i].error) {
					var errs = (platforms[i].error) || {code: ErrorCode.webOffline}
					//如果是云存储的 那么直接做失败回调
					if (Global.checkUserCloudStorage()) {
						this.onHttpError({error: errs});
						return;
					}
					ErrCodeManager.ins.setErr(errs.code);
					return;
				}
			}

		}
		this._currentConn = null;
		this._reconnectCount = 0;

		var shortLogs: string = this.turnShortLogs(originData);

		//test或者dev 打印完整的数据日志
		LogsManager.echo("http callback,url:" + url.slice(0, Math.min(200, url.length)) + " cosTime:" + (Laya.Browser.now() - this.reqTime), "len:", originData.length, "backData:", shortLogs);
		if (callBack) {
			callBack.call(thisObj, data);
		}
		//接着判断做下一条
		this.doRequest();
	}

	//http失败
	private onHttpError(err: any) {
		if (!this._currentConn) {
			return;
		}
		var url: string = this._currentConn.url
		WaitManager.instance.remove(url);
		LogsManager.warn("error>>>>>", url, err.type, err);
		this._reconnectCount++;
		if (this._reconnectCount <= this.autoConnectCount) {
			TimerManager.instance.setTimeout(this.reSendRequest, this, 1000);
		} else {
			if (this._currentConn.webParams.errorCall) {
				var coninfo = this._currentConn
				this._currentConn = null
				coninfo.webParams.errorCall.call(coninfo.thisObj, err)
				this.doRequest();
				return
			}

			var errorMessage = TranslateFunc.instance.getTranslate("#error110");

			//弹窗重连
			WindowManager.setPopupTip(1, errorMessage, this.reSendRequest, this);
		}

	}

	private reSendRequest() {
		this.sureSend(this._currentConn)
	}


	/**
	 * 对象转URL参数
	 * @param data
	 */
	objectToUrlParam(data: any): string {
		var retStr: string = "";
		if (typeof (data) == "string") {
			return data;
		}
		for (var key in data) {
			var value = data[key];
			if (value != null && value != undefined) {
				if (value.constructor == Array || value.constructor == Object) {
					retStr += (key) + "=" + (JSON.stringify(value)) + "&";
				} else {
					retStr += (key) + "=" + (value) + "&";
				}
			} else {
				retStr += (key) + "=&";
			}
		}
		if (retStr.length > 0) {
			retStr = retStr.substring(0, retStr.length - 1);
		}
		return retStr;
	}


}
