"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
/**子弹相关 */
class BulletFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Bullet_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new BulletFunc();
        }
        return this._instance;
    }
    getBulletInfo(id1, id2) {
        return this.getCfgDatasByKey("Bullet_json", id1, id2);
    }
}
exports.default = BulletFunc;
//# sourceMappingURL=BulletFunc.js.map