import BattleControler from "./BattleControler";

export default class BattleResControler {
	/**
	 * 游戏资源加载器
	 */
	controller:BattleControler
	public constructor(controller:BattleControler) {
		this.controller = controller;
		BattleControler
	}
	//刷新函数 比如需要分帧加载游戏
	updateFrame(){

	}

	//销毁函数
	dispose(){
		this.controller = null
	}
}
