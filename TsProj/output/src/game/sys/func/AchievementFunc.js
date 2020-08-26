"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
class AchievementFunc extends BaseFunc_1.default {
    static get instance() {
        if (!this._instance) {
            this._instance = new AchievementFunc();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return [
            { name: "Achievement_json" }
        ];
    }
}
exports.default = AchievementFunc;
//# sourceMappingURL=AchievementFunc.js.map