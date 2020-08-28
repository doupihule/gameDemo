"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Client_1 = require("../../../framework/common/kakura/Client");
//商店
class ShopModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new ShopModel();
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
    getData() {
        return this._data;
    }
    /**获取过期时间 ，下次刷新商店的时间*/
    getExpireTime() {
        var data = this.getData();
        return data.expireTime || 0;
    }
    /**获取是否过期 */
    getIsExpire() {
        var clientTime = Client_1.default.instance.serverTime;
        var expireTime = this.getExpireTime();
        if (clientTime < expireTime)
            return false;
        return true;
    }
    getShopList() {
        var data = this.getData();
        return data.shopList;
    }
    /**获取商品领取次数 */
    getGoodsCountByIndex(index) {
        var data = this.getData();
        if (data.shopList) {
            if (!this.getIsExpire()) {
                var good = data.shopList;
                return good[index] && good[index].count || 0;
            }
        }
        return 0;
    }
}
exports.default = ShopModel;
//# sourceMappingURL=ShopModel.js.map