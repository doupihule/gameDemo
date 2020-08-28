"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
class ShopFunc extends BaseFunc_1.default {
    constructor() {
        super(...arguments);
        this._dataArr = null;
    }
    getCfgsPathArr() {
        return [
            { name: "DailyShop_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new ShopFunc();
        }
        return this._instance;
    }
    getShopList() {
        if (!this._dataArr) {
            this._dataArr = [];
            var data = this.getAllCfgData("DailyShop_json");
            for (var id in data) {
                this._dataArr.push(id + "," + data[id].weight);
            }
        }
        return this._dataArr;
    }
}
exports.default = ShopFunc;
//# sourceMappingURL=ShopFunc.js.map