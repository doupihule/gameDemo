"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameUtils_1 = require("../../utils/GameUtils");
const Client_1 = require("../common/kakura/Client");
const SingleCommonServer_1 = require("./SingleCommonServer");
class CountsCommonServer {
    /**
     * 原生自动点击
     */
    static updateDayCounts(type, value, isSend = true, callBack = null, thisObj = null) {
        var countData = {};
        countData["expireTime"] = GameUtils_1.default.getNextRefreshTByTime(4);
        countData["id"] = type;
        countData["count"] = value;
        if (!this.upData["countsCommon"]) {
            this.upData["countsCommon"] = {};
        }
        this.upData["countsCommon"][type] = countData;
        if (isSend == true) {
            Client_1.default.instance.doDummyServerBack(null, this.upData, null);
            this.upData = {};
            SingleCommonServer_1.default.startSaveClientData();
        }
        callBack && callBack.call(thisObj);
    }
}
exports.default = CountsCommonServer;
CountsCommonServer.upData = {};
//# sourceMappingURL=CountsCommonServer.js.map