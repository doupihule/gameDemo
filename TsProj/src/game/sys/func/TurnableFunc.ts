import BaseFunc from "../../../framework/func/BaseFunc";

/*
* Author: sanmen 
* Date:2019-11-7
* Description: 转盘 模块
*/
export default class TurnableFunc extends BaseFunc {

    getCfgsPathArr() {
        return [
            { name: "LuckyPlate_json" },
            { name: "LuckyPlateBox_json"}
        ];
    }
    static _instance: TurnableFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new TurnableFunc();
        }
        return this._instance;
    }

    private _dataArr: any[] = null;
    
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
    getRewardList(){
        return this.getInfoByArenaId(1).plateReward;
    }
    //获取转盘宝箱
    getAllLuckyPlateBox(){
        return this.getAllCfgData("LuckyPlateBox_json");
    }
}