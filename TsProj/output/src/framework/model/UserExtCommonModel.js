"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("../../game/sys/model/BaseModel");
class UserExtCommonModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new UserExtCommonModel();
        }
        return this._instance;
    }
    initData(d) {
        super.initData(d);
    }
    updateData(d) {
        super.updateData(d);
    }
    //获取白名单标志
    getTestSceneMark() {
        return this._data.testSceneMark ? this._data.testSceneMark : 0;
    }
}
exports.default = UserExtCommonModel;
//# sourceMappingURL=UserExtCommonModel.js.map