"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../common/kakura/Client");
const Global_1 = require("../../utils/Global");
const UserInfo_1 = require("../common/UserInfo");
const GamePlatform_1 = require("./GamePlatform");
const LoginUI_1 = require("../../game/sys/view/login/LoginUI");
const MainModule_1 = require("../manager/MainModule");
const WindowManager_1 = require("../manager/WindowManager");
const WindowCfgs_1 = require("../../game/sys/consts/WindowCfgs");
const CacheManager_1 = require("../manager/CacheManager");
const Method_1 = require("../../game/sys/common/kakura/Method");
const StorageCode_1 = require("../../game/sys/consts/StorageCode");
class EgretPlatform extends GamePlatform_1.default {
    constructor() {
        super();
        this.registFocusEvent();
    }
    getLoginResult() {
        //如果是 云储存
        if (Global_1.default.checkUserCloudStorage()) {
            return;
        }
        Client_1.default.instance.sendInit(this.loginToken, null, LoginUI_1.default.instance.loginResult, LoginUI_1.default.instance, this.inviteBy, this.shareInfo);
    }
    createLoginButton(callBack, thisObject) {
        callBack && callBack.call(thisObject);
    }
    getWxInfo() {
        if (this._reloginCount == 0) {
            //如果是web版 跳过底层系统更新版本检查 和 分包版本检查
            MainModule_1.default.instance.changeShowMainTask(-1, MainModule_1.default.task_updateListerner, "skip version check");
            //web版本也在这个时候才初始化物理引擎.是为了统一结构 防止因为平台差异化导致不一样的问题
            UserInfo_1.default.platform.initPhysics3D("skip physics3d subpackage check");
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.LoginUI, { platform: "web" });
        }
        else {
            //直接登入
            var params = {
                "method": Method_1.default.global_Account_loginTest,
                "params": {
                    "passport": CacheManager_1.default.instance.getGlobalCache(StorageCode_1.default.storage_acount),
                    "password": '',
                    "device": Global_1.default.deviceModel
                }
            };
            UserInfo_1.default.platform.reqGlobal(params);
        }
    }
    sharePage() {
        // ToolTip.instance.setFlyText("暂不支持此功能");
    }
    /**分享 */
    share(id, extraData, callback, thisObj) {
        callback && callback.call(thisObj, true);
    }
    showVideoAd(successCallBack = null, closeCallBack = null, thisObj = null) {
        successCallBack && successCallBack.call(thisObj, true);
    }
    loginOut() {
        window.location.reload();
    }
    //设置游戏帧率
    setGameFrame() {
        super.setGameFrame();
    }
}
exports.default = EgretPlatform;
//# sourceMappingURL=EgretPlatform.js.map