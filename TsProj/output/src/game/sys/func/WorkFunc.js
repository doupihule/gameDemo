"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const GlobalParamsFunc_1 = require("./GlobalParamsFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
const Client_1 = require("../../../framework/common/kakura/Client");
/*
* Description: 打工 模块
*/
class WorkFunc extends BaseFunc_1.default {
    constructor() {
        super(...arguments);
        this.companyMaxLevel = 0;
    }
    getCfgsPathArr() {
        return [
            { name: "CompanyUpdate_json" },
            { name: "Work_json" },
            { name: "WorkGroup_json" }
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new WorkFunc();
        }
        return this._instance;
    }
    /**获取今天的所有刷新时间 */
    getTodayExpireTime() {
        if (!this.expireArr) {
            this.expireArr = [];
            var info = GlobalParamsFunc_1.default.instance.getDataArray("workRefreshTime");
            //获取今天0点的时间戳
            var todayZero = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime())).toString()) / 1000;
            for (var i = 0; i < info.length; i++) {
                this.expireArr.push(Number(info[i]) + todayZero);
            }
            //把明天的第一个加上
            var tomorrow = GameUtils_1.default.getNextRefreshTByTime(0);
            this.expireArr.push(Number(info[0]) + tomorrow);
        }
        return this.expireArr;
    }
    /**获取下次刷新时间 */
    getNextFreshTime() {
        var nowTime = Client_1.default.instance.serverTime;
        var arr = this.getTodayExpireTime();
        var nextTime = arr[arr.length - 1];
        for (var i = 0; i < arr.length; i++) {
            if (nowTime < arr[i]) {
                nextTime = arr[i];
                break;
            }
        }
        return nextTime;
    }
    isShowGift(giftReward) {
        var random = GameUtils_1.default.getWeightItem(giftReward);
        if (Number(random[0] == -1)) {
            return false;
        }
        else {
            return random;
        }
    }
    /**获取公司最高等级 */
    getMaxCompanyLevel() {
        if (!this.companyMaxLevel) {
            this.companyMaxLevel = Object.keys(this.getAllCfgData("CompanyUpdate")).length;
        }
        return this.companyMaxLevel;
    }
}
exports.default = WorkFunc;
//# sourceMappingURL=WorkFunc.js.map