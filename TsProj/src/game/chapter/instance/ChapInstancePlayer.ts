import ChapterInstanceMove from "./ChapterInstanceMove";
import BattleConst from "../../sys/consts/BattleConst";
import ChapterFunc from "../../sys/func/ChapterFunc";

/**主角 */
export default class ChapInstancePlayer extends ChapterInstanceMove {

	private moveArr = [];

	constructor(fogControler) {
		super(fogControler);
	}

	public setData(data) {
		this.initStand();
	}

	/**移动到指定的点 */
	moveToTargetPos(target) {
		this.moveCount = 0;
		this.moveArr = target;
		this._myView.play(BattleConst.LABEL_WALK, true)
		this.moveToGroupPoints(target, ChapterFunc.playerSpeed, this.resetAni, this);

	}

	resetAni() {
		this._myView.play(BattleConst.LABEL_IDLE, true)
	}

	//到达一个点转身
	onArriveOnePoint() {
		this.setViewWay(-this.moveArr[this.moveCount].viewWay);
	}

	onArriveOne(type) {

	}

	//销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
	public dispose() {
		this.removeSelf();
	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}


}