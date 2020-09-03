"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
class GuideFunc extends BaseFunc_1.default {
    static get instance() {
        if (!this._instance) {
            this._instance = new GuideFunc();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return [
            { name: "Guide_json" },
            { name: "TranslateGuide_json" },
        ];
    }
    /**根据id获取更新数据*/
    getGuideInfo(id) {
        // return this.cfg[id]["1"];
        return this.getCfgDatas("Guide_json", id);
    }
}
exports.default = GuideFunc;
//# sourceMappingURL=GuideFunc.js.map