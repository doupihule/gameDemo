import {ui} from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../../framework/utils/ButtonUtils";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import {DataResourceType} from "../../../func/DataResourceFunc";
import FogModel from "../../../model/FogModel";
import FogServer from "../../../server/FogServer";
import RolesFunc from "../../../func/RolesFunc";
import StringUtils from "../../../../../framework/utils/StringUtils";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";


export default class FogDoorUI extends ui.gameui.fog.FogDoorUI implements IMessage {

	private eventId;//事件id
	private eventInfo;//事件cfg
	private keyCostId;//钥匙开启消耗的道具id
	private actCostNum;//消耗的行动力

	private callBack;
	private thisObj;

	//格子事件
	private events: FogEventData;
	//格子
	private cell: FogInstanceCell;

	private isFinish = false;//是否完成事件

	constructor() {
		super();
		new ButtonUtils(this.closeBtn, this.close, this);
		new ButtonUtils(this.openBtn, this.onClickDirectOpen, this);
		new ButtonUtils(this.keyOpenBtn, this.onClickKeyOpen, this);
		new ButtonUtils(this.actOpenBtn, this.onClickActOpen, this);
	}

	public setData(data) {
		this.keyCostId = "";
		this.actCostNum = 0;
		this.isFinish = false;

		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;

		this.events = data.event;
		this.cell = data.cell;
		this.eventId = this.events.eventId;
		this.eventInfo = this.events.cfgData;


		this.initBtnGroup();

		//eventImg
		this.eventImg.skin = "fog/fog/" + this.eventInfo.uiIcon[0] + ".png";
		//标题
		this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");


		BannerAdManager.addBannerQuick(this);
	}

	initBtnGroup() {
		this.unlockGroup.visible = false;
		this.lockedGroup.visible = false;

		var uiIcon = this.eventInfo.uiIcon[0];

		//未锁
		if (uiIcon == "fogstreet_door_unlocked") {
			this.unlockGroup.visible = true;
		} else if (uiIcon == "fogstreet_door_locked") {
			this.lockedGroup.visible = true;

			//开门消耗的道具ID;降低行动力消耗的角色ID;降低后行动力消耗值;
			var params = this.eventInfo.params;
			this.keyCostId = params[0];
			var reduceRole = params[1];

			var name = RolesFunc.instance.getRoleInfoById(reduceRole[0]).name;
			var roleName = TranslateFunc.instance.getTranslate(name, "TranslateRole");
			//判断是否有降低消耗的角色
			if (reduceRole) {
				var line = FogModel.instance.getLine();
				if (line.hasOwnProperty(reduceRole)) {
					this.actCostNum = params[2];
					this.doorDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[1], "TranslateEvent");

				} else {
					this.actCostNum = this.events.mobilityCost || 0;
					this.doorDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
				}

			} else {
				this.doorDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
				this.actCostNum = this.events.mobilityCost || 0;
			}

			//消耗行动力数
			this.actLab.text = "-" + this.actCostNum;

			//玩家钥匙数量
			this.keyNum.text = StringUtils.getCoinStr(FogModel.instance.getPropNum(this.keyCostId) + "");
		}
	}

	onClickDirectOpen() {
		this.finishCallBack();
	}

	onClickKeyOpen() {
		var userOwnKeyNum = FogModel.instance.getPropNum(this.keyCostId);
		if (userOwnKeyNum < 1) {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughkey"));
			return;
		}
		FogServer.getReward({"cost": [DataResourceType.FOGITEM, this.keyCostId, 1]}, this.finishCallBack, this);
	}

	onClickActOpen() {
		var userActNum = FogModel.instance.getActNum()
		if (userActNum < this.actCostNum) {
			FogModel.instance.checkFreeAct();
			return;
		}

		FogServer.getReward({"cost": [DataResourceType.ACT, this.actCostNum]}, this.finishCallBack, this);
	}

	finishCallBack() {
		this.isFinish = true;
		this.close();
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogDoorUI);
		if (this.isFinish) {
			this.callBack && this.callBack.call(this.thisObj);
		}
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}