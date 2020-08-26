import IMessage from "../../../game/sys/interfaces/IMessage";
import LogsManager from "../../manager/LogsManager";
import ScreenAdapterTools from "../../utils/ScreenAdapterTools";
import JumpManager from "../../manager/JumpManager";
import TimerManager from "../../manager/TimerManager";
import BannerStyleJumpComp from "../../platform/comp/BannerStyleJumpComp";


export default class BannerStyleJumpUI extends Laya.View implements IMessage {
	private data: any;
	private imgWidth: number = 160;
	private spaceX: number = 8;

	/**是否被按住 */
	private isTouch: boolean = false;
	/**手指抬起后延迟5秒的code */
	private touchEndCode: number;
	/**定时移动 */
	/**方向，是否向右移动 */
	private isRight: boolean = true;
	/**可移动的宽度 */
	private moveWidth: number;

	public iconPanel: Laya.Panel;
	private backRect: Laya.Sprite;

	//每移动一格等待时间
	private static perWaitFrame: number = 120;
	private static perMoveFrame: number = 30;   //每次移动的时间是0.5秒
	//剩余等待时间
	private _leftWaitFrame: number = 120;
	//剩余移动时间
	private _leftMoveFrame: number = 120;
	//移动速度
	private _moveSpeed: number = 2;

	//总移动距离
	private _moveTotalWid: number = 0;

	constructor() {
		super();
		super.createChildren();
		this.imgWidth = BannerStyleJumpComp.jumpHeight - 10
		this._moveSpeed = (this.imgWidth + this.spaceX) / BannerStyleJumpUI.perMoveFrame;
		this._leftMoveFrame = BannerStyleJumpUI.perMoveFrame
		// this.initData(data);
		this.backRect = new Laya.Sprite();
		this.backRect.graphics.drawRect(0, 0, ScreenAdapterTools.width, BannerStyleJumpComp.jumpHeight, "#000000", "#666666", 1);
		this.backRect.alpha = 0.3;
		this.addChild(this.backRect);
		this.iconPanel = new Laya.Panel();
		this.iconPanel.x = 0;
		this.iconPanel.y = 0;
		this.iconPanel.width = ScreenAdapterTools.width;
		this.iconPanel.height = BannerStyleJumpComp.jumpHeight
		this.addChild(this.iconPanel);
		this.width = ScreenAdapterTools.width;
		this.height = this.imgWidth
		this.on(Laya.Event.DISPLAY, this, this.onAddToStage);
		this.on(Laya.Event.UNDISPLAY, this, this.onRemoveStage);
	}

	private onAddToStage() {
		TimerManager.instance.deleteObjUpdate(null, this.updateFrame, this);
		TimerManager.instance.registObjUpdate(this.updateFrame, this);
	}

	//移除舞台 就移除刷新函数
	private onRemoveStage() {
		TimerManager.instance.deleteObjUpdate(null, this.updateFrame, this);
	}


	initData(data: any, from) {
		LogsManager.echo("yrc111 ResultJumpUI", data)
		this.iconPanel.hScrollBarSkin = "";
		this.iconPanel.removeChildren();
		for (var i = 0; i < data.length; i++) {
			var itemData = data[i];
			var imgItem: Laya.Image = JumpManager.createJumpItem(itemData, this.imgWidth, this.imgWidth, {from: from}, null, null, false);
			imgItem.x = i * (this.imgWidth + this.spaceX);
			this.iconPanel.addChild(imgItem);
		}
		//总移动范围
		this._moveTotalWid = data.length * (this.imgWidth + this.spaceX) - this.spaceX;

		this.iconPanel.on(Laya.Event.MOUSE_OUT, this, this.touchOut);
		this.onAddToStage();
	}

	private _itemMoveCode: number = 0;
	private moveCount: number = 0;

	public updateFrame() {
		//如果是按下状态 不执行
		if (this.isTouch) {
			return
		}
		//如果剩余等待时间没到
		if (this._leftWaitFrame > 0) {
			this._leftWaitFrame--;
			return;
		}
		if (this._leftMoveFrame > 0) {
			this._leftMoveFrame--;
			this.itemMove();
			//运动时间到了之后开始等待
			if (this._leftMoveFrame == 0) {
				this._leftMoveFrame = BannerStyleJumpUI.perMoveFrame;
				this._leftWaitFrame = BannerStyleJumpUI.perWaitFrame;
				LogsManager.echo("_oneframemvoe");
			}

		}

	}

	/**按下item */
	touchDownItem() {
		this.isTouch = true;
		if (this.touchEndCode) {
			TimerManager.instance.remove(this.touchEndCode);
		}
	}


	/**icon左右移动 */
	itemMove() {
		var moveX = this._moveSpeed;
		if (!this.isRight) {
			moveX = -this._moveSpeed;
		}
		// LogsManager.echo("__movecount:",this._leftMoveFrame,"way:",this.isRight);
		var curX = this.iconPanel.hScrollBar.value;
		var moveWidth = this.iconPanel.contentWidth - this.iconPanel.width;
		if (this.isRight && curX >= moveWidth) {
			this.isRight = false;
		}
		if (!this.isRight && curX <= 0) {
			this.isRight = true;
		}

		this.iconPanel.hScrollBar.value += moveX;
	}

	/**手指从这里抬起 */
	touchOut() {
		this.touchEndCode = TimerManager.instance.setTimeout(() => {
			this.isTouch = false
		}, this, 2000);
	}

	recvMsg(cmd: string, data: any): void {
	}


}