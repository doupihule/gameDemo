import KakuraClient from "./KakuraClient";
import HashMap from "../../utils/HashMap";
import PackConfigManager from "../../manager/PackConfigManager";
import GlobalData from "../../utils/GlobalData";
import ErrCodeManager from "../../manager/ErrCodeManager";
import UserModel from "../../../game/sys/model/UserModel";
import NotifyManager from "../../manager/NotifyManager";
import ModelToServerMap from "../../../game/sys/consts/ModelToServerMap";

import GameSwitch from "../GameSwitch";
import SingleCommonServer from "../../server/SingleCommonServer";
import HttpMessage from "../HttpMessage";
import ErrorCode from "../../../game/sys/common/kakura/ErrorCode";
import UserInfo from "../UserInfo";
import MethodCommon from "./MethodCommon";
import GameHttpControler from "../GameHttpControler";

import {GameUtils} from 'csharp'

export default class Client {

	private _requestId: number = 0;
	private _baseUnqiueRequestId: number = 0;
	private _callback: any;
	private _thisObj: any;
	private _serverTime: number;
	private _reqBackTime: number;

	private OPCODE_KAKURA_INIT: number = 1000;
	private OPCODE_KAKURA_HEARTBEAT = 1001;
	private OPCODE_KAKURA_REAUTH = 1014;
	private OPCODE_BACKEND_REQUEST = 100001;


	public heartBeatInterval: number = 60;//秒

	private PUBLIC_KEY: string = "ilo24wEFS*^^*2Ewilo24wEFS*^^*2Ew";

	private _testToken: string;
	private _token: string = "";
	//global server token
	private _gs_token: string = "";
	private _url: string = "";
	private _version: string = "";
	private _upgrade: string = "";
	private _sec: number;
	private _rid: string;
	private _kakuraInitParams: any; 	//kakuara初始化参数
	private _hashMap: HashMap = new HashMap();
	private _curMethod: string;//记下当前的发送请求

	private static _instance: Client;

	//global 登入返回的数据
	public globalLoginBackData: any;

	//是否成功登入
	public hasLoginComplete: boolean = false;

	//重登延迟间隔  默认60秒
	private RELOGIN_INTVERL_TIME: number = 60;
	//重登服务器卡关key
	private SWITCH_RELOGIN_INTVERL_TIME: string = "SWITCH_RELOGIN_INTVERL_TIME";
	//上一次登入时间
	public lastLoginTime: number = 0;

	//登入状态  0是空闲, 1 是登入中 
	private _loginState: number = 0;
	//需要更新的数据dirtlist
	static temDirtList = {};

	public constructor() {
		this._serverTime = 0;
	}

	static get instance(): Client {
		if (!this._instance) {
			this._instance = new Client();
		}
		return this._instance;
	}

	checkConnect() {
		KakuraClient.instance.aginConnect();
	}


	sendInit(token: any, userInfo: any = null, callback: any = null, thisObj: any = null, invitedBy: string = "", shareInfo: string = "") {
		this._gs_token = token;
		this._callback = callback;
		this._thisObj = thisObj;
		this._url = PackConfigManager.ins.platform.kakura_url;
		this._version = GlobalData.version;
		this._upgrade = PackConfigManager.ins.platform.upgrade_path;
		this._sec = PackConfigManager.ins.platform.sec;
		this._kakuraInitParams = this.getKakuraInitMsg(userInfo, invitedBy, shareInfo);
		KakuraClient.instance.init(this._url, this._version, "", this.pushResult, this, this.onConnectBack, this);
	}

	private initResult(result: any) {
		if (result.error) {
			// var err = result.error;
			// ErrCodeManager.ins.setErr(err.code);
			return;
		}
		//标记已经获取过用户信息.
		KakuraClient.instance.hasGetUserInfo = true;
		this._requestId = result.initRequestId;
		this._token = result.token;
		this._rid = result.rid;
		this._callback && this._callback.call(this._thisObj);
	}

	sendHeart(method: string = null, param: any = null, callback: any = null, thisObj: any = null, addParam: string = null) {
		//如果当前有请求了 也不执行
		if (KakuraClient.instance._currentConn) {
			return;
		}
		KakuraClient.instance.sendRequest(this.OPCODE_KAKURA_HEARTBEAT, KakuraClient.method_heartBeat, param, callback, thisObj, false);
	}

