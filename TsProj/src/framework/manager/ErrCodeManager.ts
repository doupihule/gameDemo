import TranslateFunc from "../func/TranslateFunc";
import LogsManager from "./LogsManager";
import ErrorCode from "../../game/sys/common/kakura/ErrorCode";
import Message from "../common/Message";
import MsgCMD from "../../game/sys/common/MsgCMD";
import UserInfo from "../common/UserInfo";
import Client from "../common/kakura/Client";
import WindowManager from "./WindowManager";
import KakuraClient from "../common/kakura/KakuraClient";
import Global from "../../utils/Global";


export default class ErrCodeManager {
	public constructor() {
	}


	//没有处理的errorcode状态
	private ERROR_STATE_NOHANDLE: number = 0;
	//处理了错误日志但是要发送到错误日志平台
	private ERROR_STATE_HADNLE_SENDERROR: number = 1;
	/*不需要发送错误日志平台的状态*/
	private ERROR_STATE_HANDLE_NOSEND: number = 2;

	private popupErrs: any[] = [10053, 10054, 10071, 10072];//需要弹窗提示

	private _configData: any = {};
	private _currCode: string;

	private static _ins: ErrCodeManager;
	static get ins(): ErrCodeManager {
		if (!this._ins) {
			this._ins = new ErrCodeManager();
		}
		return this._ins;
	}

	initConfig() {
		// this._configData = RES.getRes("TranslateError_json");
		//通用的表单独插入
		TranslateFunc.instance.insertOneCfgs("TranslateError_json")
		this.checkErrCode();
	}

	setErr(errCode: any) {
		// if (this._currCode == "999722") return ;
		var warningList = [];
		var resendList = [];
		var hasSendError = false;
		LogsManager.warn(">>>>>>>>>>>>errCode>>>>>>>>>>>>", errCode);
		var errerMessage: string = TranslateFunc.instance.getTranslate("#error" + errCode);
		if (errCode == ErrorCode.duplicate_login) {//重复登陆
			// {"error":{"code":999722,"message":"duplicate login"}}
			WindowManager.setPopupTip(1, errerMessage, this.sureCallback, this);
		} else if (errCode == ErrorCode.sys_error) {   //系统错误
			WindowManager.setPopupTip(1, errerMessage, this.sureCallback, this);
		} else if (this.popupErrs.indexOf(parseInt(errCode)) > -1) {
			WindowManager.setPopupTip(1, errerMessage, this.sureCallback, this);
		} else if (errCode == ErrorCode.kakura_needClientUpdate || errCode == ErrorCode.kakura_server_error || errCode == ErrorCode.sec_no_open || this._currCode == ErrorCode.sec_maintain ||
			this._currCode == ErrorCode.kakura_needClientUpdate || this._currCode == ErrorCode.kakura_server_error) {
			WindowManager.setPopupTip(1, errerMessage, this.sureCallback, this);
		} else if (errCode == ErrorCode.need_client_relogin) { //需要重启请求Global
			WindowManager.setPopupTip(1, errerMessage, () => {
				Message.instance.send(MsgCMD.REQ_GLOBAL);
			}, this);
		} else if (errCode == ErrorCode.webOffline) {
			WindowManager.setPopupTip(1, errerMessage, this.reauthHandler, this);
		} else if (String(errCode) == ErrorCode.account_data_error) {
			//后端反作弊系统报错，数据错误
			WindowManager.setPopupTip(1, errerMessage, this.sureCallback, this);
			// SingleCommonServer.errorSave();
		} else {
			var flag = true;
			for (var warning of warningList) {
				// LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode + " ?");
				if (Number(errCode) == warning.errCode) {
					// LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode);
					if (warning.sendMethod) {
						if (KakuraClient.instance._currentConn && Number(KakuraClient.instance._currentConn.method) == warning.sendMethod) {
							flag = false;
							LogsManager.echo("krma. _currentConn.method " + Number(KakuraClient.instance._currentConn.method) + " " + warning.sendMethod);
						}

					} else {
						flag = false;
					}
					break;
				}
			}

			if (errCode == ErrorCode.server_error_test_210101 && flag) {
				LogsManager.sendErrorToPlatform("210101_sign_login_step_error", LogsManager.errorTage_serverError);
				hasSendError = true
			}
			if (flag) {	//弹出tip意味是意料外情况，可能需要上传日志
				if (Global.checkIsSingleMode()) {//单机模式不显示tip
					WindowManager.ShowTip(errerMessage);
				}
			}
		}
		for (var warning of resendList) {
			// LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode + " ?");
			if (Number(errCode) == warning.errCode) {
				// LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode);
				KakuraClient.instance.resendCurrentConnLater();
			}
		}

		if (!hasSendError) {
			var needError = this.checkNeedSendError(errCode)
			LogsManager.echo("_错误码:", errCode, "是否需要发送错误:", needError);
			if (needError) {
				//发送错误日志平台 拉取最近200行的日志
				LogsManager.sendErrorToPlatform("code:" + errCode + "," + errerMessage, LogsManager.errorTage_serverError, 200);
			}

		}


		this._currCode = errCode;
	}

	private sureCallback() {
		UserInfo.platform.loginOut();
	}

	private checkErrCode() {
		//"#error10000": {"hid": "#error10000", "zh_CN": "NotOk message \u672a\u5b9a\u4e49"}
		var config: any = TranslateFunc.instance.getAllCfgData("TranslateError_json")
		for (var i in config) {
			var msg: string = config[i].zh_CN;
			var state: string = config[i].state;
			var content: string = ""
			if (msg == undefined) {
				content += "zh_CN";
			}
			if (state == undefined || parseInt(state) == 0) {
				content += "  state";
			}
			if (content != "") {
				content = "<" + config[i].hid + "> " + content;
				LogsManager.warn("ErrorCode Id :", content)
			}
		}
	}

	//判断是否需要把服务器返回的错误发送日志平台
	public checkNeedSendError(errorCode: string) {
		var config: any;
		var configArr = ["TranslateError", "localErrorCodeMap"]
		var key = "#error" + errorCode;
		for (var i = 0; i < configArr.length; i++) {
			config = TranslateFunc.instance.getAllCfgData(configArr[i], true);
			var info = config[key]
			if (info) {
				var state = info.state;
				if (state != this.ERROR_STATE_HANDLE_NOSEND) {
					return true;
				} else {
					return false;
				}
			}
		}
		return true;

	}


	private reauthHandler() {
		Client.instance.checkConnect();
	}

	private logoutHandler() {
		// Message.instance.send(MsgCMD.MODULE_SHOW, { windowName: WindowCfgs.LOGIN, data: 1 });
	}
}
