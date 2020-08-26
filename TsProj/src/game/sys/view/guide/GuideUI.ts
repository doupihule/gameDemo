import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import LogsManager from "../../../../framework/manager/LogsManager";
import GuideManager from "../../manager/GuideManager";
import GuideFunc from "../../func/GuideFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import GuideConst from "../../consts/GuideConst";
import TimerManager from "../../../../framework/manager/TimerManager";


export default class GuideUI extends ui.gameui.guide.GuideUI {
	private blackBg: Laya.Sprite;
	private blackBgLeft: Laya.Sprite;
	private blackBgRight: Laya.Sprite;
	private blackBgBottom: Laya.Sprite;
	private areaHit: Laya.Sprite;
	private hitAreaBg: Laya.HitArea;
	// private descBg: Laya.Image;
	private hand: Laya.Image;
	private handImg: Laya.Image;
	// private desc: Laya.Label;
	// private jump: Laya.Label;


	private callBack;
	private thisObj;

	private guideId;
	private jump;
	private timeCode = 0;

	/* 点击区域的位置，传入参数的前两个 */
	private hitPos: Laya.Vector2;
	/* 点击区域的大小，传入参数的后两个 */
	private hitSize: Laya.Vector2;
	/* 手指的方位，暂时无用 */
	private type: number = 0;
	private skipCall;
	private autoClose = false;

	constructor() {
		super();

		this.blackBg = new Laya.Sprite();
		this.blackBg.alpha = 0.5;
		this.blackBg.mouseEnabled = true;
		this.blackBg.mouseThrough = false;
		// this.blackBg.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
		// this.blackBg.size(Laya.stage.width, Laya.stage.height);
		this.guideArea.addChild(this.blackBg);
		// Global.fitBlend(this.blackBg);

		this.blackBg.on(Laya.Event.MOUSE_DOWN, this, this.onClickMask);

		this.blackBgLeft = new Laya.Sprite();
		this.blackBgLeft.alpha = 0.5;
		this.blackBgLeft.mouseEnabled = true;
		this.blackBgLeft.mouseThrough = false;
		// this.blackBgLeft.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
		// this.blackBgLeft.size(Laya.stage.width, Laya.stage.height);
		this.guideArea.addChild(this.blackBgLeft);

		this.blackBgLeft.on(Laya.Event.MOUSE_DOWN, this, this.onClickMask);

		this.blackBgRight = new Laya.Sprite();
		this.blackBgRight.alpha = 0.5;
		this.blackBgRight.mouseEnabled = true;
		this.blackBgRight.mouseThrough = false;
		// this.blackBgRight.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
		// this.blackBgRight.size(Laya.stage.width, Laya.stage.height);
		this.guideArea.addChild(this.blackBgRight);


		this.blackBgRight.on(Laya.Event.MOUSE_DOWN, this, this.onClickMask);

		this.blackBgBottom = new Laya.Sprite();
		this.blackBgBottom.alpha = 0.5;
		this.blackBgBottom.mouseEnabled = true;
		this.blackBgBottom.mouseThrough = false;
		// this.blackBgBottom.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
		// this.blackBgBottom.size(Laya.stage.width, Laya.stage.height);
		this.guideArea.addChild(this.blackBgBottom);

		this.blackBgBottom.on(Laya.Event.MOUSE_DOWN, this, this.onClickMask);


		this.hand = new Laya.Image();
		this.hand.anchorX = 0;
		this.hand.anchorY = 0;
		this.handImg = new Laya.Image();
		this.hand.width = 70;
		this.hand.height = 102;
		this.handImg.skin = "uisource/guide/guide/guide_image_xiaoshou.png";
		this.hand.addChild(this.handImg)

		this.jump = new Laya.Label();
		this.jump.color = "#ffffff";
		this.jump.font = "Microsoft YaHei";
		this.jump.fontSize = 20;
		this.jump.align = "left";
		this.jump.width = 230;
		this.jump.x = 20;
		this.jump.y = 20;
		this.jump.underline = true;
		this.jump.underlineColor = "#ffffff";
		this.jump.text = "跳过引导";
		this.guideArea.addChild(this.jump);
		new ButtonUtils(this.jump, this.skipGuide, this);


		this.guideArea.addChild(this.hand);

		// Global.fitPhoneBangs(this.jump);

		this.mouseThrough = true;

		this.on(Laya.Event.MOUSE_DOWN, this, this.touchNext);


	}

	//点击继续进行下一步引导
	private touchNext() {
		if (this.touch.visible) {
			WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
			this.callBack && this.callBack.call(this.thisObj);
		}

	}

