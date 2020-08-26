import {ui} from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../../framework/utils/ButtonUtils";
import FogFunc from "../../../func/FogFunc";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import GameUtils from "../../../../../utils/GameUtils";
import DataResourceFunc, {DataResourceType} from "../../../func/DataResourceFunc";
import StringUtils from "../../../../../framework/utils/StringUtils";
import ShareOrTvManager from "../../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../../func/ShareTvOrderFunc";
import FogServer from "../../../server/FogServer";
import UserModel from "../../../model/UserModel";
import BigNumUtils from "../../../../../framework/utils/BigNumUtils";
import FogModel from "../../../model/FogModel";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import Message from "../../../../../framework/common/Message";
import FogEvent from "../../../event/FogEvent";


export default class FogBusinessmanUI extends ui.gameui.fog.FogBusinessmanUI implements IMessage {

	private eventId;//事件id
	private eventInfo;//事件cfg
	private reward;//随机出得item数组
	private costArr;//消耗数组
	private freeType;
	private rewardArr = [];

	private callBack;
	private thisObj;

	//格子事件
	private events: FogEventData
	//格子
	private cell: FogInstanceCell;

	constructor() {
		super();
		new ButtonUtils(this.btn_close, this.close, this);
		new ButtonUtils(this.buyBtn, this.onClickBuy, this);
		new ButtonUtils(this.freeBuyBtn, this.onClickFreeBuy, this);
	}

	public setData(data) {
		this.costArr = [];
		this.reward = [];
		this.rewardArr = [];
		this.callBack = null;
		this.thisObj = null;


		this.events = data.event;
		this.cell = data.cell;
		this.eventId = this.events.eventId;
		this.eventInfo = this.events.cfgData;


		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;

		var params = this.eventInfo.params[0];
		//判断事件里面是否有保存的奖励数据
		if (this.events.eventData && this.events.eventData.reward && Object.keys(this.events.eventData.reward).length != 0) {
			this.reward = FogFunc.instance.vertRewardTableToArr(this.events.eventData.reward)[0];
			this.rewardArr = FogFunc.instance.vertRewardTableToArr(this.events.eventData.reward);

		} else {
			//事件参数：掉落组ID,消耗类型,ID（可不配）,数量;
			var dropId = params[0];
			var reward = FogFunc.instance.getDropGroupReward(dropId);
			this.reward = GameUtils.getWeightItem(reward);
			this.rewardArr.push(this.reward);

			//保存事件随机出的奖励
			FogServer.addCellEvent({cellId: this.cell.mySign, rewardArr: this.rewardArr, id: this.eventId}, null, null);

		}


		//购买消耗
		this.costArr = params.length == 4 ? [params[1], params[2], params[3]] : [params[1], params[2]];
		var costResult = DataResourceFunc.instance.getDataResourceInfo(this.costArr);
		this.costNum.text = StringUtils.getCoinStr(costResult["num"]);
		this.costImg.skin = costResult["img"];

		this.upperLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc, "TranslateEvent", [costResult["num"]]);

		//道具组展示
		var result = FogFunc.instance.getResourceShowInfo(this.rewardArr[0]);
		this.roleName.text = result["name"];
		this.roleImg.skin = result["icon"];
		this.roleDesc.text = result["desc"];

		//标题
		this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");

		//按钮初始化
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_EVENT_BUSINESSMAN);
		if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.freeBuyBtn.visible = false;
			this.buyBtn.x = 294;
		} else {
			this.freeBuyBtn.visible = true;
			this.buyBtn.x = 158;
			this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
		}

	}

	//消耗货币购买
	onClickBuy() {
		//判断货币是否充足
		switch (Number(this.costArr[0])) {
			case DataResourceType.GOLD:
				var gold = UserModel.instance.getGold();
				if (Number(this.costArr[1]) > Number(gold)) {
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
					return;
				}
				break;
			case DataResourceType.COIN:
				if (BigNumUtils.compare(Number(this.costArr[1]), UserModel.instance.getCoin())) {
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));
					return;
				}
				break;
			//零件
			case DataResourceType.COMP:
				if (Number(this.costArr[1]) > FogModel.instance.getCompNum()) {
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcomp"));
					return;
				}
				break;
			//迷雾币
			case DataResourceType.FOGCOIN:
				if (Number(this.costArr[1]) > UserModel.instance.getFogCoinNum()) {
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughfogcoin"));
					return;
				}
				break;
		}


		//消耗行动力判断
		var userActNum = FogModel.instance.getActNum()
		if (userActNum < Number(this.events.mobilityCost)) {
			FogModel.instance.checkFreeAct();
			return;
		}

		FogServer.businessBuy({
			"cost": this.costArr,
			"reward": [this.reward],
			"costAct": this.events.mobilityCost
		}, this.buyCallBack, this);
		//保存FogReward数据
		FogServer.saveFogReward({"reward": [this.reward]});
	}

	buyCallBack() {
		this.close();
		//刷新当前事件的状态
		Message.instance.send(FogEvent.FOGEVENT_REFRESH_CELLEVENT, {cell: this.cell});
		//购买或领取成功后，弹获得奖励弹窗
		WindowManager.OpenUI(WindowCfgs.FogComRewardUI, {
			"reward": this.rewardArr,
			cell: this.cell,
			callBack: this.finishOpen,
			thisObj: this
		});
	}

	//完成弹窗奖励展示后，刷新后置事件的显示
	finishOpen() {
		Message.instance.send(FogEvent.FOGEVENT_REFRESH_BEHINDEVENT, {cell: this.cell})
	}

	//看视频免费获得
	onClickFreeBuy() {

		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_EVENT_BUSINESSMAN, ShareOrTvManager.TYPE_ADV, {
				id: "1",
				extraData: {}
			},
			this.successfull, () => {
			}, this);
	}

	successfull() {
		FogServer.businessBuy({"reward": [this.reward]}, this.buyCallBack, this);
		//保存FogReward数据
		FogServer.saveFogReward({"reward": [this.reward]});
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogBusinessmanUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}