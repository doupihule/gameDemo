import KakuraMessage from "./KakuraMessage";
import Client from "./Client";
import LogsManager from "../../manager/LogsManager";
import WaitManager from "../../manager/WaitManager";
import MsgCMD from "../../../game/sys/common/MsgCMD";
import TimerManager from "../../manager/TimerManager";
import ErrCodeManager from "../../manager/ErrCodeManager";
import ErrorCode from "../../../game/sys/common/kakura/ErrorCode";
import WindowManager from "../../manager/WindowManager";
import Global from "../../../utils/Global";
import TranslateFunc from "../../func/TranslateFunc";
import MethodCommon from "./MethodCommon";

export default class KakuraClient {
	private static _instance: KakuraClient;
	static method_heartBeat: string = "heartBeat";

	//超时时间判定为5秒
	public static timeOutMiniSecond: number = 5000;
	//超时重发时间次数修改为1次
	public static timeOutResendTimes: number = 1;


	private _isInit: boolean = false;
	private _aginCon: number = 0;
	private _timeCode: number = 0;
	private _timeCount: number = 0; //超时重连次数. 连上之后这个重置

	private _reconnectCount: number = 0;	//掉线重连次数.
	private autoConnectCount: number = 1;//自动重连次数,目前只自动重连1次


	private _aesKey: string;
	private _token: string;
	private _defaultAesKey: string = "ilo24wEFS*^^*2Ewilo24wEFS*^^*2Ew";

	private _isoffline: boolean = false;	//是否被挤掉线了 ,如果是被挤掉线的,那么就不能做自动登入了

	private _websocket: Laya.Socket;
	//初始化成功后的回调
	private _callback: any = null;
	private _thisObj: any = null;

	private _pushCallback: any = null;
	private _pushThisObj: any = null;
	private _url: string;
	private _webSocketConnet: boolean = false;

	private _isServerInit: boolean = false;
	public hasGetUserInfo: boolean = false;

	private _hasRegistHeartBeat: boolean = false;

	public _currentConn: ConnectObj;		// 当前的连接
	private _connectCacheArr: ConnectObj[]; 	//链接队列

	private _requestId: number = 1; 	//请求id

	private _hasOnClose: boolean = false;

	public constructor() {
		this._connectCacheArr = [];
		KakuraMessage.instance.setMessageType(KakuraMessage.MESSAGE_FIX_ENC_NO_COMPRESS);
	}

	//后面为了扩展  kakuraclient 不能是单例.(如果要做接java服务器 游戏可能同时存在多个client)
	static get instance(): KakuraClient {
		if (!this._instance)
			this._instance = new KakuraClient();
		return this._instance;
	}

	//重新连接
	aginConnect() {
		this._hasOnClose = false;
		LogsManager.echo("kakura _again connect")
		WaitManager.instance.remove(MsgCMD.ROLL_ANI)
		this.registConnectEvent();
	}

	init(url: string, ver: string, caFilePath: string, pushCallback: any = null, pushThisObj: any = null, callback: any = null, thisObj: any = null): void {
		this._url = url;

		if (pushCallback) {
			this._pushCallback = pushCallback;
		}
		if (pushThisObj) {
			this._pushThisObj = pushThisObj;
		}
		//连接完成回调
		this._callback = callback;
		this._thisObj = thisObj;
		this.registConnectEvent();
	}


