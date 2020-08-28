"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const GameUtils_1 = require("../../../utils/GameUtils");
const CountsModel_1 = require("../model/CountsModel");
class CountsServer {
    /**更新次数 */
    static updateCount(data, callBack = null, thisObj = null) {
        var upData = {};
        var id = data.id;
        var countData = {};
        countData["id"] = id;
        countData["count"] = CountsModel_1.default.instance.getCountsById(id) + 1;
        countData["expireTime"] = GameUtils_1.default.getNextRefreshTByTime(4);
        upData["counts"] = {
            [id]: countData,
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = CountsServer;
//# sourceMappingURL=CountsServer.js.map