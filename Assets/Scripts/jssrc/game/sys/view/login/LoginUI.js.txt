"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const Client_1 = require("../../../../framework/common/kakura/Client");
const Method_1 = require("../../common/kakura/Method");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const CacheManager_1 = require("../../../../framework/manager/CacheManager");
const Global_1 = require("../../../../utils/Global");
const MainModule_1 = require("../../../../framework/manager/MainModule");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const StorageCode_1 = require("../../consts/StorageCode");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
class LoginUI extends layaMaxUI_1.ui.gameui.login.LoginUI {
    constructor() {
        super();
        LoginUI.instance = this;
        // LoadManager.instance.load([BaseFunc._globalConfigsName], Laya.Handler.create(this, ()=>{
        //     BaseFunc.onConfigGroupLoadComplete();
        //     BaseFunc.onTranslateGroupLoadComplete();
        //     ErrCodeManager.ins.initConfig();
        // }), null, Laya.Loader.JSON);
        new ButtonUtils_1.ButtonUtils(this.loginbtn, this.onLoginClick, this);
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
    setData() {
        this._saveAccount = CacheManager_1.default.instance.getGlobalCache(StorageCode_1.default.storage_acount);
        if (this._saveAccount && this._saveAccount != "0" && this._saveAccount.length > 0) {
            this.account.text = this._saveAccount;
        }
    }
    onLoginClick() {
        var account = this.account.text;
        var inviteId = this.invite.text;
        var shareInfo = this.shareInfo.text;
        // var re = /^[0-9a-zA-Z]*$/g;  //判断字符串是否为数字和字母组合
        if (account == "") {
            console.log("please input you account");
            return;
        }
        else {
            this._saveAccount = account;
            CacheManager_1.default.instance.setGlobalCache(StorageCode_1.default.storage_acount, account);
            console.log("login account>>>>" + account);
        }
        this.sendLogin(account, inviteId, shareInfo);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.LoginUI);
        // WindowManager.OpenUI(WindowCfgs.GameMainUI);
        // BattleSceneManager.instance.enterBattle({});
    }
    sendLogin(account, inviteId, shareInfo) {
        var params = {
            "method": Method_1.default.global_Account_loginTest,
            "params": {
                "passport": account,
                "password": this.password.text,
                "device": Global_1.default.deviceModel,
                "comeFrom": UserInfo_1.default.LoginSceneInfo
            }
        };
        UserInfo_1.default.platform.inviteBy = inviteId;
        UserInfo_1.default.platform.shareInfo = shareInfo;
        UserInfo_1.default.platform.reqGlobal(params);
    }
    loginResult() {
        //3.311请求接口，获取用户信息
        Client_1.default.instance.send(Method_1.default.User_login, {}, LoginUI.instance.onLoginResult, LoginUI.instance);
    }
    onLoginResult(result) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.LoginUI);
        MainModule_1.default.instance.onLoginResult(result);
    }
}
exports.default = LoginUI;
LoginUI.res = ["gameui/Login.scene",
];
//# sourceMappingURL=LoginUI.js.map