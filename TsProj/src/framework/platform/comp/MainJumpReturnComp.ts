import IMessage from "../../../game/sys/interfaces/IMessage";
import Message from "../../common/Message";
import WindowEvent from "../../event/WindowEvent";
import JumpManager from "../../manager/JumpManager";
import WindowManager from "../../manager/WindowManager";
import MainJumpReturnUI from '../../view/jump/MainJumpReturnUI';
import ScreenAdapterTools from "../../utils/ScreenAdapterTools";

export default class MainJumpReturnComp implements IMessage {
	/**
	 *
	 * 互推打开抽屉按钮组件
	 */
	private static _instance: MainJumpReturnComp;
	public static get instance() {
		if (!this._instance) {
			this._instance = new MainJumpReturnComp();
		}
		return this._instance;
	}


	private _uiJumpMap: any[] = [
		{ui: null, uiCfg: {}}
	]

	public constructor() {
		Message.instance.add(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, this);
		var uiinfo: any = this._uiJumpMap[0];
		if (!uiinfo.ui) {
			uiinfo.ui = new MainJumpReturnUI();
			uiinfo.ui.y = ScreenAdapterTools.height / 2;
		}
	}

	//检查ui状态
	private _checkUIState() {
		var currentUIName = WindowManager.getCurrentWindowName();
		for (var i = 0; i < this._uiJumpMap.length; i++) {
			var uiInfo = this._uiJumpMap[i];
			var uiCfg = uiInfo.uiCfg;
			var currentInfo = uiCfg[currentUIName];
			var returnBtnUI: MainJumpReturnUI = uiInfo.ui

			//如果当前界面不展示退出按钮
			if (!currentInfo) {
				returnBtnUI.onRemoveStage();
			} else {
				//如果这个ui的状态是显示的
				if (currentInfo.state == 1) {
					var ui = WindowManager.getCurrentWindow();
					ui.addChild(returnBtnUI);
					returnBtnUI.initData()
				} else {
					returnBtnUI.onRemoveStage();
				}
			}
		}


	}

	//接受事件
	public recvMsg(cmd: string, params: any) {
		if (cmd == WindowEvent.WINDOW_EVENT_SWITCHUIFIN) {
			this._checkUIState();
		}
	}

	/**展示互推抽屉打开按钮 */
	public showJumpReturnBtn(parent, params: any = null) {
		if (!JumpManager.checkShow()) return;
		var uiName = parent.windowName;
		var jumpInfo = this._uiJumpMap[0];
		var uiCfg = jumpInfo.uiCfg;
		if (!uiCfg[uiName]) {
			uiCfg[uiName] = {state: 1, params: params};
		}
		this._checkUIState();
	}
}