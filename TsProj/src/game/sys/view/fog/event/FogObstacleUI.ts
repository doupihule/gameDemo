import {ui} from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../../framework/utils/ButtonUtils";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import ShareOrTvManager from "../../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../../func/ShareTvOrderFunc";
import FogServer from "../../../server/FogServer";
import FogModel from "../../../model/FogModel";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import FogEventTrigger from "../../../../fog/trigger/FogEventTrigger";
import StatisticsManager from "../../../manager/StatisticsManager";


export default class FogObstacleUI extends ui.gameui.fog.FogObstacleUI implements IMessage {

	private eventId;//事件id
	private eventInfo;//事件cfg
	private freeType;
	private shareTvOrderId;


	private callBack;
	private noPathCallBack;
	private thisObj;

	//格子事件
	private events: FogEventData
	//格子
	private cell: FogInstanceCell;

	private viewType;//界面类型
	private costAct;//消耗的行动力

	private isFinish = false;//事件是否完成

	constructor() {
		super();
		new ButtonUtils(this.btn_close, this.onclickClose, this);
		new ButtonUtils(this.costBtn, this.onClickCostBtn, this);
		new ButtonUtils(this.freeBtn, this.onClickFreeBtn, this);
	}

	public setData(data) {
		this.callBack = null;
		this.thisObj = null;
		this.isFinish = false;


		this.events = data.event;
		this.cell = data.cell;
		this.eventId = this.events.eventId;
		this.eventInfo = this.events.cfgData;


		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;
		this.noPathCallBack = data && data.noPathCallBack;

		this.viewType = this.eventInfo.logicType;


		//障碍物事件
		if (this.viewType == FogEventTrigger.Event_logical_Obstacle) {
			this.shareTvOrderId = ShareTvOrderFunc.SHARELINE_FOG_EVENT_REMOVE_OBSTACLE;
			this.freeLab.text = TranslateFunc.instance.getTranslate("#tid_obstacle_free_lab");
			this.costLab.text = TranslateFunc.instance.getTranslate("#tid_obstacle_cost_lab");
		}
		//坏掉的路
		else if (this.viewType == FogEventTrigger.Event_logical_Brokenroad) {
			this.shareTvOrderId = ShareTvOrderFunc.SHARELINE_FOG_EVENT_MEND_ROAD;
			this.freeLab.text = TranslateFunc.instance.getTranslate("#tid_brokenroad_cost_lab");
			this.costLab.text = TranslateFunc.instance.getTranslate("#tid_brokenroad_free_lab");
		}

		//标题
		this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
		//事件图片
		this.eventImg.skin = "fog/fog/" + this.eventInfo.uiIcon[0] + ".png";
		//事件消耗的行动力
		this.costAct = this.events.mobilityCost || 0;
		if (this.costAct) {
			this.costNum.text = "-" + this.costAct;
		} else {
			this.costNum.visible = false;
			this.costImg.visible = false;
		}
		// 描述
		this.descLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc, "TranslateEvent");


		//按钮初始化
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareTvOrderId);
		if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.freeBtn.visible = false;
			this.costGroup.x = 280;
		} else {
			this.freeBtn.visible = true;
			this.costGroup.x = 156;
			this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				if (this.viewType == FogEventTrigger.Event_logical_Obstacle) {
					StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_REMOVEBLOCK_SHOW);
				}
				//坏掉的路
				else if (this.viewType == FogEventTrigger.Event_logical_Brokenroad) {
					StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_BROKENROAD_SHOW);
				}
			}
		}

	}

	//消耗行动力
	onClickCostBtn() {
		//判断行动力是否充足
		if (this.costAct > FogModel.instance.getActNum()) {
			FogModel.instance.checkFreeAct();
			return;
		}

		FogServer.costAct({"cost": this.costAct}, () => {
			//障碍物消耗行动力默认完成事件，坏掉的路消耗行动力不属于完成事件
			if (this.viewType == FogEventTrigger.Event_logical_Obstacle) {
				this.isFinish = true;
			}
			this.close();
		}, this);
	}

	//看视频免费
	onClickFreeBtn() {
		if (this.viewType == FogEventTrigger.Event_logical_Obstacle) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_REMOVEBLOCK_CLICK);
		}
		//坏掉的路
		else if (this.viewType == FogEventTrigger.Event_logical_Brokenroad) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_BROKENROAD_CLICK);
		}

		ShareOrTvManager.instance.shareOrTv(this.shareTvOrderId, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.finishCallBack, () => {
		}, this);
	}

	finishCallBack() {
		//看完视频相当于完成事件
		this.isFinish = true;
		if (this.viewType == FogEventTrigger.Event_logical_Obstacle) {
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_REMOVEBLOCK_FINISH);
			} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_REMOVEBLOCK_FINISH);
			}
		}
		//坏掉的路
		else if (this.viewType == FogEventTrigger.Event_logical_Brokenroad) {
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_BROKENROAD_FINISH);
			} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_BROKENROAD_FINISH);
			}
		}

		this.close();
	}

	onclickClose() {
		WindowManager.CloseUI(WindowCfgs.FogObstacleUI);
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogObstacleUI);

		//事件完成后，再去执行刷新事件回调
		if (this.isFinish) {
			this.callBack && this.callBack.call(this.thisObj);
		} else {
			this.noPathCallBack && this.noPathCallBack.call(this.thisObj)
		}
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}