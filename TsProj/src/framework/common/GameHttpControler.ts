import {ConnectObj} from './kakura/KakuraClient';
import Client from './kakura/Client';
import UserModel from '../../game/sys/model/UserModel';
import WaitManager from '../manager/WaitManager';
import MsgCMD from '../../game/sys/common/MsgCMD';
import HttpMessage from './HttpMessage';
import WindowManager from '../manager/WindowManager';
import TranslateFunc from '../func/TranslateFunc';
import UserInfo from './UserInfo';
import PackConfigManager from '../manager/PackConfigManager';
import GlobalData from '../utils/GlobalData';
import TableUtils from '../utils/TableUtils';
//

export default class GameHttpControler {
	private static _instance: GameHttpControler;
	public static get instance() {
		if (!this._instance) {
			this._instance = new GameHttpControler();
		}
		return this._instance;
	}

	private _currentConn: ConnectObj;		// 当前的连接
	private _connectCacheArr: ConnectObj[] = []; 	//链接队列
	public loginToken: string;

	private _requestId: number = 0;       //请求id

	public httpServerUrl: string = "https://cloud-dev.fantasyfancy.com:8600/?mod=jsonrpc"        //http服务器url

	public static tokenErrorCode: string = "10038"

	//临时参数. 防止重复创建没必要的对象
	private _tempParams: any = {}
	private _tempWebParams: any = {}
	private _lastSendTime: number = 0;

	public constructor() {
		this._tempWebParams.errorCall = this.onHttpError;
		this._tempWebParams.isOrigin = true
		if (PackConfigManager.ins.platform.backend_url) {
			this.httpServerUrl = PackConfigManager.ins.platform.backend_url;
		} else {
			LogsManager.warn("backendUrlError", "httpserver Platform没有设置backend_url");
		}
	}

	//获取serverurl
	private getServerUrl() {
		var version = GlobalData.version;
		if (GlobalData.version == "1" && PackConfigManager.ins.platform.platform == "test") {
			version = "100000000";
		}
		return this.httpServerUrl + "&ver=" + version + "&upgrade_path=" + PackConfigManager.ins.platform.upgrade_path
	}


	/**
	 *
	 * @param method  method 游戏协议
	 * @param params  请求参数
	 * @param callback  回调
	 * @param thisObj
	 * @param isWait 是否loading
	 * @param isInsert  属否插入请求队列.表示提高优先级
	 * @param addParams  返回自带参数,示例callBack.call(thisObj,serverBackData,addParams)
	 * @param expandParams 扩展参数  {url:如果有代表走自己的url,forceConnect:true,是否强制走失败重连,默认true,  }
	 * 主要针对云存储相关接口. 因为云存储不是所有的接口都需要强制失败重连. 只有同步战力以及同步用户信息需要强制重连. 其他的为false.
	 * 云存储的url 和 游戏服务器相关的url不是同一个地址 所以需要动态传入
	 */

	private defaultExpandParams = {url: null, forceConnect: true};

	public sendRequest(method: string, params: any = null, callback: any = null, thisObj: any = null, isWait: boolean = true, isInsert: boolean = false, addParams: any = null, expandParams: any = null) {

		this._lastSendTime = Client.instance.miniserverTime;
		var uniuquId: string = this.getUniqueRequestId();
		if (!expandParams) {
			expandParams = this.defaultExpandParams;
		}
		var coninfo: ConnectObj = new ConnectObj(1, method, params, callback, thisObj, isWait, addParams, expandParams);

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
		if (!this.loginToken) {
			this.initRequest();
			return
		}
		this.doRequest();
	}

	//初始化连接
	private initRequest() {
		if (this._currentConn && this._currentConn.isWait) {
			WaitManager.instance.add(MsgCMD.ROLL_ANI);
		}
		UserInfo.platform.reRequestGlobal(this.onLoginBack, this)
	}

	//登入回来
	private onLoginBack(data: any) {
		var isWait = false;
		if (this._currentConn) {
			isWait = this._currentConn.isWait
			if (isWait) {
				WaitManager.instance.remove(MsgCMD.ROLL_ANI);
			}
			LogsManager.echo("gamehttp _____resend---", this.loginToken);
			this.resendConn();
		} else {
			this.doRequest();
		}


	}

