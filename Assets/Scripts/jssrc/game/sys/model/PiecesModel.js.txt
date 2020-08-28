"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Message_1 = require("../../../framework/common/Message");
const PieceEvent_1 = require("../event/PieceEvent");
//碎片
class PiecesModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new PiecesModel();
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
        Message_1.default.instance.send(PieceEvent_1.default.PIECE_EVENT_UPDATE);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    /**获取碎片数量 */
    getPieceCount(id) {
        if (!this._data || !this._data[id])
            return 0;
        return Number(this._data[id].count);
    }
}
exports.default = PiecesModel;
//# sourceMappingURL=PiecesModel.js.map