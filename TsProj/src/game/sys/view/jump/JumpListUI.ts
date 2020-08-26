import IMessage from "../../interfaces/IMessage";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import JumpManager from "../../../../framework/manager/JumpManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import Equation from "../../../../framework/utils/Equation";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import LogsManager from "../../../../framework/manager/LogsManager";
import JumpConst from "../../consts/JumpConst";
import UserInfo from "../../../../framework/common/UserInfo";
import ControlConst from "../../../../framework/consts/ControlConst";
import ResourceConst from "../../consts/ResourceConst";
import {ui} from "../../../../ui/layaMaxUI";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";

export default class JumpListUI extends ui.gameui.jump.JumpListUI implements IMessage {

	private _itemMoveCode: number = 0;

	private listData: any[] = [];
	private lineCount = 2;
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
	/**方向，是否向下移动 */
	private isDown: boolean = true;

	private closeCallback: any;
	private closeThisObj: any;

	private fakeNumList = [];
	private fromWhere;


	constructor() {
		super();
		ScreenAdapterTools.alignNotch(this.closeBtn);
		ScreenAdapterTools.alignNotch(this.midTopGroup);
		// 动态调整列表长度
		this.iconPanel2.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth

		new ButtonUtils(this.closeBtn, this.close, this);
		this.iconPanel2.vScrollBarSkin = "";
	}


	setData(data: any): void {
		var fakeNumList = GlobalParamsFunc.instance.getGlobalCfgDatas("electAdvertisingNub").arr

		for (var index in fakeNumList) {
			this.fakeNumList.push(fakeNumList[index]);
		}
		this.fakeNumList = this.fakeNumList.sort(() => {
			return Math.random() < 0.5 ? 1 : -1
		})
		this.closeCallback = null;
		this.closeThisObj = null;
		if (data && data[0] && data[0].callback) {
			this.closeCallback = data[0].callback;
			this.closeThisObj = data[0].thisObj;
		}
		if (data && data[0] && data[0].from) {
			this.fromWhere = data[0].from;

		}
		JumpManager.setFrom = this.fromWhere;
		JumpManager.isInDrawer = true;

		this.initView();
		JumpManager.mtDrawer(this.listData);
	}

	private initView() {
		//初始化列表1
		var size1 = 120;
		this.iconPanel1.removeChildren();
		var headListData = JumpManager.getMokaData(1, 10);
		if (!headListData) {
			return;
		}
		//按照权重随机

		var len = headListData.length;
		var startIndex = len - 4;
		//头部显示的数量原则上最少显示4个
		var headNums;
		if (len < 4) {
			headNums = len;
		} else {
			headNums = 4;
		}
		if (startIndex < 0) {
			startIndex = 0;
		}
		if (!this.listData) return;
		for (var i = 0; i < headNums; i++) {
			var itemData = headListData[i + startIndex];

			var itemGroup: Laya.Image = JumpManager.createJumpItem(itemData, size1, size1, {from: JumpConst.JUMPLIST}, false, 0, false);
			itemGroup.x = (i % 4) * (size1 + 20) + 10;
			itemGroup.y = Math.floor(i / 4) * (size1 + 10) + 5;
			this.iconPanel1.addChild(itemGroup);
		}
		this.moveHeight = this.iconPanel1.contentHeight - this.iconPanel1.height;
		this.iconPanel1.on(Laya.Event.MOUSE_UP, this, this.touchOut);

		//初始化列表2
		var size2 = 240;
		this.iconPanel2.removeChildren();
		this.listData = JumpManager.getMokaData(1, 10, 1);
		if (!this.listData) return;
		for (var i = 0; i < this.listData.length; i++) {
			var itemData = this.listData[i];

			// icon组
			var itemGroup: Laya.Image = new Laya.Image();
			itemGroup.width = size2;
			itemGroup.height = size2 + 80;
			// itemGroup.x = (i % 2) * (size2 + 30 + 18);
			// itemGroup.y = Math.floor(i / 2) * (size2 + 80 + 20);

			// icon背景
			var itemBg: Laya.Image = new Laya.Image(ResourceConst.JUMP_ICON_REMENTUIJIAN_PNG);
			// itemBg. = new egret.Rectangle(10, 10, 10, 10);
			itemBg.width = size2
			itemBg.height = size2 + 40;
			itemBg.sizeGrid = "21,22,14,24"
			// itemBg.x = (i % 2) * (size2 + 30 + 18);
			// itemBg.y = Math.floor(i / 2) * (size2 + 80 + 20);
			new ButtonUtils(itemBg, this.clickItem, this, null, null, itemData).setBtnType(ControlConst.BUTTON_TYPE_3);
			itemGroup.addChild(itemBg)

			// icon图
			var imgItem: Laya.Image = new Laya.Image(itemData.Icon);
			imgItem.x = imgItem.y = 15;
			imgItem.width = imgItem.height = size2 - 30;
			itemGroup.addChild(imgItem)
			imgItem.mouseEnabled = false;
			var itemName: Laya.Label = new Laya.Label(itemData.GameName);
			itemName.fontSize = 18;
			// itemName.anchorX = 0.5;
			// itemName.anchorY = 0.5;
			itemName.x = 15;
			itemName.y = size2 + 10;
			itemName.color = "#0000ff"
			itemGroup.addChild(itemName);
			itemName.mouseEnabled = false;
			var numStr: any = Number(this.fakeNumList[i]);
			if (numStr > 10000) {
				numStr = Equation.getNumByDecimal(numStr / 10000, 1);
				numStr = numStr + "万"
			}
			var itemLabel: Laya.Label = new Laya.Label(numStr + "人玩");
			itemLabel.fontSize = 18;
			// itemLabel.anchorY = 0.5;
			itemLabel.width = 100;
			itemLabel.x = 135;
			itemLabel.y = size2 + 10;
			itemLabel.color = "#ff0000"
			itemLabel.align = "right";
			itemGroup.addChild(itemLabel);
			this.iconPanel2.addChild(itemGroup);
			itemGroup.x = i % this.lineCount * (itemGroup.width + 80);
			itemGroup.y = Math.floor(i / this.lineCount) * (itemGroup.height);
		}
		this.moveHeight = this.iconPanel2.contentHeight - this.iconPanel2.height;
		this.iconPanel2.on(Laya.Event.MOUSE_UP, this, this.touchOut);
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
		this._itemMoveCode = TimerManager.instance.add(this.itemMove, this, 10);
	}

	/**icon左右移动 */
	itemMove() {
		if (!this.isTouch) {
			var moveY = 1;
			var curX = this.iconPanel2.hScrollBar.value;
			var moveHeight = this.iconPanel1.contentHeight - this.iconPanel1.height;
			if (this.isDown && curX >= moveHeight) {
				this.isDown = false;
			}
			if (!this.isDown && curX <= 0) {
				this.isDown = true;
			}
			if (!this.isDown) {
				moveY = -1;
			}
			this.iconPanel2.hScrollBar.value += moveY;
		}
	}

	/**手指从这里抬起 */
	touchOut(isDouble: boolean) {
		this.touchEndCode = TimerManager.instance.setTimeout(() => {
			this.isTouch = false
		}, this, 2000);
	}

	/**移除定时器 */
	clearMoveLoop() {
		TimerManager.instance.remove(this._itemMoveCode);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}

	close() {
		JumpManager.isInDrawer = false;
		this.clearMoveLoop();
		var tempFunc = this.closeCallback;
		var tempObj = this.closeThisObj;

		WindowManager.CloseUI(WindowCfgs.JumpListUI);
		tempFunc && tempFunc.call(tempObj);
	}

}