import {ui} from "../../../../ui/layaMaxUI";
import Client from "../../../../framework/common/kakura/Client";
import Method from "../../common/kakura/Method";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import CacheManager from "../../../../framework/manager/CacheManager";
import Global from "../../../../utils/Global";
import MainModule from "../../../../framework/manager/MainModule";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import StorageCode from "../../consts/StorageCode";
import UserInfo from "../../../../framework/common/UserInfo";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import TimerManager from "../../../../framework/manager/TimerManager";

export default class LoginUI extends ui.gameui.login.LoginUI {
    public static res = ["gameui/Login.scene",
        // "common/common_bg_bg.png",
    ];
    private _saveAccount: string;
    public static instance: LoginUI;
    constructor() {
        super();
        LoginUI.instance = this;
        // LoadManager.instance.load([BaseFunc._globalConfigsName], Laya.Handler.create(this, ()=>{
        //     BaseFunc.onConfigGroupLoadComplete();
        //     BaseFunc.onTranslateGroupLoadComplete();
        //     ErrCodeManager.ins.initConfig();
        // }), null, Laya.Loader.JSON);

        new ButtonUtils(this.loginbtn,this.onLoginClick,this);

        // this.loginbtn.clickHandler = Laya.Handler.create(this, this.onLoginClick, null, false);
        // var name = "role_1002"
        // var indexArr = [0];
        // for (var i = 0; i < indexArr.length; i++) {
        //     var role = new BattleRoleView(name, 0.5, indexArr[i]);
        //     var xIndex = i % 2;
        //     var yIndex = Math.floor(i / 2)
        //     this.addChild(role);
        //     role.x = 150 * (xIndex + 1);
        //     role.y = 200 * (yIndex + 1)+200;
        //     role.play("idle", true);
        //     role.stop();
        //     TimerManager.instance.setTimeout(() => {
        //         role.resume()
        //     }, this, 3000)
        // }
    }

    public setData(): void {
        this._saveAccount = CacheManager.instance.getGlobalCache(StorageCode.storage_acount);
        if (this._saveAccount && this._saveAccount != "0" && this._saveAccount.length > 0) {
            this.account.text = this._saveAccount;
        }
    }

    private onLoginClick(): void {
        var account: string = this.account.text;
        var inviteId: string = this.invite.text;
        var shareInfo: string = this.shareInfo.text;
        // var re = /^[0-9a-zA-Z]*$/g;  //判断字符串是否为数字和字母组合
        if (account == "") {
            console.log("please input you account");
            return;
        } else {
            this._saveAccount = account;
            CacheManager.instance.setGlobalCache(StorageCode.storage_acount, account);
            console.log("login account>>>>" + account)
        }


        this.sendLogin(account, inviteId, shareInfo);
        WindowManager.CloseUI(WindowCfgs.LoginUI);
        // WindowManager.OpenUI(WindowCfgs.GameMainUI);
        // BattleSceneManager.instance.enterBattle({});

    }

    private sendLogin(account: string, inviteId: string, shareInfo: string) {
        var params: any = {
            "method": Method.global_Account_loginTest,
            "params": {
                "passport": account,
                "password": this.password.text,
                "device": Global.deviceModel,
                "comeFrom": UserInfo.LoginSceneInfo
            }
        };
        UserInfo.platform.inviteBy = inviteId;
        UserInfo.platform.shareInfo = shareInfo;
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