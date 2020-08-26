import BaseModel from "./BaseModel";
import Client from "../../../framework/common/kakura/Client";
import Message from "../../../framework/common/Message";
import SevenDayEvent from "../event/SevenDayEvent";
import UserExtModel from "./UserExtModel";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import LogsManager from "../../../framework/manager/LogsManager";


export default class SevenDayModel extends BaseModel {
    public constructor() {
        super();
    }

    private static _instance: SevenDayModel;
    static get instance() {
        if (!this._instance) {
            this._instance = new SevenDayModel()
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
        Message.instance.send(SevenDayEvent.SEVENTDAYEVENT_FRESH_SEVENDAY);
        Message.instance.send(SevenDayEvent.SEVENDAY_EVENT_REDPOINT);
    }
    //删除数据
    deleteData(d: any) {
        super.deleteData(d);
    }
    getLoginDay() {
        return this._data || {};
    }
    //是否显示七日登录
    checkSignRedPoint() {
        if (UserExtModel.instance.getMaxLevel() >= GlobalParamsFunc.instance.getDataNum("sevenDayReward")) {
            var loginDay = this.getLoginDay();
            var loginStep = loginDay.loginStep || 1;
            var gainStep = loginDay.gainStep || 0;

            return loginStep > gainStep;
        }
        return false;
    }
}
