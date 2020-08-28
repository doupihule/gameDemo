"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
class InviteFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "InvitingGift_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new InviteFunc();
        }
        return this._instance;
    }
    getAll() {
        return this.getAllCfgData("InvitingGift_json");
    }
    getInviteInfo(id) {
        return this.getCfgDatas("InvitingGift_json", id);
    }
}
exports.default = InviteFunc;
//# sourceMappingURL=InviteFunc.js.map