	//注册连接事件侦听
	private registConnectEvent() {
		this._aesKey = this._defaultAesKey;
		LogsManager.echo(">>>>>>>>connectByUrl>>>>>>>>>>", this._url)
		this.clearInitRequest();
		this.destorySocket();
		//如果没有获取过用户信息或者 不是单机模式才会显示转菊花. 单机模式第一次获取过用户数据后不需要出菊花了
		if (!this.hasGetUserInfo || !Global.checkIsSingleMode()) {
			WaitManager.instance.add(MsgCMD.ROLL_ANI);
		}

		//每次连接的时候 先关闭套接字
		this._websocket = new Laya.Socket();
		this._websocket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage);
		this._websocket.on(Laya.Event.OPEN, this, this.onSocketOpen);
		this._websocket.on(Laya.Event.CLOSE, this, this.onSocketClose);
		this._websocket.on(Laya.Event.ERROR, this, this.onSocketError);
		this._websocket.connectByUrl(this._url);
	}

	//销毁连接
	private destorySocket() {
		if (this._websocket) {
			this._websocket.offAll();
			this._websocket.close();
			this._websocket = null;
		}
		this._webSocketConnet = false;
	}


	/**
	 * 插入一个请求
	 * isWait 是否需要等待loading
	 * isInsert 是否是插入一个队列 比如初始化的请求是优先级最高的,一定需要优先处理
	 */

	sendRequest(opcode: number, method: string, params: any = null, callback: any = null, thisObj: any = null, isWait: boolean = true, isInsert: boolean = false, addParams: any = null): void {
		if (!this.checkIsInitMethod(method)) {
			if (!this._webSocketConnet) {
				LogsManager.echo("发送请求的时候还没连上", method);
			}
		}
		//如果已经被挤掉线了 那么 后面发的任何请求都干掉
		if (this._isoffline) {
			return;
		}
		//如果没有连上 那么清理掉本地存储的同样的接口
		if (!this._webSocketConnet) {
			this.clearOneMethod(method);
		}
		var uniuquId: string = this.getUniqueRequestId();
		var coninfo: ConnectObj = this.turnRequestToSave(opcode, method, params, callback, thisObj, isWait, addParams);

		if (isInsert) {
			this._connectCacheArr.splice(0, 0, coninfo);
		} else {
			this._connectCacheArr.push(coninfo);
		}
		if (this._currentConn) {
			LogsManager.echo(this._currentConn.method + "请求正在处理中...缓存:." + coninfo.method);
			return;
		}
		//如果这个时候是没有连上的
		if (!this._webSocketConnet) {
			this.aginConnect();
			return
		}
		this.doRequest();

	}


	private requestSocket(con: ConnectObj) {
		//添加loading 事件拦截
		if (con.isWait) {
			WaitManager.instance.add(MsgCMD.ROLL_ANI);
		}
		var toSendString: string = con.toSendString();
		var packData = KakuraMessage.instance.addPackage(con.opcode, con.id, con.uniqueId, toSendString);
		var requestId: number = con.id;
		var requestBuffer: string = "";
		requestBuffer = packData.uniqueReqId + packData.sendData;
		var byte: Laya.Byte = KakuraMessage.instance.encode(requestBuffer, this._aesKey, packData);
		LogsManager.echo("kakura,发出数据:", toSendString, con.id);

		this._websocket.send(byte.buffer);
		//心跳请求不添加超时判断
		if (con.method != KakuraClient.method_heartBeat) {
			//添加超时判断 暂定20秒超时
			this._timeCode = TimerManager.instance.add(this.timerHandler, this, KakuraClient.timeOutMiniSecond, 1);
		}

	}

	//执行一次请求
	private doRequest() {
		//如果当前有请求的
		if (this._currentConn) {
			return;
		}
		//如果还没连上 那么直接返回
		if (!this._webSocketConnet) {
			return
		}

		if (this._connectCacheArr.length == 0) {
			return;
		}
		var con: ConnectObj = this._connectCacheArr[0];
		this._connectCacheArr.splice(0, 1);
		//如果这个消息是被重置过的 那么 需要重新设置id或者这个消息不是心跳
		if (con.id == 0 && !this.checkIsHeartBeat(con.method) && !this.checkIsInitMethod(con.method)) {
			this._requestId++;
			con.id = this._requestId;

		}
		if (!this.checkIsHeartBeat(con.method)) {
			if (!con.uniqueId) {
				con.uniqueId = this.getUniqueRequestId();
			}

		}

		//单向请求不需要管id 不等待回调
		this._currentConn = con;
		if (this.checkIsHeartBeat(con.method)) {
			this._currentConn = null;
		}

		this.requestSocket(con);


	}


	//超时后的处理
	private timerHandler() {
		TimerManager.instance.remove(this._timeCode);
		if (this._currentConn) {
			LogsManager.echo("kakura _>>>>>>>>>>>>request again>>>>>>>>>>>>", this._currentConn.method);
		} else {
			LogsManager.echo(">>>>>>>>>>>>request again>>>>>>>>>>>>", this._timeCount)
		}
		//如果当前是初始化请求失败了 那么手动close.
		if (this._currentConn && this.checkIsInitMethod(this._currentConn.method)) {
			LogsManager.echo("_初始化请求失败", this._currentConn.method)
			this.destorySocket();
			//移除转菊花功能 弹窗重连弹窗
			WaitManager.instance.remove(MsgCMD.ROLL_ANI);
			ErrCodeManager.ins.setErr(ErrorCode.webOffline);

			return;
		}

		this._timeCount++;

		//那么重复发送当前请求,只重发1次.
		if (this._timeCount <= KakuraClient.timeOutResendTimes) {
			//一定要在重发的时候才会去移除loading
			WaitManager.instance.remove(MsgCMD.ROLL_ANI);
			if (this._currentConn) {
				this.requestSocket(this._currentConn);
			}

		} else {
			//否则就销毁当前连接
			//做弹窗重发
			//弹窗重连
			this._timeCount = 0
			var con = this._currentConn;
			if (!con) {
				return;
			}
			var tempFunc = () => {
				//重发这个请求
				this.requestSocket(con);
			}
			// LogsManager.error("这个请求超时重发两次");
			WaitManager.instance.remove(MsgCMD.ROLL_ANI);
			//弹窗重连
			WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#error110"), tempFunc, this);
			// ToolTip.instance.setPopupTip(1, game.Translatefunc.instance.getTranslate("#error110"), tempFunc, this);

		}
	}

	public resendCurrentConnLater() {
		if (this._currentConn) {
			var currentConn = this._currentConn;
			TimerManager.instance.setTimeout(() => {
				this.requestSocket(currentConn);
			}, this, 100)

		}
	}

	private onReceiveMessage(evt: any): void {
		var that: any = this;
		//清除超时定时器
		TimerManager.instance.remove(that._timeCode);

		this._timeCount = 0;
		var byte: Laya.Byte = new Laya.Byte();
		byte.endian = Laya.Byte.LITTLE_ENDIAN;
		// that._websocket.readBytes(byte);
		byte.clear();
		byte.writeArrayBuffer(evt);
		byte.pos = 0

		var jsonData: any = KakuraMessage.instance.decode(this._aesKey, byte);
		//如果是初始化请求
		if (jsonData.result && jsonData.result.initRequestId) {
			if (jsonData.result.aesKey) {
				that._aesKey = jsonData.result.aesKey;
				KakuraMessage.instance.setMessageType(KakuraMessage.MESSAGE_DYNAMIC_ENC_NO_COMPRESS);
			}
			that._token = jsonData.result.token;
			that._isInit = false;
			this._requestId = jsonData.result.initRequestId;
			this._isServerInit = true;

			this._reconnectCount = 0;
			this.checkRequestId();
			WaitManager.instance.remove(MsgCMD.ROLL_ANI);
		}

		//正常数据返回
		if (jsonData.result) {
			Client.instance.onResult(jsonData.result);
			if (this._currentConn) {
				if (!jsonData.uniqueId || jsonData.uniqueId == this._currentConn.uniqueId) {
					this.excuetOneResponce(jsonData.result);
				} else {
					//只有method匹配上了才会做这个处理 否则代表的是 超时第二次重发回来时的回调。 这个时候 不能通过这个匹配 
					LogsManager.echo("返回的消息可能是超时重发的-", this._currentConn.method, "_serverback method:", jsonData.method);
				}
			}


		} else if (jsonData.error) {
			this.checkServerSysError(jsonData.error.code);
			Client.instance.onResult(jsonData);
			this.excuetOneResponce(jsonData);
		} else if (jsonData.params) {//push数据返回
			Client.instance.onResult(jsonData.params, true);
			that._pushCallback && that._pushCallback.call(that._pushThisObj, jsonData);
		}
		//请求完毕后需要接着doRequest;  因为可能有队列
		this.doRequest();
	}

	private excuetOneResponce(jsonData: any) {
		if (this._currentConn) {
			//如果是心跳请求 return
			if (jsonData == "success") {
				LogsManager.echo("_心跳请求返回的时候 正好有请求发送 导致解析失败");
				return;
			}
			//只有匹配到 需要loading请求的时候 才移除 loading动画,否则心跳包的请求可能会提前中断loading
			if (this._currentConn.isWait) {
				WaitManager.instance.remove(MsgCMD.ROLL_ANI);
			}
			var temp = this._currentConn;
			this._currentConn = null;
			if (temp.callback) {
				temp.callback.call(temp.thisObj, jsonData, temp.addParams);
			}
		}
	}


	//当连接上的时候
	private onSocketOpen(): void {
		//连接成功后就移除
		this._hasOnClose = false;
		WaitManager.instance.remove(MsgCMD.ROLL_ANI)
		console.log("socket connet success!!!");
		this._webSocketConnet = true;

		//连接上了告诉分系统我连接成功了, 并传递是否获取过用户数据. 如果没获取过.那么应该是重发获取用户数据请求
		if (this.hasGetUserInfo) {

			this._callback && this._callback.call(this._thisObj, false);
		} else {
			this._callback && this._callback.call(this._thisObj, true);
		}

		//接着做下一个请求
		this.doRequest();
	}


	private onSocketClose(e, isFromError: boolean = false): void {
		TimerManager.instance.remove(this._timeCode);
		LogsManager.echo("socket close!!! is from error:", isFromError);
		if (this._hasOnClose) {
			LogsManager.echo("刚刚收到close消息,避免和error冲突");
			this._hasOnClose = false;
			return
		}
		if (!this.hasGetUserInfo) {
			//这里延迟4秒发送错误日志.是希望能看到接下来的行为是否正常
			// TimerManager.instance.add(LogsManager.error, LogsManager, 4000, 1, false, [" kakura xd _掉线的时候还没有成功获取用户数据"]);
		}

		this._webSocketConnet = false;
		if (this._currentConn && !this.checkIsInitMethod(this._currentConn.method)) {

			//这里需要改成插入,否则重连之后顺序会出问题
			this._connectCacheArr.splice(0, 0, this._currentConn)
			this._currentConn = null;
		}

		//如果是被挤掉线的 那么return
		if (this._isoffline) {
			return;
		}
		this.clearInitRequest();
		this._hasOnClose = true;
		//移除心跳请求
		// this.clearOneMethod(kakura.KakuraClient.method_heartBeat);
		this._reconnectCount++;
		if (this._reconnectCount <= this.autoConnectCount) {
			LogsManager.echo("掉线自动重连:当前次数:", this._reconnectCount);
			// this._websocket.connectByUrl(this._url);
			//自动重连不需要关闭loading
			// 100ms后做重连 防止因为切后台回来立马出现 请求超时情况
			TimerManager.instance.setTimeout(this.aginConnect, this, 100)
			// this.aginConnect(this._callback,this._thisObj);


			// this.aginConnect(this._callback,this._thisObj);
		} else {
			//如果 需要等待的 那么关闭loading
			//只有是联网的游戏才会弹网络弹窗
			if (Global.gameMode == Global.gameMode_network || !this.hasGetUserInfo) {
				WaitManager.instance.remove(MsgCMD.ROLL_ANI);
				ErrCodeManager.ins.setErr(ErrorCode.webOffline);
			} else {
				WaitManager.instance.remove(MsgCMD.ROLL_ANI)
				//单机版本直接清理所有的请求队列 不做缓存也不做回调
				this._connectCacheArr = [];
				this._currentConn = null;
			}

		}

	}

	public registHeartBeat(): void {
		if (this._hasRegistHeartBeat) {
			return;
		}
		if (Global.checkIsSingleMode()) {
			return;
		}
		this._hasRegistHeartBeat = true;
		//添加心跳
		TimerManager.instance.add(() => {
			if (Client.instance.webSocketConnet) {
				Client.instance.sendHeart("heartBeat", null, null, null, "id_1");
			}
		}, this, Client.instance.heartBeatInterval * 1000);
	}

	private onSocketError(): void {

		// this._webSocketConnet = false;
		// this._reconnectCount++;
		// if (this._reconnectCount <= this.autoConnectCount) {
		// 	// WindowManager.ShowTip("连线断开，正在尝试重连");
		// 	LogsManager.echo("掉线自动重连:当前次数:", this._reconnectCount);
		// 	this.aginConnect(this._callback, this._thisObj);
		// } else {
		// 	ErrCodeManager.ins.setErr("110");
		// }
		LogsManager.echo("socket connet error!!!");
		this.onSocketClose(null, true);

	}

	get webSocketConnet() {
		return this._webSocketConnet;
	}

	private getUniqueRequestId(requestId: string = ""): string {
		var rid = Client.instance.rid; //用户id
		var timestamp: number = (new Date()).getTime();
		return "uniqueId_" + rid + "_" + timestamp + "_" + this._requestId;
	}

	private turnRequestToSave(opcode, method, params, cb, tobj, isWait, addParams) {
		return new ConnectObj(opcode, method, params, cb, tobj, isWait, addParams);
	}

	//判断是否有某个请求 ,有些请求不需要重复的 比如心跳 或者 init 或者reauth
	checkHasMethod(method: string) {
		var obj = this.getMethodObj(method);
		if (obj)
			return true;
		else
			return false;
	}

	//通过Method号获取请求对象
	getMethodObj(method: string) {
		var len: number = this._connectCacheArr.length;
		if (this._currentConn) {
			if (this._currentConn.method == method) {
				return this._currentConn;
			}
		}
		for (var i = 0; i < len; i++) {
			var con: ConnectObj = this._connectCacheArr[i];
			if (con.method == method) {
				return con
			}
		}
		return null;
	}

	//清除某一个请求
	clearOneMethod(method: string) {
		var len: number = this._connectCacheArr.length;
		if (this._currentConn) {
			if (this._currentConn.method == method) {
				this._currentConn = null;
			}
		}
		for (var i = len - 1; i >= 0; i--) {
			var con: ConnectObj = this._connectCacheArr[i];
			if (con.method == method) {
				this._connectCacheArr.splice(i, 1)
			}
		}
	}

	//判断是否需要初始化所有的缓存队列id
	private checkRequestId() {
		if (this._currentConn) {
			if (this._currentConn.id > this._requestId) {
				this._currentConn.id = 0;
				this._currentConn.uniqueId = null;
			}
		}

		var len: number = this._connectCacheArr.length;
		for (var i = 0; i < len; i++) {
			var con: ConnectObj = this._connectCacheArr[i];
			if (con.id > this._requestId) {
				con.id = 0;
				con.uniqueId = null;
			}
		}

	}

	//清除掉所有的初始请求,防止重复发送,
	private clearInitRequest() {
		this.clearOneMethod(MethodCommon.User_kakuraInit)
		this.clearOneMethod(MethodCommon.User_kakuraReauth)
		this.clearOneMethod(MethodCommon.User_relogin)
	}

	//判断是否是初始化menthod
	private checkIsInitMethod(method: string) {
		if (method == MethodCommon.User_kakuraInit
			|| method == MethodCommon.User_kakuraReauth) {
			return true;
		}
		return false;
	}

	//判断是否是服务器异常 比如挤掉线, 有新版本等 需要回到登入界面的
	private checkServerSysError(code: string) {
		if (code == ErrorCode.duplicate_login) {
			this._isoffline = true;
			return true;
		}
		return false;
	}

	//判断是否是初始化menthod
	private checkIsHeartBeat(method: string) {
		if (method == KakuraClient.method_heartBeat) {
			return true;
		}
		return false;
	}

	testClose() {
		if (this._websocket) {
			this._websocket.close();
		}
		this._webSocketConnet = false;
	}
}


//连接请求对象
export class ConnectObj {
	callback: any;
	thisObj: any;
	method: string;
	uniqueId: string = "";
	id: number = 0;
	params: any;
	isWait: boolean;
	opcode: any;
	addParams: any; //回调函数是额外附带的函数 会追加到serverInfo 后面
	expandParams: any //扩展参数
	constructor(opcode, method, params, cb, tobj, isWait, addParams, expandParams: any = null) {
		this.opcode = opcode;
		this.callback = cb;
		this.thisObj = tobj;
		this.method = method;
		this.params = params;
		this.id = 0;
		this.uniqueId = "";
		this.isWait = isWait;
		this.addParams = addParams;
		this.expandParams = expandParams;
	}

	//转化成请求数据
	toSendString() {
		return JSON.stringify({
			"method": this.method,
			"id": this.id,
			"uniqueId": this.uniqueId,
			params: this.params,
			wait: this.isWait
		});
	}

}