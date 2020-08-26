"use strict";
/**
 * 所有数据类的鸡肋
 */
Object.defineProperty(exports, "__esModule", { value: true });
class BaseModel {
    //每个子类都需要重写并super 这个initData
    initData(data) {
        this._data = data;
    }
    //获取数据
    getData() {
        return this._data;
    }
    //模块数据发生变化,子类根据需要继承这个方法 并super.
    updateData(d) {
        TableUtils_1.default.deepMerge(this._data, d);
        this.lastUpdateData = d;
        //根据需要发送事件
    }
    //模块数据发生删除
    deleteData(d) {
        TableUtils_1.default.deepDelete(this._data, d);
    }
}
exports.default = BaseModel;
const TableUtils_1 = require("../../../framework/utils/TableUtils");
//# sourceMappingURL=BaseModel.js.map