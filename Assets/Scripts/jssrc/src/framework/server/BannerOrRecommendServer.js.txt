"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerOrRecommendServer = void 0;
const UserModel_1 = require("../../game/sys/model/UserModel");
const Client_1 = require("../common/kakura/Client");
const SingleCommonServer_1 = require("./SingleCommonServer");
/**
 * banner序列逻辑
 */
class BannerOrRecommendServer {
    /**发送Banner或推荐请求 */
    static BannerOrRecommendSend(callBack = null, thisObj = null) {
        var upData = {};
        upData["leadBanner"] = UserModel_1.default.instance.getBannerOrder() + 1;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        SingleCommonServer_1.default.startSaveClientData();
        callBack && callBack.call(thisObj);
    }
}
exports.BannerOrRecommendServer = BannerOrRecommendServer;
//# sourceMappingURL=BannerOrRecommendServer.js.map