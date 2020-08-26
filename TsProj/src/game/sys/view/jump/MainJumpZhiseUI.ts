import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import JumpManager from "../../../../framework/manager/JumpManager";
import {ui} from "../../../../ui/layaMaxUI";
import LogsManager from "../../../../framework/manager/LogsManager";
import JumpConst from "../../consts/JumpConst";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import TableUtils from "../../../../framework/utils/TableUtils";

export default class MainJumpZhiseUI extends ui.gameui.jump.MainJumpZhiseUI implements IMessage {

	private imgWidth: number = 126;
	private spaceX: number = 22;
	private spaceY: number = 44;

	constructor() {
		super();
		new ButtonUtils(this.closeBtn, this.close, this);
	}


	setData(data: any): void {
		var jumpData = JumpManager.getMokaDataByType(JumpConst.JUMP_TYPE_JIESUAN);
		this.initJumpData(jumpData);
	}

	/** 互推相关 */
	protected initJumpData(data, isDelay = false) {
		LogsManager.echo("xd 初始化结算互推", data)
		this.iconPanel.removeChildren();
		var newData: any[] = TableUtils.copyOneArr(data);
		data = newData;
		for (var i = 0; i < data.length; i++) {
			var xIndex: number = i % 3;
			var yIndex: number = Math.floor(i / 3);
			var itemData = data[i];
			// var sign;
			// if (indexArr.indexOf(i) != -1) {
			//     if (indexArr.indexOf(i) == 0) {
			//         sign = ResourceConst.JUMP_ICON_HOT;
			//     } else {
			//         sign = ResourceConst.JUMP_ICON_NEW;
			//     }
			// }
			var itemBox = JumpManager.createJumpItem(itemData, this.imgWidth, this.imgWidth, {from: JumpConst.RESULT_MIDDLE}, null, 0, true, 20, "#ffffff", false);
			itemBox.x = xIndex * (this.imgWidth + this.spaceX);
			itemBox.y = yIndex * (this.imgWidth + this.spaceY);
			this.iconPanel.addChild(itemBox);
		}
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.MainJumpZhiseUI)
	}

}