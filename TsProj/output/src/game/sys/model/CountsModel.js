"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Client_1 = require("../../../framework/common/kakura/Client");
/*
* Author: TODO
* Date:2019-06-27
* Description: TODO
*/
class CountsModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new CountsModel();
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
    //根据id获取次数
    getCountsById(id) {
        var counts = this._data || {};
        var count = counts[id] && counts[id]["count"] || 0;
        if (count == 0)
            return 0;
        else {
            var time = (counts[id] && counts[id]["expireTime"]) || 0;
            var curT = Client_1.default.instance.serverTime;
            time = time - curT;
            if (time < 0)
                return 0;
            return count;
        }
    }
}
exports.default = CountsModel;
//单例
CountsModel.freeTurnableCount = "1"; //免费转盘次数
CountsModel.luckyCount = "2"; //兑换次数
CountsModel.talentFreeUpdateCount = "3"; //天赋免费升级次数
CountsModel.autoOpenAirDrop = "4"; //空投宝箱自动打开详情
CountsModel.equipPieceFreeGet = "5"; //装备碎片免费获取次数
CountsModel.equipPieceAdCount = "6"; //装备碎片看视频获取次数
CountsModel.fogStreetCount = "7"; //迷雾街区进入次数
CountsModel.fogStreetVideoCount = "8"; //迷雾街区视频进入次数
//# sourceMappingURL=CountsModel.js.map