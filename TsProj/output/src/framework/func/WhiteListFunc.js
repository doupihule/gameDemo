"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("./BaseFunc");
const UserInfo_1 = require("../common/UserInfo");
class WhiteListFunc extends BaseFunc_1.default {
    constructor() {
        super(...arguments);
        this.whiteList = [];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new WhiteListFunc();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return [
            { name: "WhiteList_json" },
        ];
    }
    /**获取白名单列表 */
    getWhiteList(type) {
        if (!this.whiteList[type]) {
            var list = this.getAllCfgData("WhiteList_json", true);
            this.whiteList[type] = [];
            var whitePlatform = null;
            if (UserInfo_1.default.isWX()) {
                whitePlatform = 1;
            }
            else if (UserInfo_1.default.isTT()) {
                whitePlatform = 2;
            }
            else if (UserInfo_1.default.isQQGame()) {
                whitePlatform = 3;
            }
            else if (UserInfo_1.default.isOppo()) {
                whitePlatform = 4;
            }
            else if (UserInfo_1.default.isBaidu()) {
                whitePlatform = 5;
            }
            else if (UserInfo_1.default.isVivo()) {
                whitePlatform = 6;
            }
            else {
                // 无白名单
                return [];
            }
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    if (list[key].whiteListPlatform == whitePlatform && list[key].type == type) {
                        var element = list[key].whiteListNub;
                        this.whiteList[type].push(String(element));
                    }
                }
            }
        }
        return this.whiteList[type];
    }
}
exports.default = WhiteListFunc;
/**
 * 白名单列表类型：注册白名单
 */
WhiteListFunc.TYPE_REGISTER = 1;
WhiteListFunc.TYPE_LOGIN = 2;
//# sourceMappingURL=WhiteListFunc.js.map