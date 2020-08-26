"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
/**七日登录相关 */
class SevenDayFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "SevenDay_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SevenDayFunc();
        }
        return this._instance;
    }
    getSevenDatas() {
        return this.getAllCfgData("SevenDay_json");
    }
}
exports.default = SevenDayFunc;
//# sourceMappingURL=SevenDayFunc.js.map