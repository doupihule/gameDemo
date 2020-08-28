"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const Method_1 = require("../common/kakura/Method");
const HttpMessage_1 = require("../../../framework/common/HttpMessage");
const Global_1 = require("../../../utils/Global");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
/*
 *工具server发送一下退出游戏等的消息
 */
class UtilsServer {
    /*
    *退出游戏
    */
    static exitGame(data, callBack, thisObj) {
        // Client.instance.send(Method.Exit_Game, data, callBack, thisObj);
    }
    /*
    充值后通知后端
    */
    static payPurchase(data, callBack, thisObj) {
        // Client.instance.send(Method.PayPurchace_Notify, data , callBack, thisObj);
        var params = { "method": Method_1.default.PayPurchace_Notify, "params": data };
        var url = Global_1.default.global_url + '&ver=' + Global_1.default.version;
        LogsManager_1.default.echo("get pay purchase req : " + JSON.stringify(params));
        HttpMessage_1.default.instance.send(url, JSON.stringify(params), (data) => {
            var currPlatform = data[0];
            var data = currPlatform.result.data;
            LogsManager_1.default.echo("get pay purchase back : " + JSON.stringify(data));
        }, this, "post");
    }
    /*
    *通知后端调用分享
    */
    static share(callBack, thisObj) {
        var data = {
            type: 1
        };
        Client_1.default.instance.send(Method_1.default.Utils_shareOrVideo, data, callBack, thisObj);
    }
    /*
    *通知后端调用视频
    */
    static adv(callBack, thisObj) {
        var data = {
            type: 2
        };
        Client_1.default.instance.send(Method_1.default.Utils_shareOrVideo, data, callBack, thisObj);
    }
    /**每天四点同步数据 */
    static reLogin(callBack, thisObj) {
        Client_1.default.instance.send(Method_1.default.Utils_reloginInfo, {}, callBack, thisObj);
    }
    /**新老用户转换(转换为老用户) */
    static setIsOldFlag(callBack, thisObj) {
        /****************************************单机版 **************************************/
        var upData = {};
        var userExt = {};
        userExt["isNew"] = 1;
        upData["userExt"] = userExt;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
        /****************************************单机版 **************************************/
    }
}
exports.default = UtilsServer;
//# sourceMappingURL=UtilsServer.js.map