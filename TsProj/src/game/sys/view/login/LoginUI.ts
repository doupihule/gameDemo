
import Client from "../../../../framework/common/kakura/Client";
import Method from "../../common/kakura/Method";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import CacheManager from "../../../../framework/manager/CacheManager";
import GlobalData from "../../../../framework/utils/GlobalData";
import MainModule from "../../../../framework/manager/MainModule";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import StorageCode from "../../consts/StorageCode";
import UserInfo from "../../../../framework/common/UserInfo";
import UIBaseView from "../../../../framework/components/UIBaseView";
import ButtonExpand from "../../../../framework/components/ButtonExpand";
import LabelExpand from "../../../../framework/components/LabelExpand";

export default class LoginUI extends UIBaseView {
	public static res = ["gameui/Login.scene",
		// "common/common_bg_bg.png",
	];
	private _saveAccount: string;
	public static instance: LoginUI;
	public  btn_login:ButtonExpand;
	public  label_account:LabelExpand;
	public  label_password:LabelExpand;

	constructor() {
		super();
		LoginUI.instance = this;

		new ButtonUtils(this.btn_login, this.onLoginClick, this);

	}

	public setData(): void {
		this._saveAccount = CacheManager.instance.getGlobalCache(StorageCode.storage_acount);
		if (this._saveAccount && this._saveAccount != "0" && this._saveAccount.length > 0) {
			this.label_account.text = this._saveAccount;
		}
	}

	private onLoginClick(): void {
		var label: string = this.label_account.text;
		// var re = /^[0-9a-zA-Z]*$/g;  //判断字符串是否为数字和字母组合
		if (label == "") {
			console.log("please input you label_account");
			return;
		} else {
			this._saveAccount = label;
			CacheManager.instance.setGlobalCache(StorageCode.storage_acount, label);
			console.log("login label_account>>>>" + label)
		}


		this.sendLogin(label);
		WindowManager.CloseUI(WindowCfgs.LoginUI);

	}

	private sendLogin(account: string) {
		var params: any = {
			"method": Method.global_Account_loginTest,
			"params": {
				"passport": account,
				"password": this.label_password.text,
				"device": GlobalData.deviceModel,
				"comeFrom": UserInfo.LoginSceneInfo
			}
		};
		UserInfo.platform.reqGlobal(params);
	}

	public loginResult() {
		//3.311请求接口，获取用户信息
		Client.instance.send(Method.User_login, {}, LoginUI.instance.onLoginResult, LoginUI.instance);
	}

	private onLoginResult(result: any) {
		WindowManager.CloseUI(WindowCfgs.LoginUI);
		MainModule.instance.onLoginResult(result);
	}
}