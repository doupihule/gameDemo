"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("./BaseFunc");
/**
 * @author: NightmareRevisited
 * @project: hifive_basic
 * @file: Plaque
 * @time: 2019/10/14 10:37
 * @Software: WebStorm
 */
class PlaqueFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Plaque_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new PlaqueFunc();
        }
        return this._instance;
    }
    getPlaqueInfoById(skinId) {
        return this.getCfgDatas("Plaque_json", skinId);
    }
}
exports.default = PlaqueFunc;
//# sourceMappingURL=PlaqueFunc.js.map