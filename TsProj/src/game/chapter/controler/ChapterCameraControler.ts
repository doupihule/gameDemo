import Equation from "../../../framework/utils/Equation";
import ScreenAdapterTools from "../../../framework/utils/ScreenAdapterTools";
import ChapterLogicControler from "./ChapterLogicControler";
import TimerManager from "../../../framework/manager/TimerManager";

/**
 * 战斗中的镜头控制器.
 * 控制镜头移动.震屏等
 *
 *
 */

export default class ChapterCameraControler {
	public controler: ChapterLogicControler;

	public focusPos: Laya.Vector3;

	private _halfHeight: number = 0;

	public _isPosChange = false;

	/**我方最前边的x */
	public frontPos1 = 0;
	/**正在控制背景 */
	public inControlBg = false;

	constructor(controler) {
		this.controler = controler;
		this._halfHeight = ScreenAdapterTools.designHeight / 2;
		this.focusPos = VectorTools.createVec3(0, 0, 0);
		this.frontPos1 = 0;
	}

	//初始化数据
	public setData() {
		//先把焦点放在最下边的屏幕中心
		this.focusPos.y = this.controler.chapterLayerControler.maxHeight - this._halfHeight;
		this.updateCtnPos(1);
		TimerManager.instance.registObjUpdate(this.updateFrame, this)
	}


	//刷新函数
	public updateFrame() {
		this._isPosChange = false;
		this.followPlayer();
		if (this._isPosChange || this.inControlBg) {
			this.updateCtnPos();
		}
	}

	//更新容器坐标
	public updateCtnPos(tweenFrame = 0.1) {
		var targetPos = this._halfHeight - this.focusPos.y
		if (targetPos > this.controler.chapterMapControler.offestY) {
			targetPos = this.controler.chapterMapControler.offestY;
		}
		if (targetPos < this.controler.chapterLayerControler.minY) {
			targetPos = this.controler.chapterLayerControler.minY
		}
		var pos = Equation.easyToTargetPos(targetPos, this.controler.chapterLayerControler.a2.y, tweenFrame, 5);
		this.updateScenePos(pos);
	}

	public updateScenePos(pos) {

		var targetPos = this.controler.chapterLayerControler.a2.y + pos;
		if (targetPos > this.controler.chapterMapControler.offestY) {
			targetPos = this.controler.chapterMapControler.offestY;
		}
		if (targetPos < this.controler.chapterLayerControler.minY) {
			targetPos = this.controler.chapterLayerControler.minY
		}
		var move = targetPos - this.controler.chapterLayerControler.a2.y;
		this.controler.chapterLayerControler.a2.y = targetPos;
		this.controler.chapterMapControler.onMapMove(move);
	}


	//看向player
	public followPlayer() {
		if (this.controler.chapterLayerControler.isInTouch) return;
		if (this.inControlBg) return;
		if (!this.controler.player) return;
		this.frontPos1 = this.controler.player.pos.y;
		var frontPos1 = this.frontPos1 + 0.5
		this.focusPos.y = frontPos1
		this._isPosChange = true
	}

	public dispose() {
		TimerManager.instance.deleteObjUpdate(null, this.updateFrame, this)
		this.controler = null;
	}


}