"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
/*
* Author: sanmen
* Date:2019-11-7
* Description: 转盘 模块
*/
class TurnableFunc extends BaseFunc_1.default {
    constructor() {
        super(...arguments);
        this._dataArr = null;
    }
    getCfgsPathArr() {
        return [
            { name: "LuckyPlate_json" },
            { name: "LuckyPlateBox_json" }
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new TurnableFunc();
        }
        return this._instance;
    }
    getInfo() {
        return this.getAllCfgData("LuckyPlate_json");
    }
    getInfoByArenaId(arenaId) {
        return this.getCfgDatas("LuckyPlate_json", arenaId);
    }
    /**获取累计宝箱的最大次数 */
    getLastCount() {
        var data = this.getAllCfgData("LuckyPlateBox_json");
        return this.getCfgDatasByKey("LuckyPlateBox_json", Object.keys(data).length, "addUpNub");
    }
    //获取转盘奖励列表
    getRewardList() {
        return this.getInfoByArenaId(1).plateReward;
    }
    //获取转盘宝箱
    getAllLuckyPlateBox() {
        return this.getAllCfgData("LuckyPlateBox_json");
    }
}
exports.default = TurnableFunc;
//# sourceMappingURL=TurnableFunc.js.map