	skipGuide() {
		GuideManager.ins.guideFin(this.guideId, () => {
			WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
			this.skipCall && this.skipCall.call(this.thisObj);
			GuideManager.ins.recentGuideId = null;
		}, this, true);
	}

	public setData(args: any): void {
		GuideManager.ins.noMask = false;

		var guideId = args[0];
		this.guideId = guideId;

		var guideData = GuideFunc.instance.getGuideInfo(guideId);

		if (guideData.clickGoOn) {
			this.touch.visible = true;
			this.mouseThrough = false;
			this.continueBtn.visible = true;
		} else {
			this.touch.visible = false;
			this.mouseThrough = true;
			this.continueBtn.visible = false;

		}

		this.panel.visible = guideData.desc ? true : false;

		var position = args[7];
		this.callBack = args[8];
		this.thisObj = args[9];
		this.skipCall = args[10]
		var extra = position.extra;
		if (position && position.autoClose) {
			this.autoClose = true
		} else {
			this.autoClose = false;
		}
		// this.alertContext = "点击继续";
		if (this.panel.visible)
			this.text.text = TranslateFunc.instance.getTranslate(guideData.desc, "TranslateGuide", extra && extra.name);


		this.panel.top = NaN;
		this.panel.bottom = NaN;
		this.panel.centerY = NaN;
		if (position.top || position.top == 0)
			this.panel.top = position.top;
		if (position.bottom || position.bottom == 0)
			this.panel.bottom = position.bottom;
		if (position.centerY || position.centerY == 0)
			this.panel.centerY = position.centerY;
		if (position.noSkip) {
			//不能跳过
			this.jump.visible = false;
		} else {
			this.jump.visible = true;
		}
		// if (isNaN(this.panel.top) && isNaN(this.panel.bottom) && isNaN(this.panel.centerY)) {
		//     this.panel.bottom = 10;
		// }
		this.hitPos = new Laya.Vector2(args[1], args[2]);
		this.hitSize = new Laya.Vector2(args[3], args[4]);
		this.hand.rotation = 0;
		this.hand.pos(this.hitPos.x + this.hitSize.x / 2 - this.hand.width / 2, this.hitPos.y - this.hand.height);
		if (extra && extra.handOffestX) {
			this.hand.x += extra.handOffestX
		}
		switch (args[5]) {
			case GuideConst.GUIDE_TYPE_M_F://有遮罩，有手指
				this.blackBg.visible = true;
				this.blackBgLeft.visible = true;
				this.blackBgRight.visible = true;
				this.blackBgBottom.visible = true;
				this.hand.visible = true;
				break;
			case GuideConst.GUIDE_TYPE_M://有遮罩，无手指
				this.blackBg.visible = true;
				this.blackBgLeft.visible = true;
				this.blackBgRight.visible = true;
				this.blackBgBottom.visible = true;
				this.hand.visible = false;
				break;
			case GuideConst.GUIDE_TYPE_F://无遮罩，有手指
				this.blackBg.visible = false;
				this.blackBgLeft.visible = false;
				this.blackBgRight.visible = false;
				this.blackBgBottom.visible = false;
				this.hand.visible = true;
				GuideManager.ins.noMask = true;
				break;
			case GuideConst.GUIDE_TYPE_RF://无遮罩，有手指倒置
				this.blackBg.visible = false;
				this.blackBgLeft.visible = false;
				this.blackBgRight.visible = false;
				this.blackBgBottom.visible = false;
				this.hand.visible = true;
				this.hand.rotation = 180;
				this.hand.pos(this.hitPos.x + this.hitSize.x / 2 + this.hand.width / 2, this.hitPos.y + this.hitSize.y + this.hand.height);
				GuideManager.ins.noMask = true;
				break;
			case GuideConst.GUIDE_TYPE_M_RF://有遮，有手指倒置
				this.blackBg.visible = true;
				this.blackBgLeft.visible = true;
				this.blackBgRight.visible = true;
				this.blackBgBottom.visible = true;
				this.hand.visible = true;
				this.hand.rotation = 180;
				this.hand.pos(this.hitPos.x + this.hitSize.x / 2 + 35, this.hitPos.y + this.hitSize.y + this.hand.height);
				break;
			case GuideConst.GUIDE_TYPE_M_RIGHTF://有遮，有手指右置
				this.blackBg.visible = true;
				this.blackBgLeft.visible = true;
				this.blackBgRight.visible = true;
				this.blackBgBottom.visible = true;
				this.hand.visible = true;
				this.hand.rotation = 90;
				this.hand.pos(this.hitPos.x + this.hitSize.x + this.hand.height, this.hitPos.y);
				break;
			case GuideConst.GUIDE_TYPE_NONE://无遮罩，无手指
				this.blackBg.visible = false;
				this.blackBgLeft.visible = false;
				this.blackBgRight.visible = false;
				this.blackBgBottom.visible = false;
				this.hand.visible = false;
				GuideManager.ins.noMask = true;
				break;

		}

		this.blackBg.graphics.clear();
		this.blackBg.graphics.drawRect(0, 0, Laya.stage.width, this.hitPos.y, "#000000");
		this.blackBg.size(Laya.stage.width, this.hitPos.y);
		this.blackBg.pos(0, 0);

		this.blackBgLeft.graphics.clear();
		this.blackBgLeft.graphics.drawRect(0, 0, this.hitPos.x, this.hitSize.y, "#000000");
		this.blackBgLeft.size(this.hitPos.x, this.hitSize.y);
		this.blackBgLeft.pos(0, this.hitPos.y);

		this.blackBgRight.graphics.clear();
		this.blackBgRight.graphics.drawRect(0, 0, (Laya.stage.width - this.hitPos.x - this.hitSize.x) <= 0 ? 1 : (Laya.stage.width - this.hitPos.x - this.hitSize.x), this.hitSize.y, "#000000");
		this.blackBgRight.size((Laya.stage.width - this.hitPos.x - this.hitSize.x) <= 0 ? 1 : (Laya.stage.width - this.hitPos.x - this.hitSize.x), this.hitSize.y);
		this.blackBgRight.pos(this.hitPos.x + this.hitSize.x, this.hitPos.y);

		this.blackBgBottom.graphics.clear();
		this.blackBgBottom.graphics.drawRect(0, 0, Laya.stage.width, (Laya.stage.height - this.hitPos.y - this.hitSize.y) <= 0 ? 1 : (Laya.stage.height - this.hitPos.y - this.hitSize.y), "#000000");
		this.blackBgBottom.size(Laya.stage.width, (Laya.stage.height - this.hitPos.y - this.hitSize.y) <= 0 ? 1 : (Laya.stage.height - this.hitPos.y - this.hitSize.y));
		this.blackBgBottom.pos(0, this.hitPos.y + this.hitSize.y);

		var alpha = 0.5;
		if (args[6] != null) {
			alpha = args[6];
		}
		LogsManager.echo("krma. alpha:" + alpha);
		this.blackBg.alpha = alpha;
		this.blackBgLeft.alpha = alpha;
		this.blackBgRight.alpha = alpha;
		this.blackBgBottom.alpha = alpha;
		this.taskGroup.visible = false
		if (this.guideId == GuideConst.GUIDE_2_202 || this.guideId == GuideConst.GUIDE_ROLEUNLOCK || this.guideId == GuideConst.GUIDE_12_1201) {
			//解锁新英雄特殊处理
			if (this.hitPos.y - 400 < 0) {
				this.hand.rotation = 180;
				if (this.guideId == GuideConst.GUIDE_12_1201) {
					this.hand.y = this.hitPos.y + this.hitSize.y;
					this.hand.x = this.hitPos.x + this.hitSize.x;
					this.panel.y = this.hand.y + 200;
				} else {
					this.hand.y = this.hitPos.y + this.hitSize.y + 100;
					this.panel.y = this.hand.y;
				}
			} else {
				this.panel.y = this.hand.y - 350;
			}
		} else if (this.guideId == GuideConst.GUIDE_10003) {
			this.panel.visible = false;
			this.taskGroup.visible = true;
			this.taskTxt.text = this.text.text;
			this.taskGroup.x = this.hand.x;
			this.taskGroup.y = this.hand.y;
		}
		TimerManager.instance.remove(this.timeCode);
		Laya.Tween.clearTween(this.handImg)
		if (this.hand.visible) {
			this.addHandTween();
			this.timeCode = TimerManager.instance.add(this.addHandTween, this, 600);
		}
		this.guideLeft.visible = true;
		this.guideRight.visible = false;
		this.text.x = 167
		if (position.direction && position.direction == "right") {
			this.guideRight.visible = true;
			this.guideLeft.visible = false;
			this.text.x = 119;
		}
	}

	onClickMask() {
		if (this.autoClose) {
			WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
		}
	}

	addHandTween() {
		Laya.Tween.to(this.handImg, {y: 10}, 200, null, Laya.Handler.create(this, () => {
			Laya.Tween.to(this.handImg, {y: -10}, 200, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(this.handImg, {y: 0}, 200, null, null)
			}))
		}))
	}
}