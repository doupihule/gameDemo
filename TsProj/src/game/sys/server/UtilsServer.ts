import Client from "../../../framework/common/kakura/Client";
import Method from "../common/kakura/Method";
import HttpMessage from "../../../framework/common/HttpMessage";
import Global from "../../../utils/Global";
import LogsManager from "../../../framework/manager/LogsManager";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
/* 
 *工具server发送一下退出游戏等的消息
 */
export default class UtilsServer {

    /* 
    *退出游戏
    */
    static exitGame(data: any, callBack: any, thisObj: any) {
        // Client.instance.send(Method.Exit_Game, data, callBack, thisObj);
    }

    /* 
    充值后通知后端
    */
    static payPurchase(data: any, callBack: any, thisObj: any) {
        // Client.instance.send(Method.PayPurchace_Notify, data , callBack, thisObj);

        var params = { "method": Method.PayPurchace_Notify, "params": data }
        var url = Global.global_url + '&ver=' + Global.version;
        LogsManager.echo("get pay purchase req : " + JSON.stringify(params));
        HttpMessage.instance.send(url, JSON.stringify(params), (data) => {
            var currPlatform: any = data[0];
            var data: any = currPlatform.result.data;
            LogsManager.echo("get pay purchase back : " + JSON.stringify(data));

        }, this, "post");
    }

    /* 
    *通知后端调用分享
    */
    static share(callBack: any, thisObj: any) {
        var data = {
            type: 1
        }
        Client.instance.send(Method.Utils_shareOrVideo, data, callBack, thisObj);
    }

    /* 
    *通知后端调用视频
    */
    static adv(callBack: any, thisObj: any) {
        var data = {
            type: 2
        }
        Client.instance.send(Method.Utils_shareOrVideo, data, callBack, thisObj);
    }
    /**每天四点同步数据 */
    static reLogin(callBack: any, thisObj: any) {
        Client.instance.send(Method.Utils_reloginInfo, {}, callBack, thisObj);
    }

    /**新老用户转换(转换为老用户) */
    static setIsOldFlag(callBack: any, thisObj: any) {

        /****************************************单机版 **************************************/

        var upData = {};
        var userExt = {};

        userExt["isNew"] = 1;
        upData["userExt"] = userExt;

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
        /****************************************单机版 **************************************/
    }

}