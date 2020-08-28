"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//战斗中的一些数据统计 
class BattleStatisticsControler {
    constructor(controler) {
        //本次战斗击杀的怪物数量
        this.killNums = 0;
        //造成的总伤害
        this.totalDmage = 0;
        //获得的金币数
        this.totalCoin = 0;
        this.controler = controler;
    }
    ;
    setData() {
    }
    //当杀死一个人
    onKillRole(value = 1) {
        this.killNums += value;
    }
    //当造成伤害
    onDmage(value = 0) {
        this.totalDmage += value;
    }
    //设置翻转落地失败次数
    //发送打点数据
    startSendStatistics() {
        //StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_COLLISIONCAR, this.hitNums);
    }
    //获得金币
    onGetCoin(value = 1) {
        this.totalCoin += value;
    }
    //同步伤害目标的数据,每波同步一次
    updateDemageTarget() {
    }
}
exports.default = BattleStatisticsControler;
//# sourceMappingURL=BattleStatisticsControler.js.map