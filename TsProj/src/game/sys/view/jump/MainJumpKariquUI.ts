import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import JumpManager from "../../../../framework/manager/JumpManager";

import ResourceConst from "../../consts/ResourceConst";
import LogsManager from "../../../../framework/manager/LogsManager";
import JumpConst from "../../consts/JumpConst";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import TableUtils from "../../../../framework/utils/TableUtils";
import GameUtils from "../../../../utils/GameUtils";
import UIBaseView from "../../../../framework/components/UIBaseView";

export default class MainJumpKariquUI extends UIBaseView implements IMessage {

	private imgWidth: number = 170;
	private spaceX: number = 20;
	private spaceY: number = 20;

	constructor() {
		super();
	}


	setData(data: any): void {
		var jumpData = JumpManager.getMokaDataByType(JumpConst.JUMP_KARIQU_LEFTSIDE);
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
		WindowManager.CloseUI(WindowCfgs.MainJumpKariquUI)
	}

}