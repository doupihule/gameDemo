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
import ViewTools from "../../../../framework/components/ViewTools";
import ImageExpand from "../../../../framework/components/ImageExpand";

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