import IMessage from "../../../game/sys/interfaces/IMessage";
import WindowEvent from "../../event/WindowEvent";
import JumpManager from "../../manager/JumpManager";

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
	}

	//检查ui状态
	private _checkUIState() {


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