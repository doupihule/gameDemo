import StatisticsManager from "../../manager/StatisticsManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import GameMainEvent from "../../event/GameMainEvent";
import Message from "../../../../framework/common/Message";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ResourceConst from "../../consts/ResourceConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import CountsModel from "../../model/CountsModel";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TurnableFunc from "../../func/TurnableFunc";
import UserExtModel from "../../model/UserExtModel";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import {DataResourceType} from "../../func/DataResourceFunc";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import DataResourceServer from "../../server/DataResourceServer";
import RedPointConst from "../../consts/RedPointConst";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";

export default class TurnableUI extends ui.gameui.main.TurnableUI implements IMessage {

	private _isRotating: boolean = false;
	private nowCount: number = 0;
	private maxFreeCount: number = 3;
	//当前转盘的角度
	private nowRotation: number = 0;
	private canShare: boolean = false;
	private canVideo: boolean = false;

	/**进度条底宽 */
	private progressDiWidth = 399;

	private boxArr;
	private freeType;
	private callBack;
	private thisObj;

	constructor() {
		super();
		this.addEvent();

		new ButtonUtils(this.closeBtn, this.onCloseBtnClick, this);
		new ButtonUtils(this.cjBtn, this.onClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
	}

	/**添加事件监听 */
	addEvent() {

	}

	setData(data): void {
		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;
		BannerAdManager.addBannerQuick(this);
		AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_Turnable, this);
		//转盘奖励初始化
		this.initRewardList();
		//界面剩余初始化
		this.freshView();
	}

	//奖励列表
	initRewardList() {
		//转盘奖励
		var rewardList = TurnableFunc.instance.getRewardList();

		for (var i = 0; i < 8; i++) {
			var rewardStr = rewardList[i];
			var rewardInfo = rewardStr.split(",");
			var type = rewardInfo[0];
			var icon;
			switch (Number(rewardInfo[0])) {
				case DataResourceType.COIN:
					icon = ResourceConst.COIN_PNG;
					break;
				case DataResourceType.GOLD:
					icon = ResourceConst.GOLD_PNG;
					break;
			}
			this["rewardIcon" + i].skin = icon;
			this["rewardCount" + i].changeText(StringUtils.getCoinStr(rewardInfo[1]));
		}
	}


