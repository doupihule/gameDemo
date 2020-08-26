"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../common/kakura/Client");
const UserModel_1 = require("../../game/sys/model/UserModel");
const SingleCommonServer_1 = require("./SingleCommonServer");
const ShareOrTvManager_1 = require("../manager/ShareOrTvManager");
const UserGlobalModel_1 = require("../model/UserGlobalModel");
const CountsCommonServer_1 = require("./CountsCommonServer");
const CountsCommonModel_1 = require("../model/CountsCommonModel");
/*
免费金币钻石
 */
class ShareOrTvServer {
    /**发送看视频或分享请求 */
    static shareOrTvSend(data, callBack = null, thisObj = null) {
        if (ShareOrTvManager_1.default.leadTypeId) {
            var upData = {};
            if (data.type == ShareOrTvManager_1.default.TYPE_SHARE) {
                UserGlobalModel_1.default.instance.setShareNum(-1);
            }
            var turnId = CountsCommonModel_1.default.instance.turnShareTvId(ShareOrTvManager_1.default.leadTypeId);
            var value = CountsCommonModel_1.default.instance.getShareTvCountById(ShareOrTvManager_1.default.leadTypeId) + 1;
            CountsCommonServer_1.default.updateDayCounts(turnId, value, true, callBack, thisObj);
        }
        else {
            callBack && callBack.call(thisObj);
        }
    }
    //重置视频或者分享次数
    static resetSharOrTvCounts(callBack = null, thisObj = null) {
        if (!UserModel_1.default.instance.getData()) {
            callBack && callBack.call(thisObj);
            return;
        }
        var leadShareData = UserModel_1.default.instance.getData().leadShare;
        if (!leadShareData) {
            callBack && callBack.call(thisObj);
            return;
        }
        var upData = { leadShare: {} };
        for (var i in leadShareData) {
            upData.leadShare[i] = 0;
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        SingleCommonServer_1.default.startSaveClientData();
        callBack && callBack.call(thisObj);
    }
}
exports.default = ShareOrTvServer;
//# sourceMappingURL=ShareOrTvServer.js.map