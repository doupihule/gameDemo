import BattleLogicalControler from "./BattleLogicalControler";
import ScreenAdapterTools from "../../../framework/utils/ScreenAdapterTools";
import BattleFunc from "../../sys/func/BattleFunc";
import BattleConst from "../../sys/consts/BattleConst";

export class BattleLayerControler {
	/**
	 * 游戏图层管理器,初步将游戏分为4
	 * a = {
	 * 	a1,
	 * 	a2 = {
	 * 		a21,
	 * 		a22,
	 * 		a23,
	 * 	}
	 * 	a3:
	 * }
	 *
	 *
	 */

	/**游戏的根容器 */
	a: Laya.Sprite;
	/**游戏场景的后景层 */
	a1: Laya.Sprite;
	/**游戏世界元素交互的容器 */
	a2: Laya.Sprite;
	/**游戏场景的前景层 */
	a3: Laya.Sprite;
	/**游戏容器的偏移层级 */
	a2Offset: Laya.Sprite;
	/**游戏世界元素交互容器的后层,主要是放脚下光环.影子,等需要被角色压住的特效 */
	a21: Laya.Sprite;
	/**游戏世界元素里面的角色所在的容器,主要放角色.主要交互都在这一层 */
	a22: Laya.Sprite;
	/**游戏世界元素里面 的前景特效. 需要挡住角色.但是会被场景的前景挡住 */
	a23: Laya.Sprite;
	controler: BattleLogicalControler;


	public rootCtn: Laya.Sprite;

	public clickNode: Laya.Sprite;
	public isInTouch = false;


	public constructor(controler: BattleLogicalControler, rootCtn: Laya.Sprite) {
		this.controler = controler;
		this.rootCtn = rootCtn;

		this.a = new Laya.Sprite()
		this.a.x = ScreenAdapterTools.UIOffsetX
		this.a.y = ScreenAdapterTools.UIOffsetY;

		this.a1 = new Laya.Sprite();
		this.a2 = new Laya.Sprite();
		this.a3 = new Laya.Sprite();


		this.a2Offset = new Laya.Sprite();

		this.a21 = new Laya.Sprite();
		this.a22 = new Laya.Sprite();
		this.a23 = new Laya.Sprite();


		rootCtn.addChild(this.a);
		this.a.addChild(this.a1);
		this.a.addChild(this.a2);
		this.a.addChild(this.a3);


		//为了方便坐标好算. 网格的(0,0)点会和 原点有一个相对坐标偏移
		this.a2.addChild(this.a2Offset);
		this.a2Offset.x = 0;
		this.a2Offset.y = 0;

		this.a2Offset.addChild(this.a21);
		this.a2Offset.addChild(this.a22);
		this.a2Offset.addChild(this.a23);

		this.isInTouch = false;
	}


	/**当前场景移动（a）能达到的最小x坐标 */
	public minX: number = 0;
	/**当前场景移动（a）能达到的最大x坐标 */
	public maxX: number = 0;
	/**当前关卡背景和手机宽度的比例 */
	public sceneWidthRate: number = 1;
	private _startTouchX;

	setSceneInfo() {
		this.minX = ScreenAdapterTools.width - this.controler.mapControler._maxSceneWidth + 64;
		this.sceneWidthRate = this.controler.mapControler._maxSceneWidth / 597;
	}

	//逐帧刷新函数
	updateFrame() {
		//这里主要做震屏
	}

	onTouchBegin(event) {
		this._startTouchX = event.stageX;
		this.isInTouch = true;
		this.controler.clearCallBack(this);
	}

	onTouchMove(event) {
		if (!this._startTouchX) return;
		this.controler.cameraControler.inControlBg = false;
		var tempPos = this.controler.cameraControler.focusPos.x + (this._startTouchX - event.stageX)
		tempPos = this.getTweenEndPos(tempPos);
		this.controler.cameraControler.focusPos.x = tempPos
		this.controler.cameraControler.updateCtnPos(1);
		this._startTouchX = event.stageX;
		//刷新标志显示
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			if (this.a2.x < this.maxX && this.maxX - this.a2.x < 20 && this.controler.battleUI.roleSignBtn.visible) {
				this.controler.battleUI.roleSignBtn.visible = false;
				this.controler.battleUI.enemySignBtn.visible = true;
			}
			if (this.a2.x > this.minX && this.minX - this.a2.x > -20 && this.controler.battleUI.enemySignBtn.visible) {
				this.controler.battleUI.enemySignBtn.visible = false;
				this.controler.battleUI.roleSignBtn.visible = true;
			}
		}
	}

	onTouchUp(event) {
		this._startTouchX = null;
		this.controler.setCallBack(60 * 5, () => {
			this.isInTouch = false
		}, this);
	}

	/**获取forceX的值 */
	getTweenEndPos(tempPos) {
		if (tempPos > this.controler.mapControler._maxSceneWidth) {
			tempPos = this.controler.mapControler._maxSceneWidth
		} else if (tempPos <= 0) {
			tempPos = 0
		}
		return tempPos;
	}

	//销毁函数
	dispose() {
		this.a && this.a.removeChildren();
		this.a = null;
		this.a1 = null;
		this.a2 = null;
		this.a3 = null;

		this.a21 = null;
		this.a22 = null;
		this.a23 = null;
		this.controler = null;
	}

}