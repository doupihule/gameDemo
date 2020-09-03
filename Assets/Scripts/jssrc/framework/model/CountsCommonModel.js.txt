"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("../../game/sys/model/BaseModel");
const Client_1 = require("../common/kakura/Client");
class CountsCommonModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new CountsCommonModel();
        }
        return this._instance;
    }
    initData(d) {
        super.initData(d);
    }
    updateData(d) {
        super.updateData(d);
    }
    /**根据id获取计数 */
    getCountById(id) {
        var num = 0;
        if (!this.IsExpire(id)) {
            num = this._data[id]["count"];
        }
        return num;
    }
    //获取分享视频次数 这个id需要动态拼接的
    getShareTvCountById(id) {
        return this.getCountById(this.turnShareTvId(id));
    }
    turnShareTvId(id) {
        return "shareTv" + id;
    }
    /**判断当前类型是否过期 */
    IsExpire(id) {
        if (this._data[id]) {
            if (this._data[id]["expireTime"]) {
                var expireTime = this._data[id]["expireTime"];
                if (expireTime > Client_1.default.instance.serverTime) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        return true;
    }
}
exports.default = CountsCommonModel;
/**
 * 每日插屏广告展示次数
 */
CountsCommonModel.TYPE_INTERVALAD_COUNT = "1";
/**
 * 上次插屏弹出时间
 */
CountsCommonModel.TYPE_INTERVALAD_LASTSHOWTIME = "2";
/**
 * 每日原生插屏广告自动点击次数
 */
CountsCommonModel.TYPE_INTERVAL_ORIGINAL_CLICK_COUNT = "3";
//# sourceMappingURL=CountsCommonModel.js.map