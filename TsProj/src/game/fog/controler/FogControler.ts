import {FogLayerControler} from "./FogLayerControler";
import FogFunc from "../../sys/func/FogFunc";
import BattleControler from "../../battle/controler/BattleControler";
import FogInstanceBasic from "../instance/FogInstanceBasic";
import VectorTools from "../../../framework/utils/VectorTools";


/**总控制器 */
export default class FogControler extends BattleControler {
	public fogLayerControler: FogLayerControler;
	private tmpPoint ={x:0,y:0};
	//所有有运动的instance
	public _allMoveInstanceArr;

	constructor(ctn, ui) {
		super(ctn);
		this._allMoveInstanceArr = [];
		this.fogLayerControler = new FogLayerControler(this, ctn);
	}

	public setData(layer) {

	}

	//总的追帧刷新函数
	protected updateFrame() {
		this.runUpdate();
	}

	//更新所有实例
	private runUpdate() {
		//这里要倒着遍历. 因为在执行每个对象的update的过程中 可能会销毁某个对象 导致数组变化
		var len: number = this._allMoveInstanceArr.length;
		for (var i = len - 1; i >= 0; i--) {
			var instance: FogInstanceBasic = this._allMoveInstanceArr[i];
			instance.updateFrame()
		}
		//重新运动b
		for (var i = len - 1; i >= 0; i--) {
			var instance: FogInstanceBasic = this._allMoveInstanceArr[i];
			instance.updateFrameLater()
		}
	}

	//把舞台坐标转化成格子的坐标 1_1
	public turnStagePosToCellSign(stagex: number, stagey: number) {
	}

	dispose() {
		this.fogLayerControler.dispose();
		this.fogLayerControler = null;
	}

}
