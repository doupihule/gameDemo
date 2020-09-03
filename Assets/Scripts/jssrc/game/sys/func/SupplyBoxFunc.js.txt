"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
class SupplyBoxFunc extends BaseFunc_1.default {
    constructor() {
        super(...arguments);
        this._dataArr = null;
    }
    getCfgsPathArr() {
        return [
            { name: "LevelBox_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SupplyBoxFunc();
        }
        return this._instance;
    }
    getInfo() {
        return this.getAllCfgData("LevelBox_json");
    }
    getInfoByArenaId(arenaId) {
        return this.getCfgDatas("LevelBox_json", arenaId);
    }
}
exports.default = SupplyBoxFunc;
//# sourceMappingURL=SupplyBoxFunc.js.map