	/**
	 * 发送消息方法
	 * method 方法id
	 * param 传参数,JSON对象
	 * callback 返回方法，返回JSON对象
	 * thisObj 返回方法对象
	 * 备注: 所有请求的回调里面 都需要判断 服务器返回的数据里面是否有error 来决定做什么事情.
	 * 比如 return 或者 恢复一些ui点击事件
	 * if(serverInfoBack.error){
			resumeUIClick()
			return;
			}
		dosomething()...
	 */
	send(method: string, param: any, callback: any, thisObj: any, opcode: number = this.OPCODE_BACKEND_REQUEST, isWait: boolean = true, addParam: any = null, expandParams: any = null) {


		//如果是云存储
		if (GlobalData.checkUserCloudStorage()) {
			this.saveDataToCloud(param, callback, thisObj, addParam, expandParams);

		} else {
			if (!opcode) {
				opcode = this.OPCODE_BACKEND_REQUEST;
			}
			if (!param || param == null || param == "") {
				param = {};
			} else {
				for (var key in param) {
					// param[key] = encodeURI(param[key]);
				}
			}

			if (opcode == this.OPCODE_BACKEND_REQUEST) {
				if (GlobalData.checkIsSingleMode()) {
					if (!param.clientDirty) {
						param.clientDirty = SingleCommonServer.getClientDirtyList();
					}
				}

			}

			this._curMethod = method;
			// console.log(">>>>>sendData>>>>" +JSON.stringify(sendData));
			KakuraClient.instance.sendRequest(opcode, method, param, callback, thisObj, isWait, false, addParam);

			//为了测试 只要发请求 就立马发一次心跳
			// if(method != "heartBeat"){
			// 	 Client.instance.sendHeart("heartBeat", null, null, null, "id_1");
			// }
		}


	}

	public onResult(result: any, isPush: boolean = false) {
		//遇到dirtyList数据更新

		if (result.data) {
			var rdata: any = result.data;
			if (rdata.dirtyList) {
				this.onDirtyList(rdata.dirtyList);
			}

			if (isPush) {
				if (rdata.d) {
					this.deleteBaseData(rdata.d);
				}

				if (rdata.u) {
					this.updateBaseData(rdata.u);
				}
			}

		} else if (result.error) {
			var err = result.error;
			ErrCodeManager.ins.setErr(err.code);
		}
		if (result.serverInfo) {
			this._reqBackTime = result.serverInfo.serverTime;
			this._serverTime = parseInt(result.serverInfo.serverTime) - Math.floor(this.getNativeTime());
		}
	}

	//更新底层数据
	private onDirtyList(baseData: any) {
		if (!baseData) {
			return;
		}

		if (baseData.d) {
			this.deleteBaseData(baseData.d);
		}

		if (baseData.u) {
			this.updateBaseData(baseData.u);
		}
	}

	//更新底层数据
	private updateBaseData(upData: any) {
		var mapArr: any[] = ModelToServerMap.modelToServerMap;
		var length: number = mapArr.length;

		var userChangeData = this.getUserData(upData);
		//更新用户基础数据
		if (userChangeData) {
			UserModel.instance.updateData(userChangeData);
		}

		for (var i = 0; i < length; i++) {
			var info = mapArr[i];
			var key: string = info.key;
			var model: any = info.model;
			if (upData[key]) {
				model.instance.updateData(upData[key]);
			}
		}
	}

	//删除底层数据
	private deleteBaseData(delData: any) {
		var mapArr: any[] = ModelToServerMap.modelToServerMap;
		var length: number = mapArr.length;

		var userChangeData = this.getUserData(delData);
		//删除用户基础数据
		if (userChangeData) {
			UserModel.instance.deleteData(userChangeData);
		}

		for (var i = 0; i < length; i++) {
			var info = mapArr[i];
			var key: string = info.key;
			var model: any = info.model;
			if (delData[key]) {
				model.instance.deleteData(delData[key]);
			}
		}
	}

	/**获取要更新的user下非模块的数据 */
	private getUserData(data: any) {
		var mapArr: any[] = ModelToServerMap.modelToServerMap;
		var length: number = mapArr.length;
		var userChangeData;
		for (var i in data) {
			var model: any = null;
			var value: any = data[i];
			if (i != "_id") {
				for (var j = 0; j < length; j++) {
					var info: any = mapArr[j];
					//如果匹配上了
					if (info.key == i) {
						model = info.model
						break;
					}
				}
				//如果没匹配上说明是userModel的数据
				if (!model && i != "_id") {
					if (!userChangeData) {
						userChangeData = {};
					}
					userChangeData[i] = value;
				}
			}
		}
		return userChangeData;
	}


	//收到推送
	private pushResult(result: any) {
		if (result.params.dirtyList) {
			this.onDirtyList(result.params.dirtyList);
		}
		NotifyManager.onServerNotify(result);
	}

