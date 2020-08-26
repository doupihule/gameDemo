import {ui} from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import FogFunc from "../../../func/FogFunc";
import StringUtils from "../../../../../framework/utils/StringUtils";
import {DataResourceType} from "../../../func/DataResourceFunc";


export default class FogRewardItemUI extends ui.gameui.fog.FogRewardItemUI implements IMessage {

	public itemWidth = 120;
	public itemHeight = 165;
	private reward;

	constructor(data) {
		super();
		this.reward = data;
		this.setData();
	}

	setData() {
		this.pieceImg.visible = false;

		var result = FogFunc.instance.getResourceShowInfo(this.reward);
		this.itemIcon.skin = result["icon"];
		this.itemIcon.scaleX = this.itemIcon.scaleY = result["scale"];
		this.itemLab.text = "x" + StringUtils.getCoinStr(result["num"]);

		if (Number(this.reward) == DataResourceType.PIECE) {
			this.pieceImg.visible = true;
		}
	}

	itemTween() {

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}