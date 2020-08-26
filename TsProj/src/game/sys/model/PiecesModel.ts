import BaseModel from "./BaseModel";
import Message from "../../../framework/common/Message";
import PieceEvent from "../event/PieceEvent";


//碎片
export default class PiecesModel extends BaseModel {
    public constructor() {
        super();
    }

    //单例
    private static _instance: PiecesModel;
    static get instance() {
        if (!this._instance) {
            this._instance = new PiecesModel();
        }
        return this._instance;
    }

    //初始化数据
    initData(d: any) {
        super.initData(d);
    }
    //更新数据
    updateData(d: any) {
        super.updateData(d);
        Message.instance.send(PieceEvent.PIECE_EVENT_UPDATE)
    }
    //删除数据
    deleteData(d: any) {
        super.deleteData(d);
    }
    /**获取碎片数量 */
    getPieceCount(id) {
        if (!this._data || !this._data[id]) return 0;
        return Number(this._data[id].count)
    }

}