	//执行一次请求
	private doRequest() {
		//如果当前有请求的
		if (this._currentConn) {
			return;
		}
		if (this._connectCacheArr.length == 0) {
			return;
		}
		var con: ConnectObj = this._connectCacheArr[0];
		this._connectCacheArr.splice(0, 1);

		if (!con.uniqueId) {
			con.uniqueId = this.getUniqueRequestId();
		}

		//单向请求不需要管id 不等待回调
		this._currentConn = con;

		this.requestServer(con);


	}

	//请求连接
	private requestServer(con: ConnectObj) {
		//添加loading 事件拦截
		if (con.isWait) {
			WaitManager.instance.add(MsgCMD.ROLL_ANI);
		}

		var params = this._tempParams;
		this._tempParams.reqId = null;
		params.method = con.method;
		params.id = con.id;
		params.uniqueId = con.uniqueId;
		params.params = con.params;
		//@xd_test 强制测试失败
		// if(con.id == 0){
		//     this._requestId+=1;
		//     con.id += 1;
		//     this.loginToken += "1"
		// }
		con.params.token = this.loginToken;
		var url: string;
		if (con.expandParams.url) {
			url = con.expandParams.url
		} else {
			url = this.getServerUrl();
		}
		// LogsManager.echo("gameHttpSend,method:"+ con.method)
		HttpMessage.instance.send(url, params, this.onHttpCallBack, this, "post", this._tempWebParams);

	}


	//http返回
	private onHttpCallBack(backData: string) {
		if (!this._currentConn) {
			LogsManager.echo("httpserver 当前没有连接.确返回数据了--");
			return;
		}


		if (this._currentConn.isWait) {
			WaitManager.instance.remove(MsgCMD.ROLL_ANI);
		}


		var data: any
		try {
			data = JSON.parse(backData);
		} catch (e) {
			//解析失败这里需要重新登入
			LogsManager.echo("gamehttp 返回的数据不是json,走重新登入", backData);
			this.loginToken = null;
			// this.initRequest();
			WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_net_error"), this.initRequest, this);
			return;
		}

		if (!data || typeof (data) == "string" || !data[0]) {
			//这里需要重新登入
			this.loginToken = null;
			LogsManager.echo("gamehttp 返回的数据格式不对", backData);
			// this.initRequest();
			WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_net_error"), this.initRequest, this);
			return;
		}
		data = data[0];
		if (data.error) {
			//token过期
			var errorCode = data.error.code;
			if (errorCode == GameHttpControler.tokenErrorCode) {
				this.loginToken = null;
				LogsManager.echo("gamehttp token 过期", backData)
				WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_net_error"), this.initRequest, this);
				return;
			}

			//飘字处理
			var transLateError = TranslateFunc.instance.getTranslate("#error" + errorCode);
			WindowManager.ShowTip(transLateError);

		} else {
			//修正空数组
			TableUtils.adjustEmptyArr(data.result);
			//同步服务器时间和dirtyList
			Client.instance.onResult(data.result, false);
		}

		var temp = this._currentConn;

		this._currentConn = null;
		this.doRequest();
		//所有的服务器回调里面都必须判断是否 有result.error
		if (temp.callback) {
			temp.callback.call(temp.thisObj, data.result || data, temp.addParams);
		}


	}


	//判断是否有对应的method
	public checkHasMethod(method: string) {
		if (this._currentConn) {
			if (this._currentConn.method == method) {
				return true;
			}
		}
		for (var i = 0; i < this._connectCacheArr.length; i++) {
			var con = this._connectCacheArr[i];
			if (con.method == method) {
				return true;
			}
		}
		return false;
	}

	/**http返回error.一般是网络异常 */
	private onHttpError(e: any = null) {
		if (!this._currentConn) {
			LogsManager.echo("httpserver 当前没有连接.确返回错误了--");
			return;
		}
		if (this._currentConn.isWait) {
			WaitManager.instance.remove(MsgCMD.ROLL_ANI);
		}
		//httpserver底层做了自动重连机制
		WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_net_error"), this.resendConn, this);

	}

	//重新发送当前请求
	private resendConn() {
		this.requestServer(this._currentConn);
	}


	private getUniqueRequestId(requestId: string = ""): string {
		var rid = UserModel.instance.getUserRid(); //用户id
		var timestamp: number = (new Date()).getTime();
		return "uniqueId_" + rid + "_" + timestamp + "_" + this._requestId;
	}


}