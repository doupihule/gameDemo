import {ui} from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../../framework/utils/ButtonUtils";
import FogFunc from "../../../func/FogFunc";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";


export default class FogComRewardUI extends ui.gameui.fog.FogComRewardUI implements IMessage {

	private reward;
	private rewardArr;
	private callBack;
	private thisObj;
	private cell: FogInstanceCell;

	constructor() {
		super();
		new ButtonUtils(this.receiveBtn, this.close, this);
	}

	public setData(data) {
		this.callBack = null;
		this.thisObj = null;

		this.rewardArr = data.reward;
		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;
		this.cell = data.cell;

		if (this.rewardArr.length == 1) {
			this.reward2.visible = false;
			this.reward1.x = 130;

		} else if (this.rewardArr.length == 2) {
			this.reward2.visible = true;
			this.reward1.x = 39;
			var result2 = FogFunc.instance.getResourceShowInfo(this.rewardArr[1]);
			if (result2["num"] != 0) {
				this.rewardNum2.text = result2["name"] + "+" + result2["num"];
			} else {
				this.rewardNum2.text = "";
			}

			this.rewardImg2.skin = result2["icon"];
			this.rewardImg2.scale(result2["scale"], result2["scale"]);

		}

		//标题
		if (this.cell) {
			this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_gongxi");

		} else {
			this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_shop_bugSucc");

		}

		var result1 = FogFunc.instance.getResourceShowInfo(this.rewardArr[0]);
		if (result1["num"] != 0) {
			this.rewardNum1.text = result1["name"] + "+" + result1["num"];
		} else {
			this.rewardNum1.text = "";
		}

		this.rewardImg1.skin = result1["icon"];
		this.rewardImg1.scale(result1["scale"], result1["scale"]);

	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogComRewardUI);
		if (this.cell) {
			//飘奖励
			var thisObj = WindowManager.getUIByName("FogMainUI");
			FogFunc.instance.flyResTween(this.rewardArr, this.cell.x - 40, this.cell.y + thisObj.cellCtn.y);
		}
		this.callBack && this.callBack.call(this.thisObj);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}