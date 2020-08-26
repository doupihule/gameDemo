import IMessage from "../../interfaces/IMessage";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import JumpManager from "../../../../framework/manager/JumpManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import LogsManager from "../../../../framework/manager/LogsManager";
import JumpConst from "../../consts/JumpConst";
import UserInfo from "../../../../framework/common/UserInfo";
import ControlConst from "../../../../framework/consts/ControlConst";
import ResourceConst from "../../consts/ResourceConst";
import {ui} from "../../../../ui/layaMaxUI";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import GameUtils from "../../../../utils/GameUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";

export default class JumpListZhiseUI extends ui.gameui.jump.JumpListZhiseUI implements IMessage {

	private _itemMoveCode: number = 0;

	private listData: any[] = [];
	private lineCount = 3;
	private itemWidth: number = 178;
	private itemHeight: number = 211;
	private imgWidth: number = 155;
	private spaceX: number = 22;
	private spaceY: number = 20;
	private isInit: boolean = false;
	private isFirstInit: boolean = true;
	//562   703
	/**可移动的高度 */
	private moveHeight: number;
	/**是否被按住 */
	private isTouch: boolean = false;
	/**手指抬起后延迟5秒的code */
	private touchEndCode: number;
	private touchEndCode2: number;
	/**方向，是否向下移动 */
	private isDown: boolean = true;

	private closeCallback: any;
	private closeThisObj: any;

	private fakeNumList = [];
	private fromWhere;
	/**方向，是否向右移动 */
	private isRight: boolean = true;
	private isTouch2: boolean = false;


	constructor() {
		super();
		ScreenAdapterTools.alignNotch(this.closeBtn);
		ScreenAdapterTools.alignNotch(this.midTopGroup);
		// 动态调整列表长度
		// this.iconPanel2.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth

		new ButtonUtils(this.closeBtn, this.close, this);
		this.iconPanel2.vScrollBarSkin = "";
		this.iconPanel1.hScrollBarSkin = "";
		this.on(Laya.Event.DISPLAY, this, this.onAddToStage);
		this.on(Laya.Event.UNDISPLAY, this, this.onRemoveStage);
		this.iconPanel1.on(Laya.Event.MOUSE_OUT, this, this.touchOut);
		this.iconPanel1.on(Laya.Event.MOUSE_DOWN, this, this.touchDownItem);
		this.iconPanel1.on(Laya.Event.MOUSE_UP, this, this.touchOut);
		this.iconPanel2.on(Laya.Event.MOUSE_UP, this, this.touchOut2);
		this.iconPanel2.on(Laya.Event.MOUSE_UP, this, this.touchOut2);
		this.iconPanel2.on(Laya.Event.MOUSE_DOWN, this, this.touchDownItem2);

		new ButtonUtils(this.playBtn, this.onClickPlay, this).setBtnType(ButtonConst.BUTTON_TYPE_4);

	}

	private onAddToStage() {

		this.startItemMoveLoop();
	}

	private onRemoveStage() {
		this.clearMoveLoop();
	}

	setData(data: any): void {
		this.closeCallback = null;
		this.closeThisObj = null;
		if (data && data.callback) {
			this.closeCallback = data.callback;
			this.closeThisObj = data.thisObj;
		}
		if (data && data.from) {
			this.fromWhere = data.from;

		}
		JumpManager.setFrom = this.fromWhere;
		JumpManager.isInDrawer = true;

		this.initView();
		JumpManager.mtDrawer(this.listData);
		// // if (data && data.result) {
		this.playBtn.visible = true;
		// } else {
		//     this.playBtn.visible = false;
		// }


	}

