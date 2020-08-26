import BattleLogicalControler from "./BattleLogicalControler";

//战斗中的一些数据统计 
export default class BattleStatisticsControler {
	public controler: BattleLogicalControler


	//本次战斗击杀的怪物数量
	public killNums: number = 0;
	//造成的总伤害
	public totalDmage: number = 0;
	//获得的金币数
	public totalCoin: number = 0;

	constructor(controler) {
		this.controler = controler
	};

	public setData() {
	}

	//当杀死一个人
	public onKillRole(value: number = 1) {
		this.killNums += value;
	}


	//当造成伤害
	public onDmage(value: number = 0) {
		this.totalDmage += value;
	}

	//设置翻转落地失败次数

	//发送打点数据
	public startSendStatistics() {
		//StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_COLLISIONCAR, this.hitNums);
	}

	//获得金币
	public onGetCoin(value: number = 1) {
		this.totalCoin += value;
	}

	//同步伤害目标的数据,每波同步一次
	public updateDemageTarget() {
	}
}