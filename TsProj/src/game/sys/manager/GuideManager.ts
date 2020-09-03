import IMessage from "../interfaces/IMessage";
import WindowManager from "../../../framework/manager/WindowManager";
import StatisticsManager from "./StatisticsManager";

import UserModel from "../model/UserModel";
import GuideFunc from "../func/GuideFunc";
import {WindowCfgs} from "../consts/WindowCfgs";

export default class GuideManager implements IMessage {

	static GuideType: any = {
		Auto: 1,
		Static: 2,
		None: 3
	}

	public constructor() {
	}

	public noMask = false;

	private static _ins: GuideManager;
	private point = {x:0,y:0};

	public recentGuideId;//上一步引导Id
	public nowGuideId;//当前引导Id
	public nowGuideSkip;//引导跳过打点

	static maxGuide = 10;

	static get ins(): GuideManager {
		if (!GuideManager._ins) {
			GuideManager._ins = new GuideManager();
		}
		return GuideManager._ins;
	}

	/*
	{
		1001:{
			type: 10,//显示类型
			bottom: 265,
			top: NaN,
			x: 0,
			y: ScreenAdapterTools.height - 108 - 30,
			width: 107,
			height: 108,
			statisticsIndex: StatisticsManager.GUIDE_EQUIPSHOP_3,//完成打点
			guideSkip: StatisticsManager.GUIDE_EQUIPSHOP_SKIP,//跳过打点
		}
	}
	*/
	public guideData = {

	};

	/**
	 *   初始化引导位置
	 */
	public setGuideData(guideId, type, object = null, parentUI = null, width = null, height = null, x = null, y = null, extra = null) {

	}

	/**
	 *   获取记录过的引导位置信息
	 */
	public getGuideData(guideId) {
		var data = this.guideData[guideId];
		return data;
	}

	/**
	 *   获取副引导是否完成
	 */
	public isGuideFin(guideId) {
		var flag = UserModel.instance.getSubGuide()[String(guideId)];
		if (flag) {
			return true;
		}
		return false;
	}

	public enterGuideRoom(uiName) {
	}


	public checkMainGuide() {
		if (UserModel.instance.getMainGuide() == 0) {
			return true;
		}
		return false;
	}

	public isMainGuideNeed(guideId, lastGuideId?, lastGuideId2?) {
	}

	public clearGuide() {
		WindowManager.CloseGuideUI(WindowCfgs.TalkFrameUI);
	}

	recvMsg() {
	}

	//打开引导界面（遮罩）
	openGuideUI(id, callBack = null, thisObj = null, skipCall = null) {
		this.nowGuideId = id;
		// if (WindowManager.isUIOpened(WindowCfgs.SevenDaysUI)) {
		//     WindowManager.CloseUI(WindowCfgs.SevenDaysUI);
		// }
		var guideData = GuideFunc.instance.getGuideInfo(id);
		this.nowGuideId = id;
		LogsManager.echo("krma. GameData.nowGuideId = " + this.nowGuideId);
		var x = 0;
		var y = 0;
		var width = 0;
		var height = 0;
		var type = 7;

		var position = null;

		var guideId = id;

		position = GuideManager.ins.getGuideData(guideId);

		if (position) {
			if (position.statisticsIndex)
				StatisticsManager.ins.onEvent(position.statisticsIndex);
			if (position.statisticsIndexExtra)
				StatisticsManager.ins.onEvent(position.statisticsIndexExtra);
			this.nowGuideSkip = position.guideSkip;
			type = position.type;

			x = position.x || x;
			y = position.y || y;
			width = position.width || width;
			height = position.height || height;
		}
		if (guideData.style != null) {
			type = guideData.style;
		}


		// if (this.guideUI || this.guideUI == 0) {
		WindowManager.OpenGuideUI(WindowCfgs.GuideUI, [guideId, x, y, width, height, type, guideData.maskTransparency * 0.01, position, callBack, thisObj, skipCall]);
		// }

		// Message.instance.send(GuideEvent.GUIDE_EVENT_OPENGUIDE);
	}

	//单步引导完成
	guideFin(guideId, callBack, thisObj, needSync = false) {
	}
}