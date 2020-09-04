import BattleLogicalControler from "./BattleLogicalControler";

//战斗中的一些数据统计
export default class BattleStatisticsControler {
    public controller: BattleLogicalControler

    //碰撞次数
    public hitNums: number;

    //获得金币数量
    public goldValue: number = 0;
    //获得金币次数
    public goldCount: number = 0;


    constructor(controller) { this.controller = controller };
    public setData() {
        this.hitNums = 0
    }

    //设置碰撞次数
    public setHitNums(value = 1) {
        this.hitNums += value;
    }

    //发送打点数据
    public startSendStatistics() {
        // StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_COLLISION, this.hitNums)
    }

    //获得金币
    public onGetGold(value){
        this.goldValue +=value;
        this.goldCount+=1;
    }


}