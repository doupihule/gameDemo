import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import FogFunc from "../../func/FogFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import ChapterConst from "../../consts/ChapterConst";
import FogServer from "../../server/FogServer";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import StatisticsManager from "../../manager/StatisticsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";


export default class ChapterBoxRewardUI extends ui.gameui.chapter.ChapterBoxRewardUI implements IMessage {

	private itemArr;//奖励数组
	private callBack;
	private thisObj;
	private shareName;
	private doubleRate = 1
	private freeType;
	private params
	private receiveCall;
	private viewType;
	private adPrc;

	constructor() {
		super();
		new ButtonUtils(this.closeBtn, this.close, this);
		new ButtonUtils(this.sureBtn, this.close, this);
		new ButtonUtils(this.normalReceiveBtn, this.onClickReceive, this);
		new ButtonUtils(this.doubleReceiveBtn, this.onClickDouble, this);
	}

	public setData(data) {
		BannerAdManager.addBannerQuick(this);
		BannerAdManager.addTopBannerStyleJump(this);
		this.itemArr = [];

		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;
		this.viewType = data && data.viewType;
		this.adPrc = data && data.adPrc;
		this.itemArr = data.reward
		var type = data.type;
		this.doubleRate = data && data.doubleRate
		this.shareName = data && data.shareName
		var desc = data && data.desc
		this.params = data && data.params
		if (type == ChapterConst.Chapter_boxState_lock) {
			//锁定
			this.sureBtn.visible = true;
			this.receiveGroup.visible = false;
			this.hasReceiveTxt.visible = false;
		} else if (type == ChapterConst.Chapter_boxState_unlock) {
			//解锁
			this.sureBtn.visible = false;
			this.receiveGroup.visible = true;
			this.hasReceiveTxt.visible = false;
			this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareName, ShareOrTvManager.TYPE_SHARE);
			if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
				this.doubleReceiveBtn.visible = false;
				this.normalReceiveBtn.x = 134
			} else {
				this.normalReceiveBtn.x = 30;
				this.doubleReceiveBtn.visible = true;
				this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
				//   this.adImg.skin = ShareOrTvManager.instance.setShareOrTvImg(this.shareName, ShareOrTvManager.TYPE_SHARE);
				// this.doubleTxt.text = TranslateFunc.instance.getTranslate("#tid_receiveReward_rate", null, this.doubleRate);
				this.addShowEvent();
			}
		} else if (type == ChapterConst.Chapter_boxState_receive) {
			//已领取
			this.sureBtn.visible = false;
			this.receiveGroup.visible = false;
			this.hasReceiveTxt.visible = true;
		}
		this.lbl_desc.text = desc;
		this.levelImg.visible = false;
		this.activeImg.visible = false;
		this.workImg.visible = false;

		if (this.shareName == ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD) {
			this.levelImg.visible = true;
		} else if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD) {
			this.activeImg.visible = true;
		}
		if (this.viewType == "work") {
			this.workImg.visible = true;
		}
		//奖励列表初始化
		this.initReward();
	}

	initReward() {
		this.itemList.repeatX = this.itemArr.length;
		this.itemList.array = this.itemArr;
		if (this.itemArr.length == 1) {
			this.itemList.width = 127;
		} else if (this.itemArr.length == 2) {
			this.itemList.width = 257;
		} else if (this.itemArr.length == 3) {
			this.itemList.width = 383;
		} else if (this.itemArr.length > 3) {
			this.itemList.width = 390;
		}
		this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
		this.itemList.scrollTo(0);
	}

	onListRender(cell: Laya.Box, index: number) {
		var data = this.itemList.array[index];
		var item = cell.getChildByName("item")
		var itemLab = item.getChildByName("itemLab") as Laya.Label;
		var itemIcon = item.getChildByName("itemIcon") as Laya.Image;
		var result = FogFunc.instance.getResourceShowInfo(data, false, this.adPrc);
		itemLab.text = StringUtils.getCoinStr(result["num"]);
		itemIcon.scale(result.scale, result.scale)
		itemIcon.skin = result["icon"];
	}

	onClickReceive() {
		if (this.receiveCall) {
			this.receiveCall.call(this.thisObj)
		} else {
			this.receiveReard(1);
		}
	}

	onClickDouble() {
		this.addClickEvent();
		ShareOrTvManager.instance.shareOrTv(this.shareName, ShareOrTvManager.TYPE_SHARE,
			{
				id: "1",
				extraData: {}
			}, this.receiveReard.bind(this, this.doubleRate), null, this);
	}

	//领取奖励
	receiveReard(rate = 1) {
		if (rate == this.doubleRate) {
			this.addSuccEvent();
		}
		FogServer.getReward({reward: this.itemArr, doubleRate: rate}, this.finishCallBack, this);
	}

	//展示打点
	addShowEvent() {
		if (this.shareName == ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_CHAPTERBOX_SHOW, this.params);
		} else if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKBOX_SHOW, this.params);
		}
	}

	//点击打点
	addClickEvent() {
		if (this.shareName == ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD) {
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_CHAPTERBOX_CLICK, this.params);
			}
		} else if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKBOX_CLICK, this.params);
		}
	}

	//展示成功打点
	addSuccEvent() {
		if (this.shareName == ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD) {
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_CHAPTERBOX_FINISH, this.params);
			} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_CHAPTERBOX_FINISH, this.params);
			}
		} else if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD) {
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKBOX_FINISH, this.params);
			} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_TASKBOX_FINISH, this.params);
			}
		}
	}

	finishCallBack() {
		// this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareName, ShareOrTvManager.TYPE_SHARE);
		// if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
		//     this.callBack & this.callBack.call(this.thisObj)
		// } else {
		//     WindowManager.OpenUI(WindowCfgs.ChapterBoxDoubleUI, {
		//         callBack: this.callBack,
		//         thisObj: this.thisObj,
		//         reward: this.itemArr,
		//         doubleRate: this.doubleRate,
		//         shareName: this.shareName,
		//         params: this.params
		//     })
		// }
		this.close();
		this.callBack & this.callBack.call(this.thisObj)
	}

	close() {
		if (this.viewType == "work") {
			this.callBack && this.callBack.call(this.thisObj)
		}
		WindowManager.CloseUI(WindowCfgs.ChapterBoxRewardUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}