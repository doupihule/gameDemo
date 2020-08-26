"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
class FlatFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Flat_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new FlatFunc();
        }
        return this._instance;
    }
    getAllFlat() {
        return this.getAllCfgData("Flat_json");
    }
    getFlatInfoById(id) {
        return this.getCfgDatas("Flat_json", id);
    }
    getFlatByTwoId(id, id1) {
        return this.getCfgDatasByKey("Role_json", id, id1);
    }
}
exports.default = FlatFunc;
//# sourceMappingURL=FlatFunc.js.map