	freshView() {
		//剩余次数
		this.maxFreeCount = GlobalParamsFunc.instance.getDataNum("luckyPlateFreeNub");
		this.nowCount = CountsModel.instance.getCountsById(CountsModel.freeTurnableCount);
		this.turnCountTxt.changeText("累计次数:" + this.nowCount);

		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_TURNABLE);
		if (this.nowCount < this.maxFreeCount || this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
			this.freeGroup.visible = true;
			this.cjBtn.skin = "uisource/common/common/common_bt_anniu2.png";
			this.videoGroup.visible = false;
		} else if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE && this.nowCount >= this.maxFreeCount) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_PLANT_SHOW);
			this.freeGroup.visible = false;
			this.videoGroup.visible = true;
			this.cjBtn.skin = "uisource/common/common/common_bt_anniu2.png";
			this.adImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);

		}
		this.freshBox();
	}

	//刷新宝箱
	freshBox() {
		//累计宝箱最大次数
		var maxCount = Number(TurnableFunc.instance.getLastCount());
		this.progressImg.width = this.progressDiWidth * this.nowCount / maxCount > this.progressDiWidth ? this.progressDiWidth : this.progressDiWidth * this.nowCount / maxCount;
		if (!this.boxArr) {
			this.boxArr = [];
			var boxData = TurnableFunc.instance.getAllLuckyPlateBox();
			for (var key in boxData) {
				if (boxData.hasOwnProperty(key)) {
					var item = boxData[key];
					var boxImg: Laya.Image = new Laya.Image("uisource/turnable/turnable/luckplate_icon_baoxiang" + item.plateBoxId + "_1.png");
					boxImg.x = this.progressDiWidth * item.addUpNub / maxCount;
					boxImg.y = -29;
					boxImg.anchorX = 0.5;
					boxImg.anchorY = 0.5;
					var countTxt: Laya.Label = new Laya.Label(item.addUpNub + "");
					countTxt.x = this.progressDiWidth * item.addUpNub / maxCount - 8;
					countTxt.y = 24;
					countTxt.fontSize = 24;
					countTxt.color = "#000000";
					this.boxGroup.addChild(boxImg);
					this.boxGroup.addChild(countTxt);
					if (Number(key) != Object.keys(boxData).length) {
						var tiao: Laya.Image = new Laya.Image("uisource/turnable/turnable/video_image_jindu3.png");
						tiao.x = this.progressDiWidth * item.addUpNub / maxCount;
						tiao.y = 0;
						this.boxGroup.addChild(tiao);
					}

					this.boxArr.push({
						img: boxImg,
						count: item.addUpNub,
						index: item.plateBoxId,
						reward: item.boxReward,
					})
				}
			}
		}

		for (var i = 0; i < this.boxArr.length; i++) {
			var item = this.boxArr[i];
			item.img.touchEnabled = false;
			var receiveCount = UserExtModel.instance.getBoxGetCount(item.index);
			if (this.nowCount >= item.count && receiveCount) {
				item.img.skin = "uisource/turnable/turnable/luckplate_icon_baoxiang" + item.index + "_2.png";
				Laya.Tween.clearAll(item.img);
			} else {
				item.img.skin = "uisource/turnable/turnable/luckplate_icon_baoxiang" + item.index + "_1.png";
				item.img.mouseEnabled = true;
				if (this.nowCount >= item.count && !receiveCount) {
					Laya.Tween.clearAll(item.img);
					item.img.scaleX = item.img.scaleY = 1;
					new ButtonUtils(item.img, this.onClickBoxItem, this, null, null, item).setBtnType(ButtonConst.BUTTON_TYPE_4);
				} else {
					if (!item.img.hasListener(Laya.Event.MOUSE_DOWN)) {
						new ButtonUtils(item.img, this.onClickBoxItem, this, null, null, item);
					}
				}
			}
		}
	}

	onClickBoxItem(item) {
		item.img.mouseEnabled = false;
		var isCanReceive = false;
		if (this.nowCount >= item.count) {
			isCanReceive = true;
		}
		WindowManager.OpenUI(WindowCfgs.BoxInfoUI, {
			callBack: this.freshBox,
			thisObj: this,
			item: item,
			isCanReceive: isCanReceive
		});
	}


	onClick() {
		if (this.nowCount >= this.maxFreeCount && this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_counts_limit_lab"));
			return;
		}

		if (this._isRotating) {
			return;
		}

		this._isRotating = true;

		//免费抽
		if (this.nowCount < this.maxFreeCount) {
			DataResourceServer.getTurnTableReward({}, this.startRotate, this);
			var nowCount = CountsModel.instance.getCountsById(CountsModel.freeTurnableCount);
			if (nowCount == this.maxFreeCount) {
				//刷新主界面气泡显示
				Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_TURNTABLE);
			}
		}
		//视频或者分享抽
		else {
			//刷新主界面气泡显示
			Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_TURNTABLE);

			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_PLANT_CLICK);
			}

			ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_TURNABLE, ShareOrTvManager.TYPE_ADV,
				{
					id: "1",
					extraData: {}
				},
				this.successfull, this.closefull, this);
		}
	}

	successfull() {
		DataResourceServer.getTurnTableReward({}, this.startRotate, this);
		//打点
		if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_TURNTABLE_FINISH);
		} else {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_PLANTSUCEEDNUB);
		}
	}

	closefull() {
		this._isRotating = false;
		this.freshView();
		WindowManager.ShowTip("看完视频才能抽奖");
	}

	//开始旋转
	startRotate(data) {
		if (data.error) {
			this._isRotating = false;
			return;
		}
		;
		var index = data.data.randValue;

		//初始化角度
		this.nowRotation = this.nowRotation % 360;
		this.rotateGroup.rotation = this.nowRotation;
		this.zpZhenImg.rotation = 0;

		var speedUpRotation = 360 + this.nowRotation;        //加速过程旋转的角度
		var time0 = 1163;                                   //加速时间
		var constantSpeedRotation = speedUpRotation + 7 * 360; //匀速时转的角度  (30为图片角度偏差)
		var time1 = 1467;                                   //匀速旋转时间
		var slowDownRotation = index * 45 - this.nowRotation + 360 + constantSpeedRotation;   //减速时旋转角度（转到服务器指定的奖励）

		var time2 = 421;                                   //减速时间

		Laya.Tween.to(this.rotateGroup, {rotation: speedUpRotation}, time0, Laya.Ease.circIn, Laya.Handler.create(this, () => {
			Laya.Tween.to(this.rotateGroup, {rotation: constantSpeedRotation}, time1, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(this.rotateGroup, {rotation: slowDownRotation}, time2, Laya.Ease.circOut, Laya.Handler.create(this, () => {
					TimerManager.instance.setTimeout(() => {
						this._isRotating = false;
						this.nowRotation = this.rotateGroup.rotation;
						this.freshView();
						this.showRewardView(index);
					}, this, 300);
				}))
			}))
		}));
	}

	//显示奖励，转盘转完再加奖励
	showRewardView(index) {
		var rewardData = TurnableFunc.instance.getRewardList();
		var rewardInfo = rewardData[index].split(",");

		DataResourceServer.getReward({"reward": [Number(rewardInfo[0]), rewardInfo[1]]});
		if (Number(rewardInfo[0]) == DataResourceType.COIN) {
			WindowManager.ShowTip("获得金币 x" + StringUtils.getCoinStr(rewardInfo[1]))
		} else if (Number(rewardInfo[0]) == DataResourceType.GOLD) {
			WindowManager.ShowTip("获得钻石 x" + rewardInfo[1])
		}
	}

	onCloseBtnClick() {
		WindowManager.CloseUI(WindowCfgs.TurnableUI);
		this.callBack && this.callBack.call(this.thisObj)
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}


