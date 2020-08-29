import ChapterLogicControler from "./ChapterLogicControler";
import TimerManager from "../../../framework/manager/TimerManager";
import BaseContainer from "../../../framework/components/BaseContainer";
import ViewTools from "../../../framework/components/ViewTools";

export class ChapterLayerControler {
	/**游戏的根容器 */
	a: BaseContainer;
	/**游戏场景的后景层 */
	a1: BaseContainer;
	/**游戏世界元素交互的容器 */
	a2: BaseContainer;
	a21: BaseContainer;

	public rootCtn: BaseContainer;
	public minY = 0;
	public maxHeight = 1400;
	//展示的总长度
	public showHeight = 1400 * 3;
	private _startTouchY: any;
	public isInTouch = false;
	private controler: ChapterLogicControler
	private timeCode = 0;

	public constructor(controler, rootCtn: BaseContainer) {
		this.controler = controler;
		this.rootCtn = rootCtn;
		this.a = ViewTools.createContainer()
		this.a1 = ViewTools.createContainer();
		this.a2 = ViewTools.createContainer();
		this.a21 = ViewTools.createContainer();

		rootCtn.addChild(this.a);
		this.a.addChild(this.a1);
		this.a.addChild(this.a2);
		this.a2.addChild(this.a21);
	}

	setMinY(y) {
		this.minY = y;
	}

	onTouchBegin(event) {
		this._startTouchY = event.stageY;
		TimerManager.instance.clearTimeout(this.timeCode);
		this.isInTouch = true;
		this.controler.chapterCameraControler.inControlBg = false;

	}

	onTouchMove(event) {
		if (!this._startTouchY) return;
		var tempPos = this.controler.chapterCameraControler.focusPos.y + (this._startTouchY - event.stageY)
		tempPos = this.getTweenEndPos(tempPos);
		this.controler.chapterCameraControler.focusPos.y = tempPos
		this.controler.chapterCameraControler.updateCtnPos(1);
		this._startTouchY = event.stageY
	}

	onTouchUp(event) {
		this._startTouchY = null;
		this.timeCode = TimerManager.instance.setTimeout(() => {
			this.isInTouch = false
		}, this, 3000);
	}

	/**获取forceX的值 */
	getTweenEndPos(tempPos) {
		if (tempPos > this.maxHeight) {
			tempPos = this.maxHeight
		} else if (tempPos <= this.maxHeight - this.showHeight) {
			tempPos = this.maxHeight - this.showHeight
		}
		return tempPos;
	}

	//销毁函数
	dispose() {
		this.a && this.a.removeChildren();
		this.a = null;
		this.a1 = null;
		this.a2 = null;

	}

}