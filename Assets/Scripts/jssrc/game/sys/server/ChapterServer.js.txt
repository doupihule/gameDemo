"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
class ChapterServer {
    /**更新宝箱领取 */
    static updateBoxState(data, callBack = null, thisObj = null) {
        var upData = {};
        var chapter = {};
        chapter["rewardBox"] = {};
        chapter["rewardBox"][data.chapterId] = {};
        chapter["rewardBox"][data.chapterId][data.boxId] = 1;
        upData["chapter"] = chapter;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = ChapterServer;
//# sourceMappingURL=ChapterServer.js.map