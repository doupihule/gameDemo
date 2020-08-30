import IMessage from "../../interfaces/IMessage";
import JumpManager from "../../../../framework/manager/JumpManager";
import JumpConst from "../../consts/JumpConst";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import UIBaseView from "../../../../framework/components/UIBaseView";

export default class MainJumpZhiseUI extends UIBaseView implements IMessage {

	private imgWidth: number = 126;
	private spaceX: number = 22;
	private spaceY: number = 44;

	constructor() {
		super();
	}


	setData(data: any): void {
		var jumpData = JumpManager.getMokaDataByType(JumpConst.JUMP_TYPE_JIESUAN);
		this.initJumpData(jumpData);
	}

	/** 互推相关 */
	protected initJumpData(data, isDelay = false) {

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.MainJumpZhiseUI)
	}

}