	//当服务器连接成功isFirstInit,  true是第一次初始化连接成功, false是重连成功
	private onConnectBack(isFirstInit) {
		if (isFirstInit) {
			var params = this._kakuraInitParams
			KakuraClient.instance.clearOneMethod(MethodCommon.User_kakuraInit);
			//初始化请求是需要插入执行的
			KakuraClient.instance.sendRequest(this.OPCODE_KAKURA_INIT, MethodCommon.User_kakuraInit, params, this.initResult, this, true, true);
		} else {
			var param: any = {token: this._token};
			param.ver = this._version;
			param.upgrade = this._upgrade;
			param.deviceId = GlobalData.deviceId
			KakuraClient.instance.sendRequest(this.OPCODE_KAKURA_REAUTH, MethodCommon.User_kakuraReauth, param, this.relogin, this, true, true);
		}


	}

	//手动创建dirtylist
	public doDummyServerBack(data: any = null, u: any = null, d: any = null) {
		if (!data) {
			data = {}
		}
		if (u || d) {
			data.dirtyList = {
				u: u,
				d: d,
			}
			Client.temDirtList = data.dirtyList
			this.onDirtyList(data.dirtyList);
		}

		// var serverInfo:any = {
		// 	result:{
		// 		data:data
		// 	}
		// }
		//少嵌套一层,只返回客户端需要的数据结构 .和现有的结构保持一致
		//LogsManager.echo("data====",data)
		return {data: data}
	}

	public relogin() {
		KakuraClient.instance.sendRequest(this.OPCODE_BACKEND_REQUEST, MethodCommon.User_relogin, {}, this.reloginBack, this, true, true);
	}

	//重回来
	private reloginBack(result) {
		//如果重连有开关 需要立刻同步下开关
		if (result.data && result.data.config && result.data.config.switch) {
			UserInfo.platform.coverServerSwitchMap(result.data.config.switch)
		}
	}

	/**
	 * 获取系统时间
	 */
	get serverTime(): number {
		return Math.floor((this._serverTime + Math.floor(this.getNativeTime())) * 0.001);
	}

	get miniserverTime(): number {
		return this._serverTime + this.getNativeTime()
	}


	/**
	 * 获取系统时间
	 */
	get serverTimeMicro(): number {
		return this._serverTime + this.getNativeTime()
	}

	/**
	 * 上次请求服务器返回时间，秒
	 */
	get reqBackTime(): number {
		return this._reqBackTime * 0.001;
	}

	private getRequestId(): number {
		if (this._requestId >= 0) {
			this._requestId++;
		}
		return this._requestId;
	}

	private getUniqueRequestId(requestId: string = ""): string {
		this._baseUnqiueRequestId = this._baseUnqiueRequestId + 1;
		var rid = 1; //用户id
		var timestamp: number = (new Date()).getTime();
		return "h5_" + rid + "_" + timestamp + "_" + this._baseUnqiueRequestId + "_";
	}

	private getKakuraInitMsg(userInfo: any = null, invitedBy: string = "", shareInfo: string = ""): string {
		var params: any = {
			"ver": this._version,
			"account_name": "1",
			"upgrade": this._upgrade,
			"gs_token": this._gs_token,
			"sec": this._sec,
			"account_id": "1",
			"deviceId": GlobalData.deviceId
		}
		if (invitedBy != "" && shareInfo != "") {
			params["invitedBy"] = invitedBy;
			params["shareInfo"] = shareInfo;
		}
		if (userInfo != null) {
			params["userInfo"] = userInfo;
		}

		return params;
	}

	get rid(): string {
		return this._rid;
	}

	get webSocketConnet() {
		return KakuraClient.instance.webSocketConnet;
	}

	testClose() {
		KakuraClient.instance.testClose();
	}

	/**
	 * 云存储数据
	 * @param params
	 * @param callback
	 * @param thisObj
	 * @param addParam
	 */
	saveDataToCloud(params, callback: any, thisObj: any, addParam: any = null, expandParams: any = null) {
		var token = this.globalLoginBackData.loginToken || ""
		if (!params.token) {
			params.token = token;
		}
		LogsManager.echo("krma. cloud authenticate token=" + token + "body=" + JSON.stringify(params.clientDirty) + "sendTime=" + params.sendTime);
		this.startRequestCloud(MethodCommon.cloudStorage_setByUser, params, callback, thisObj, addParam, expandParams);
	}


	/**
	 * 获取云存储全局数据
	 * @param params { 需要查询的字段 
	 *  query:["user","user.userExt",...],
	 *  id:必带的id
	 * }
	 * @param callback
	 * @param thisObj
	 * @param addParam 额外附带的回调参数
	 */
	getCloudGlobalData(params, callback: Function = null, thisObj = null, addParam = null) {
		if (!this.hasLoginComplete) {
			callback && callback.call(thisObj, {error: {code: ErrorCode.nologin}}, addParam);
			return
		}
		var token = this.globalLoginBackData.loginToken
		if (!token) {
			callback && callback.call(thisObj, {error: {code: ErrorCode.nologin}}, addParam);
			return
		}

		if (!params.token) {
			params.token = token;
		}
		this.startRequestCloud(MethodCommon.cloudStorage_getGlobalData, params, callback, thisObj, addParam);

	}

