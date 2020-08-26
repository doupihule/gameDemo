"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const UserModel_1 = require("../model/UserModel");
const GuideFunc_1 = require("../func/GuideFunc");
/*
引导模块
 */
class GuideServer {
    /*
    设置新手引导标志
    */
    static setMainGuide(guideId, callBack, thisObj) {
        // var params = {
        //     score: data.score,
        //     stageId: data.stageId,
        //     isWin: data.isWin
        // }
        /****************************************单机版 **************************************/
        var upData = {};
        var userExt = {};
        var guideStep = UserModel_1.default.instance.getMainGuide();
        var guideInfo = GuideFunc_1.default.instance.getGuideInfo(guideId);
        if (!guideInfo) {
            if (callBack) {
                callBack.call(thisObj, backData);
            }
            return;
        }
        ;
        if (Number(guideInfo.guideOrder) == guideStep) {
            if (callBack) {
                callBack.call(thisObj, backData);
            }
            return;
        }
        ;
        var curGuide = UserModel_1.default.instance.getMainGuide();
        if (Number(guideInfo.guideOrder) <= curGuide) {
            if (callBack) {
                callBack.call(thisObj, backData);
            }
            return;
        }
        ;
        userExt["newGuide"] = Number(guideInfo.guideOrder);
        upData["userExt"] = userExt;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
        /****************************************单机版 **************************************/
        // Client.instance.send(Method.User_NewGuide, data, callBack, thisObj);
    }
    /*
    设置间接引导标志
    */
    static setSubGuide(guideId, callBack, thisObj) {
        // var params = {
        //     score: data.score,
        //     stageId: data.stageId,
        //     isWin: data.isWin
        // }
        /****************************************单机版 **************************************/
        var upData = {};
        var guide = {};
        upData["guide"] = guide;
        guide[guideId] = 1;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
        /****************************************单机版 **************************************/
        // Client.instance.send(Method.User_triggerGuide, data, callBack, thisObj);
    }
}
exports.default = GuideServer;
//# sourceMappingURL=GuideServer.js.map