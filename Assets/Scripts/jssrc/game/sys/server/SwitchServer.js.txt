"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
class SwitchServer {
    /**更新开关 */
    static updateSwitch(data, callBack = null, thisObj = null) {
        var uData = {};
        uData["switches"] = data.switch;
        var backData = Client_1.default.instance.doDummyServerBack(null, uData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = SwitchServer;
//# sourceMappingURL=SwitchServer.js.map