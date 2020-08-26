"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WXGamePlatform_1 = require("./WXGamePlatform");
const Global_1 = require("../../utils/Global");
const LogsManager_1 = require("../manager/LogsManager");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const StatisticsCommonConst_1 = require("../consts/StatisticsCommonConst");
class QQGamePlatform extends WXGamePlatform_1.default {
    constructor() {
        super();
    }
    shareAldAppMsg(data, shareCallBack) {
        //阿拉丁分享统计
        qq.shareAppMessage({
            title: data.title,
            imageUrl: data.imgUrl,
            query: data.params,
            success(res) {
                console.log(">>>>>>>> QQGamePlatform share succ1>>>>>>>", res);
                shareCallBack(1);
            },
            fail(res) {
                console.log(">>>>>>>> QQGamePlatform share fail1>>>>>>>", res);
                shareCallBack(0);
            }
        });
        console.log(">>>>>>>>shareAppMessage>>>>>>>", data);
    }
    /**右上角三点分享监听函数 */
    myOnShare(callback) {
        qq.onShareAppMessage(callback);
    }
    /**
     * 添加到桌面
     */
    addToDesktop(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
        if (!this.canAddToDesktop()) {
            failCall && failCall.call(thisObj);
            return;
        }
        this.getWX().saveAppToDesktop({
            success: (res) => {
                LogsManager_1.default.echo("hlx 添加到桌面成功", JSON.stringify(res));
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.ADD_DESKTOP_SUCCESS);
                successCall && successCall.call(thisObj);
            },
            fail: (res) => {
                LogsManager_1.default.echo("hlx 添加到桌面失败", JSON.stringify(res));
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.ADD_DESKTOP_FAIL);
                failCall && failCall.call(thisObj);
            }
        });
    }
    /**
     * 是否从小程序收藏进入
     */
    isFromFavourite() {
        if (Global_1.default.currentSceneId != "3003") {
            return false;
        }
        return true;
    }
}
exports.default = QQGamePlatform;
//# sourceMappingURL=QQGamePlatform.js.map