	private initView() {
		//初始化列表1
		var size1 = 99;
		this.iconPanel1.removeChildren();
		var headListData = JumpManager.getMokaDataByType(JumpConst.JUMP_TYPE_JIESUAN);

		if (!headListData) {
			return;
		}
		//按照权重随机
		GameUtils.shuffle(headListData);
		var len = headListData.length;
		for (var i = 0; i < len; i++) {
			var itemData = headListData[i];
			var itemGroup: Laya.Image = JumpManager.createJumpItem(itemData, size1, size1, {from: JumpConst.JUMPLIST}, false, 0, true, 18, "#000000", false);
			itemGroup.x = i % len * (size1 + 20);
			itemGroup.y = 14;
			this.iconPanel1.addChild(itemGroup);
		}
		//初始化列表2
		var size2 = 186;
		this.iconPanel2.removeChildren();
		this.listData = headListData;
		if (!this.listData) return;
		var indexArr = [];
		JumpManager.getTwoRandom(0, this.listData.length, indexArr);
		for (var i = 0; i < this.listData.length; i++) {
			var itemData = this.listData[i];
			// icon组
			var itemGroup: Laya.Image = new Laya.Image();
			itemGroup.width = size2;
			itemGroup.height = size2 + 47;
			// icon背景
			var itemBg: Laya.Image = new Laya.Image(ResourceConst.JUMP_ZHISE_ICONBG);
			itemBg.width = size2
			itemBg.height = itemGroup.height;
			itemBg.sizeGrid = "25,19,23,22"
			new ButtonUtils(itemBg, this.clickItem, this, null, null, itemData).setBtnType(ControlConst.BUTTON_TYPE_3);
			itemGroup.addChild(itemBg)
			// icon图
			var imgItem: Laya.Image = new Laya.Image(itemData.Icon);
			imgItem.x = imgItem.y = 6;
			imgItem.width = imgItem.height = size2 - 12;
			itemGroup.addChild(imgItem)
			imgItem.mouseEnabled = false;
			//文本底
			var labelBg: Laya.Image = new Laya.Image(JumpManager.getZhiseLabelBg());
			labelBg.width = imgItem.width;
			labelBg.height = 47;
			labelBg.x = imgItem.x;
			labelBg.y = imgItem.height;
			itemGroup.addChild(labelBg);
			//文本
			var itemName: Laya.Label = new Laya.Label(itemData.GameName);
			itemName.fontSize = 24;
			itemName.font = "Microsoft YaHei"
			itemName.align = "center";
			itemName.overflow = "hidden";
			itemName.width = imgItem.width;
			itemName.x = imgItem.x;
			itemName.y = imgItem.height + 12;
			itemName.color = "#ffffff"
			itemGroup.addChild(itemName);
			itemName.mouseEnabled = false;
			this.iconPanel2.addChild(itemGroup);
			//标志
			var sign;
			if (indexArr.indexOf(i) != -1) {
				if (indexArr.indexOf(i) == 0) {
					sign = ResourceConst.JUMP_ICON_HOT;
				} else {
					sign = ResourceConst.JUMP_ICON_NEW;
				}
				var signImg: Laya.Image = new Laya.Image(sign);
				signImg.width = 70;
				signImg.height = 40;
				signImg.x = size2 - signImg.width;
				signImg.y = 0;
				itemGroup.addChild(signImg);
			}
			itemGroup.x = i % this.lineCount * (itemGroup.width + 20);
			itemGroup.y = Math.floor(i / this.lineCount) * (itemGroup.height + 16);
		}
	}

	/**点击图片 */
	clickItem(data: any) {
		LogsManager.echo("yrc clickItem", data);
		var sendData = {
			appId: data.GameAppId,
			path: data.PromoteLink,
			jumpData: data,
			extraData: {
				from: JumpConst.JUMPLIST
			}
		}
		UserInfo.platform.jumpToMiniProgram(sendData);
	}

	/**添加移动定时器 */
	startItemMoveLoop() {
		this.isTouch = false;
		this.isTouch2 = false;
		this._itemMoveCode = TimerManager.instance.add(this.itemMove, this, 10);
	}

	/**按下item */
	touchDownItem() {
		// this.isTouch = true;
		// if (this.touchEndCode) {
		//     TimerManager.instance.remove(this.touchEndCode);
		// }
	}

	/**按下item */
	touchDownItem2() {
		// this.isTouch2 = true;
		// if (this.touchEndCode2) {
		//     TimerManager.instance.remove(this.touchEndCode2);
		// }
	}

	/**icon左右移动 */
	itemMove() {
		if (!this.isTouch) {
			var moveX = 1;
			var curX = this.iconPanel1.hScrollBar.value;
			var moveWidth = this.iconPanel1.contentWidth - this.iconPanel1.width;
			if (this.isRight && curX >= moveWidth) {
				this.isRight = false;
			}
			if (!this.isRight && curX <= 0) {
				this.isRight = true;
			}
			if (!this.isRight) {
				moveX = -1;
			}
			this.iconPanel1.hScrollBar.value += moveX;
		}
		if (!this.isTouch2) {
			var moveY = 1;
			var curY = this.iconPanel2.vScrollBar.value;
			var moveHeight = this.iconPanel2.contentHeight - this.iconPanel2.height;
			if (this.isDown && curY >= moveHeight) {
				this.isDown = false;
			}
			if (!this.isDown && curY <= 0) {
				this.isDown = true;
			}
			if (!this.isDown) {
				moveY = -1;
			}
			this.iconPanel2.vScrollBar.value += moveY;
		}

	}

	/**手指从这里抬起 */
	touchOut(isDouble: boolean) {
		this.touchEndCode = TimerManager.instance.setTimeout(() => {
			this.isTouch = false
		}, this, 1500);
	}

	/**手指从这里抬起 */
	touchOut2(isDouble: boolean) {
		this.touchEndCode2 = TimerManager.instance.setTimeout(() => {
			this.isTouch2 = false
		}, this, 1500);
	}

	/**移除定时器 */
	clearMoveLoop() {
		TimerManager.instance.remove(this._itemMoveCode);
		if (this.touchEndCode) {
			TimerManager.instance.remove(this.touchEndCode);
		}
		if (this.touchEndCode2) {
			TimerManager.instance.remove(this.touchEndCode2);
		}
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}

	onClickPlay() {
		this.close();
	}

	close() {
		JumpManager.isInDrawer = false;
		this.clearMoveLoop();
		this.closeCallback && this.closeCallback.call(this.closeThisObj);
		WindowManager.CloseUI(WindowCfgs.JumpListZhiseUI)
	}

}