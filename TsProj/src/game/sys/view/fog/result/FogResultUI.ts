import {ui} from "../../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../../framework/utils/ButtonUtils";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";
import WindowManager from "../../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../../consts/WindowCfgs";
import IMessage from "../../../interfaces/IMessage";
import FogModel from "../../../model/FogModel";
import StringUtils from "../../../../../framework/utils/StringUtils";
import FogConst from "../../../consts/FogConst";
import FogFunc from "../../../func/FogFunc";
import ShareOrTvManager from "../../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../../func/ShareTvOrderFunc";
import UserInfo from "../../../../../framework/common/UserInfo";
import StatisticsManager from "../../../manager/StatisticsManager";
import GlobalParamsFunc from "../../../func/GlobalParamsFunc";
import CacheManager from "../../../../../framework/manager/CacheManager";
import StorageCode from "../../../consts/StorageCode";
import TimerManager from "../../../../../framework/manager/TimerManager";
import TweenAniManager from "../../../manager/TweenAniManager";
import DataResourceServer from "../../../server/DataResourceServer";
import {DataResourceType} from "../../../func/DataResourceFunc";
import ButtonConst from "../../../../../framework/consts/ButtonConst";
import FogServer from "../../../server/FogServer";
import FogPropTrigger from "../../../../fog/trigger/FogPropTrigger";
import TaskServer from "../../../server/TaskServer";
import TaskConditionTrigger from "../../../trigger/TaskConditionTrigger";


export default class FogResultUI extends ui.gameui.fog.FogResultUI implements IMessage {

	private freeType;
	private resultCount;
	private resultRatio;
	private reward;
	private posArr = [];
	private thisObj;
	public addPercent = 1;

	constructor() {
		super();
		new ButtonUtils(this.returnLab, this.oneReceive, this);
		new ButtonUtils(this.returnBtn, this.oneReceive, this);
		new ButtonUtils(this.multiBtn, this.multiReceive, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.onClickContinue);
	}