	/**
	 * 存储订阅消息
	 * @param params
	 * @param callback
	 * @param thisObj
	 * @param addParam
	 */
	sendSubscribeMessage(params, callback: Function = null, thisObj = null, addParam = null) {
		this.startRequestCloud(MethodCommon.saveSubscribeMsg, params, callback, thisObj, addParam);
	}


	/**
	 * 设置云储存全局数据
	 * @param params {
	 * 	clientDirty: {u:...,d:...},
	 *  id:  必带的值
	 * }
	 * @param callback
	 * @param thisObj
	 * @param addParam
	 */
	setCloudGlobalData(params, callback: Function = null, thisObj = null, addParam = null) {
		var token = this.globalLoginBackData.loginToken || ""
		if (!params.token) {
			params.token = token;
		}
		this.startRequestCloud(MethodCommon.cloudStorage_setGlobalData, params, callback, thisObj, addParam);
	}

	private _defaultExpandParams: any = {forceConnect: false};

	//开始请求云储存
	public startRequestCloud(method: string, params, callback: Function = null, thisObj = null, addParam = null, expandParams: any = null) {
		//如果没有token 说明还没连上
		if (!this.hasLoginComplete) {
			this.startRelogin();
			callback && callback.call(thisObj, {error: {code: ErrorCode.nologin}}, addParam);
			return;
		}
		expandParams = expandParams || this._defaultExpandParams;

		var url = GlobalData.global_url;
		params.sendTime = this.serverTime;

		var thisValue = this;
		var onErrorBack = (errorInfo) => {
			errorInfo = errorInfo || {}
			var error = errorInfo && errorInfo.error || errorInfo
			if (typeof error == "object" && error.code) {
				var errorCode = String(error.code);

				//如果token过期或者token错误 那么重新走一次登入流程
				if (errorCode == "10038" || errorCode == "10003") {
					//走一次重登流程
					//重置登入状态
					thisValue._loginState = 0;
					thisValue.hasLoginComplete = false;
					thisValue.startRelogin();
				}
			}
			LogsManager.echo("_errorBack;", error && error.code);
			if (callback) {
				callback.call(thisObj, error, addParam);
			}
			Client.instance.lastLoginTime = Client.instance.serverTime;
		}

		//http回调成功
		var onHttpBack = (backData) => {
			//如果返回数据是数组 那么降低层级结构
			if (backData[0]) {
				backData = backData[0]
			}
			//每次请求同步下服务器时间
			if (backData.result && backData.result.serverInfo && backData.result.serverInfo.serverTime) {
				this.updateServerTime(backData.result.serverInfo.serverTime)
			}
			//如果有错误
			if (backData.error) {
				onErrorBack({error: backData.error});
				return;
			}

			if (callback) {
				callback.call(thisObj, backData, addParam);
			}
			Client.instance.lastLoginTime = Client.instance.serverTime

		}
		var sendData = {
			method: method,
			params: params,

		}

		var webParams: any = {
			errorCall: onErrorBack,
		}
		//如果走强制连接的请求 需要走GameHttpControler
		if (UserInfo.isUseHttpServer && expandParams.forceConnect) {
			webParams.url = url
			expandParams.url = GlobalData.global_url
			GameHttpControler.instance.sendRequest(method, params, callback, thisObj, true, false, addParam, expandParams)
		} else {
			HttpMessage.instance.send(url, sendData, onHttpBack, this, "post", webParams);
		}

	}

	public updateServerTime(value: number) {
		this._reqBackTime = value;
		this._serverTime = this._reqBackTime - this.getNativeTime();
	}


	//开始重新登入
	private startRelogin() {

		if (!this.checkCanRelogin()) {
			return
		}
		//如果已经在登入状态中了return
		if (this._loginState != 0) {
			return;
		}
		LogsManager.echo("xd_ 开始重登-")
		this._loginState = 1;
		this.hasLoginComplete = false;
		UserInfo.platform.getWxInfo();

	}


	//重登回来
	public onReloginBack(data, isError = false) {
		this._loginState = 0;
		LogsManager.echo("xd_重登回来,重置状态")

	}

	//判断是否需要重新登入
	public checkCanRelogin() {
		if (this.serverTime - this.lastLoginTime < this.getReloginIntverlTime()) {
			return false;
		}
		return true
	}

	//获取重登间隔
	private getReloginIntverlTime() {
		var state = GameSwitch.getSwitchState(this.SWITCH_RELOGIN_INTVERL_TIME);
		if (!state) {
			state = this.RELOGIN_INTVERL_TIME;
		}
		return state;
	}



	public  getNativeTime(){
		return Number( GameUtils.CommonUtil.GetTimeMiniStamp());
	}



}


