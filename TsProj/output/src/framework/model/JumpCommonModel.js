"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("../../game/sys/model/BaseModel");
const Client_1 = require("../common/kakura/Client");
class JumpCommonModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new JumpCommonModel();
        }
        return this._instance;
    }
    initData(d) {
        super.initData(d);
    }
    updateData(d) {
        super.updateData(d);
    }
    /**获取已跳转的appid map*/
    getJumpedList() {
        var jumpList = this._data.jumpedList || {};
        if (!jumpList.expireTime || Client_1.default.instance.serverTime > jumpList.expireTime) {
            this._data.jumpedList = {};
            return {};
        }
        else {
            return jumpList.appList;
        }
    }
}
exports.default = JumpCommonModel;
//# sourceMappingURL=JumpCommonModel.js.map