	public setData(data) {
		BannerAdManager.addBannerQuick(this);
		this.addPercent = 1;
		this.reward = {};
		this.posArr = [12, 144, 277, 412];
		this.resultRatio = 1;

		this.thisObj = data && data.thisObj;

		//最大层数
		this.maxLayer.text = FogModel.instance.getCurLayer() + 1 + "";
		//获得零件数
		this.compNum.text = "X" + StringUtils.getCoinStr(FogModel.instance.getCompNum() + "");
		//获得道具数
		this.itemNum.text = "X" + StringUtils.getCoinStr(FogModel.instance.getPropTotalNum() + "");
		//完成事件数
		this.eventNum.text = "X" + StringUtils.getCoinStr(FogModel.instance.getCountsById(FogConst.FOG_COUNT_EVENTFINISH) + "");
		//击败敌人数
		this.killNum.text = "X" + StringUtils.getCoinStr(FogModel.instance.getCountsById(FogConst.FOG_COUNT_FIGHTENEMY) + "");

		this.scoreGroup.visible = false;
		this.bottumGroup.visible = false;
		this.coinNum.visible = false;
		this.fogCoinNum.visible = false;

		//总积分
		var totalScore = FogFunc.instance.getScore();
		this.scoreNum.text = totalScore + "";
		StatisticsManager.ins.onEvent(StatisticsManager.FOG_END, {layer: this.maxLayer.text, totalScore: totalScore})
		FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_AddResultReward, this)
		//获得的奖励:奖励数组
		this.reward = FogFunc.instance.calcuResultReward(totalScore, this.addPercent);
		//按钮初始化
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_MULTI_RESULT);
		if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE || (!this.reward[0] && !this.reward[1])) {
			this.multiBtn.visible = false;
			this.returnBtn.visible = true;
			this.returnLab.visible = false;

		} else {
			this.multiBtn.visible = true;
			this.returnBtn.visible = false;
			this.returnLab.visible = false;
			//延迟出现
			var starRewardLeaveTime = GlobalParamsFunc.instance.getDataNum("starRewardLeaveTime");
			TimerManager.instance.add(() => {
				this.returnLab.visible = true;
			}, this, starRewardLeaveTime, 1);

			this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_SETTLEMANT_SHOW);
			} else if (this.freeType == ShareOrTvManager.TYPE_SHAREVIDEO) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_CHOOSE_SHOW);
			}
		}


		this.resultCount = CacheManager.instance.getLocalCache(StorageCode.storage_fogBattleResultCount);
		if (!this.resultCount) {
			this.resultCount = 0;
		}
		var settlementDouble = GlobalParamsFunc.instance.getDataArray('settlementDouble');
		this.resultRatio = settlementDouble[this.resultCount % settlementDouble.length];
		this.freeLab.text = this.resultRatio + '倍领取';


		this.addTimer();
		TaskServer.updateTaskProcess({logicType: TaskConditionTrigger.taskCondition_fogResultCount})

	}

	//加定时器
	addTimer() {
		for (var i = 0; i <= 3; i++) {
			TimerManager.instance.setTimeout((data) => {
				TweenAniManager.instance.horizontalAni(this["item" + data[0]], this.posArr[data[0]], () => {
					if (data[0] == 3) {
						this.scoreGroup.visible = true;
						this.bottumGroup.visible = true;
						this.addTxtTimer();
					}
				}, this, 400);
			}, this, i * 500, [i]);
		}
	}

	//资源文字定时器
	addTxtTimer() {
		TimerManager.instance.setTimeout(() => {
			this.txtTween(this.fogCoinNum, 0, this.reward[1]);
		}, this, 200);
		TimerManager.instance.setTimeout(() => {
			this.txtTween(this.coinNum, 0, this.reward[0]);
		}, this, 600);
	}

	txtTween(item, num, addResNum) {
		if (item.visible) {
			return;
		}
		item.visible = true;
		item.text = StringUtils.getCoinStr(num);
		item.scaleX = item.scaleY = 1;

		//播放数字变化效果
		Laya.Tween.to(item, {scaleX: 1.3, scaleY: 1.3}, 200, null, Laya.Handler.create(this, () => {
			item.text = "X" + StringUtils.getCoinStr(num + Number(addResNum));
			item.color = "#02a43c";
		}));
		TimerManager.instance.setTimeout(() => {
			item.scaleX = item.scaleY = 1;
			item.color = "#ffffff";
		}, this, 600);
	}

	onClickContinue() {
		this.removeTimer();

		//全部显示出来
		for (var i = 0; i <= 3; i++) {
			this["item" + i].x = this.posArr[i];
		}

		this.scoreGroup.visible = true;
		this.bottumGroup.visible = true;
		this.coinNum.visible = true;
		this.fogCoinNum.visible = true;

		this.coinNum.text = "X" + StringUtils.getCoinStr(this.reward[0] + "");
		this.fogCoinNum.text = "X" + StringUtils.getCoinStr(this.reward[1] + "");

	}

	removeTimer() {
		for (var i = 0; i <= 3; i++) {
			Laya.Tween.clearAll(this["item" + i]);
		}
		Laya.Tween.clearAll(this.fogCoinNum);
		Laya.Tween.clearAll(this.coinNum);
	}

	//多被领取
	multiReceive() {
		StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_SETTLEMANT_CLICK);
		if (UserInfo.isTT()) {
			ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_MULTI_RESULT, ShareOrTvManager.TYPE_SHAREVIDEO, null, this.successCall, () => {
			}, this, ShareOrTvManager.TYPE_SHAREVIDEO);
		} else {
			ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_MULTI_RESULT, ShareOrTvManager.TYPE_ADV, {
				id: "1",
				extraData: {}
			}, this.successCall, () => {
			}, this);
		}
	}

	successCall() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_SETTLEMANT_FINISH);
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_SETTLEMENT_FINISH);
		}
		//多倍奖励
		var reward = {
			[DataResourceType.COIN]: this.reward[0] * this.resultRatio,
			[DataResourceType.FOGCOIN]: this.reward[1] * this.resultRatio,
		};
		// 领取次数增加
		this.resultCount++;
		DataResourceServer.updateResource({"res": reward, "rewardCount": this.resultCount}, this.close, this);
	}

	//单倍领取
	oneReceive() {
		//多倍奖励
		var reward = {
			[DataResourceType.COIN]: this.reward[0],
			[DataResourceType.FOGCOIN]: this.reward[1],
		};
		// 领取次数增加
		this.resultCount++;
		DataResourceServer.updateResource({"res": reward, "rewardCount": this.resultCount}, this.close, this);
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogResultUI);
		this.thisObj && this.thisObj.exitBattle();
		FogServer.exitGame();
		WindowManager.SwitchUI(WindowCfgs.GameMainUI, WindowCfgs.FogMainUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}