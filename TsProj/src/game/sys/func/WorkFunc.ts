import BaseFunc from "../../../framework/func/BaseFunc";
import GlobalParamsFunc from "./GlobalParamsFunc";
import TableUtils from "../../../framework/utils/TableUtils";
import TaskConst from "../consts/TaskConst";
import LogsManager from "../../../framework/manager/LogsManager";
import GameUtils from "../../../utils/GameUtils";
import Client from "../../../framework/common/kakura/Client";

/*
* Description: 打工 模块
*/
export default class WorkFunc extends BaseFunc {

    getCfgsPathArr() {
        return [
            { name: "CompanyUpdate_json" },
            { name: "Work_json" },
            { name: "WorkGroup_json" }
        ];
    }
    static _instance: WorkFunc;
    private expireArr;
    private companyMaxLevel=0;
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
            var info = GlobalParamsFunc.instance.getDataArray("workRefreshTime");
            //获取今天0点的时间戳
            var todayZero = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime())).toString()) / 1000;
            for (var i = 0; i < info.length; i++) {
                this.expireArr.push(Number(info[i]) + todayZero);
            }
            //把明天的第一个加上
            var tomorrow = GameUtils.getNextRefreshTByTime(0);
            this.expireArr.push(Number(info[0]) + tomorrow);

        }
        return this.expireArr;
    }
    /**获取下次刷新时间 */
    getNextFreshTime() {
        var nowTime = Client.instance.serverTime;
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
        var random = GameUtils.getWeightItem(giftReward);
        if (Number(random[0] == -1)) {
            return false;
        } else {
            return random
        }
    }
    /**获取公司最高等级 */
    getMaxCompanyLevel(){
        if(!this.companyMaxLevel){
           this.companyMaxLevel=Object.keys(this.getAllCfgData("CompanyUpdate")).length;
        }
        return this.companyMaxLevel;
    }

}