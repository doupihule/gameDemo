import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import UserModel from "../model/UserModel";
import GuideFunc from "../func/GuideFunc";

/* 
引导模块
 */
export default class GuideServer {

    /* 
    设置新手引导标志
    */
    static setMainGuide(guideId: any, callBack: any, thisObj: any) {
        // var params = {
        //     score: data.score,
        //     stageId: data.stageId,
        //     isWin: data.isWin
        // }
        /****************************************单机版 **************************************/

        var upData = {};
        var userExt = {};

        var guideStep = UserModel.instance.getMainGuide();
        var guideInfo = GuideFunc.instance.getGuideInfo(guideId);
        if (!guideInfo) {
            if (callBack) {
                callBack.call(thisObj, backData);
            }
            return
        };
        if (Number(guideInfo.guideOrder) == guideStep) {
            if (callBack) {
                callBack.call(thisObj, backData);
            }
            return
        };
        var curGuide = UserModel.instance.getMainGuide();
        if (Number(guideInfo.guideOrder) <= curGuide) {
            if (callBack) {
                callBack.call(thisObj, backData);
            }
            return
        };
        userExt["newGuide"] = Number(guideInfo.guideOrder);
        upData["userExt"] = userExt;

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
        /****************************************单机版 **************************************/
        // Client.instance.send(Method.User_NewGuide, data, callBack, thisObj);
    }

    /* 
    设置间接引导标志
    */
    static setSubGuide(guideId: any, callBack: any, thisObj: any) {
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

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
        /****************************************单机版 **************************************/
        // Client.instance.send(Method.User_triggerGuide, data, callBack, thisObj);
    }

}