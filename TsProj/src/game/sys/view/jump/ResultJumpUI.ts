
import IMessage from "../../interfaces/IMessage";

import TimerManager from "../../../../framework/manager/TimerManager";
import Message from "../../../../framework/common/Message";
import MsgCMD from "../../common/MsgCMD";
import JumpManager from "../../../../framework/manager/JumpManager";
import JumpEvent from "../../../../framework/event/JumpEvent";
import UIBaseView from "../../../../framework/components/UIBaseView";

export default class ResultJumpUI extends UIBaseView implements IMessage {
	public static res = [
		"gameui/ResultJump.scene",
	];
	private static instance: ResultJumpUI = null;
	private data: any;
	private imgWidth: number = 124;
	private spaceX: number = 6;

	/**是否被按住 */
	private isTouch: boolean = false;
	/**手指抬起后延迟5秒的code */
	private touchEndCode: number;
	/**定时移动 */
	/**方向，是否向右移动 */
	private isRight: boolean = true;
	/**可移动的宽度 */
	private moveWidth: number;
	private extraData;

	constructor(data, extraData, param) {
		super();
		ResultJumpUI.instance = this;
		this.extraData = extraData;
		// this.initData(data);
		this.data = data;
		Message.instance.add(MsgCMD.RETURN_GAMEMAIN, this);
	}

	private onAddToStage() {

		this.startItemMoveLoop();
	}

	private onRemoveStage() {
		this.clearMoveLoop();
	}


	initData(data: any) {
	}

	private _itemMoveCode: number = 0;

	/**添加移动定时器 */
	startItemMoveLoop() {
		this.clearMoveLoop();
		this._itemMoveCode = TimerManager.instance.add(this.itemMove, this, 10);
		// egret.timer.loop(10, this, this.itemMove);
	}

	setFrom(from) {
		this.extraData.from = from

	}

	/**按下item */
	touchDownItem() {
		this.isTouch = true;
		if (this.touchEndCode) {
			TimerManager.instance.remove(this.touchEndCode);
		}
	}

	/**移除定时器 */
	clearMoveLoop() {
		TimerManager.instance.remove(this._itemMoveCode);
	}

	/**icon左右移动 */
	itemMove() {
	}

	/**手指从这里抬起 */
	touchOut() {
		this.touchEndCode = TimerManager.instance.setTimeout(() => {
			this.isTouch = false
		}, this, 2000);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
			case JumpEvent.JUMP_RETURN_GAMEMAIN:
				this.clearMoveLoop();
				break;
		}
	}


}