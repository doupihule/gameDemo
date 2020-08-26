import Client from "../common/kakura/Client";
import Global from "../../utils/Global";
import UserInfo from "../common/UserInfo";
import GamePlatform from "./GamePlatform";
import LoginUI from "../../game/sys/view/login/LoginUI";
import MainModule from "../manager/MainModule";
import WindowManager from "../manager/WindowManager";
import {WindowCfgs} from "../../game/sys/consts/WindowCfgs";
import CacheManager from "../manager/CacheManager";
import Method from "../../game/sys/common/kakura/Method";
import StorageCode from "../../game/sys/consts/StorageCode";

export default class EgretPlatform extends GamePlatform {

    public constructor() {
        super();
        this.registFocusEvent();
    }

 
    public getLoginResult() {
        //如果是 云储存
        if(Global.checkUserCloudStorage()){
            return;
        }
        Client.instance.sendInit(this.loginToken, null, LoginUI.instance.loginResult, LoginUI.instance, this.inviteBy, this.shareInfo);
    }

    public createLoginButton(callBack: Function, thisObject: any) {
        callBack && callBack.call(thisObject);
    }


    public getWxInfo(){


        if(this._reloginCount == 0){
            //如果是web版 跳过底层系统更新版本检查 和 分包版本检查
            MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "skip version check")
            //web版本也在这个时候才初始化物理引擎.是为了统一结构 防止因为平台差异化导致不一样的问题
            UserInfo.platform.initPhysics3D("skip physics3d subpackage check");
            WindowManager.OpenUI(WindowCfgs.LoginUI,{platform: "web"});
        } else {
            //直接登入
            var params: any = {
                "method": Method.global_Account_loginTest,
                "params": {
                    "passport": CacheManager.instance.getGlobalCache(StorageCode.storage_acount),
                    "password": '',
                    "device": Global.deviceModel
                }
            };
            UserInfo.platform.reqGlobal(params);
        }

        
    }

    sharePage() {
        // ToolTip.instance.setFlyText("暂不支持此功能");
    }

    /**分享 */
    share(id: any, extraData: any, callback: Function, thisObj: any) {
        callback && callback.call(thisObj, true);
    }
    showVideoAd(successCallBack: any = null, closeCallBack: any = null, thisObj: any = null) {
        successCallBack && successCallBack.call(thisObj, true);
    }
    
    loginOut(): void {
        window.location.reload();
    }
    //设置游戏帧率
    setGameFrame() {
        super.setGameFrame();
    }
}
