import ResourceConst from "../../../game/sys/consts/ResourceConst";
import {ButtonUtils} from "../../utils/ButtonUtils";
import JumpManager from "../../manager/JumpManager";
import JumpConst from "../../../game/sys/consts/JumpConst";
import KariqiShareManager from "../../manager/KariqiShareManager";

/**互推打开抽屉按钮 */
export default class MainJumpReturnUI extends Laya.View {

	private returnBtn: Laya.Image;
	private returnRed: Laya.Image;

	constructor() {
		super();
		var url = ResourceConst["JUMP_RETURNBTN"]
		this.returnBtn = new Laya.Image(url);
		this.returnRed = new Laya.Image(ResourceConst["COMMON_REDPOINT"]);
		this.returnRed.anchorX = 0.5;
		this.returnRed.anchorY = 0.5;
		this.returnRed.x = 56;
		this.returnRed.y = 4;
		var txt = new Laya.Label("!");
		txt.font = "Microsoft YaHei";
		txt.bold = true;
		txt.color = "#ffffff";
		txt.fontSize = 18;
		txt.x = 8;
		txt.y = 6;
		this.returnRed.addChild(txt);
		this.returnBtn.addChild(this.returnRed);
		this.addChild(this.returnBtn);
		new ButtonUtils(this.returnBtn, this.onClickExit, this);
	}

	//呼吸动画
	scaleQipaoAni(view, scale = 1.5, callback = null, obj = null, isLoop = true, time = 800) {
		Laya.Tween.clearAll(view);
		Laya.Tween.to(view, {scaleX: scale, scaleY: scale}, time, Laya.Ease.circOut, Laya.Handler.create(this, () => {
			Laya.Tween.to(view, {scaleX: 1, scaleY: 1}, time, null, Laya.Handler.create(this, () => {
				if (isLoop) {
					this.scaleQipaoAni(view, scale, callback, obj, isLoop);
				}
			}))
		}));
	}

	public onAddToStage() {
		if (!this.returnRed) return;
		this.scaleQipaoAni(this.returnRed)
	}

	/*点击退出按钮*/
	onClickExit() {
		if (KariqiShareManager.checkIsKariquChannel()) {
			// 添加互推图标
			JumpManager.initJumpData(JumpManager.showMainJumpKariqu, JumpManager, JumpConst.MAIN_SIDE);
		}
	}

	initData() {
		this.onAddToStage();

	}

	public onRemoveStage() {
		Laya.Tween.clearTween(this.returnRed)
		this.removeSelf();
	}


}