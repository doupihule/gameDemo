import BaseFunc from "../../../framework/func/BaseFunc";

export default class ShopFunc extends BaseFunc {

    getCfgsPathArr() {
        return [
            { name: "DailyShop_json" },
        ];
    }
    static _instance: ShopFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new ShopFunc();
        }
        return this._instance;
    }

    private _dataArr: any[] = null;

    getShopList() {
        if (!this._dataArr) {
            this._dataArr = [];
            var data = this.getAllCfgData("DailyShop_json");
            for (var id in data) {
                this._dataArr.push(id + "," + data[id].weight)
            }
        }
        return this._dataArr;
    }
}