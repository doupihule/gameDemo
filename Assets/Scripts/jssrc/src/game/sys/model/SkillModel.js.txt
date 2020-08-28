"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
class SkillModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SkillModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    /**根据id获取当前技能等级 */
    getSkillLevelById(id) {
        if (!this._data) {
            return 1;
        }
        return this._data[id] || 1;
    }
}
exports.default = SkillModel;
//# sourceMappingURL=SkillModel.js.map