"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Message_1 = require("../../../framework/common/Message");
const SevenDayEvent_1 = require("../event/SevenDayEvent");
const UserExtModel_1 = require("./UserExtModel");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
class SevenDayModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SevenDayModel();
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
        Message_1.default.instance.send(SevenDayEvent_1.default.SEVENTDAYEVENT_FRESH_SEVENDAY);
        Message_1.default.instance.send(SevenDayEvent_1.default.SEVENDAY_EVENT_REDPOINT);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    getLoginDay() {
        return this._data || {};
    }
    //是否显示七日登录
    checkSignRedPoint() {
        if (UserExtModel_1.default.instance.getMaxLevel() >= GlobalParamsFunc_1.default.instance.getDataNum("sevenDayReward")) {
            var loginDay = this.getLoginDay();
            var loginStep = loginDay.loginStep || 1;
            var gainStep = loginDay.gainStep || 0;
            return loginStep > gainStep;
        }
        return false;
    }
}
exports.default = SevenDayModel;
//# sourceMappingURL=SevenDayModel.js.map