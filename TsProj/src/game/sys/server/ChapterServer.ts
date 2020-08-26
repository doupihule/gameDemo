import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import UserExtModel from "../model/UserExtModel";
import GameUtils from "../../../utils/GameUtils";
import CountsModel from "../model/CountsModel";



export default class ChapterServer {
    /**更新宝箱领取 */
    static updateBoxState(data, callBack = null, thisObj = null) {
        var upData = {};

        var chapter = {};
        chapter["rewardBox"] = {}
        chapter["rewardBox"][data.chapterId] = {}
        chapter["rewardBox"][data.chapterId][data.boxId] = 1

        upData["chapter"] = chapter

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();

    }
}